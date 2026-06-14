import {
  buildSessionContextHint,
  emptySessionContext,
  mergeEntitiesWithSession,
  parseCorpusContextNote,
  parseSessionContext,
  updateSessionContext,
} from './chat-session-context';
import type { ChatEntities } from './chatbot.types';

describe('chat session context carry-over', () => {
  const emptyEntities: ChatEntities = {
    score: null,
    subject_group: null,
    major: null,
    location: null,
    university_name: null,
    year: null,
    method_code: null,
  };

  it('mergeEntitiesWithSession fills null fields from session', () => {
    const session = updateSessionContext(
      emptySessionContext(),
      'search_university',
      {
        ...emptyEntities,
        university_name: 'PTIT',
        major: 'CNTT',
      },
    );

    const merged = mergeEntitiesWithSession(
      { ...emptyEntities, year: 2025 },
      session,
    );

    expect(merged.university_name).toBe('PTIT');
    expect(merged.major).toBe('CNTT');
    expect(merged.year).toBe(2025);
    expect(merged.score).toBeNull();
  });

  it('explicit university and major in message override session carry-over', () => {
    const session = updateSessionContext(
      emptySessionContext(),
      'ask_cutoff_score',
      {
        ...emptyEntities,
        university_name: 'HUST',
        major: 'Trí tuệ nhân tạo',
      },
    );

    const merged = mergeEntitiesWithSession(
      emptyEntities,
      session,
      'điểm chuẩn ngành hàng không của USTH thì sao',
    );

    expect(merged.university_name).toBe('USTH');
    expect(merged.major).toBe('Hàng không');
    expect(merged.year).toBeNull();
  });

  it('current turn entities override session carry-over', () => {
    const session = updateSessionContext(
      emptySessionContext(),
      'ask_cutoff_score',
      {
        ...emptyEntities,
        university_name: 'PTIT',
        major: 'CNTT',
        score: 24,
      },
    );

    const merged = mergeEntitiesWithSession(
      {
        ...emptyEntities,
        major: 'Sư phạm Toán',
        year: 2025,
      },
      session,
    );

    expect(merged.university_name).toBe('PTIT');
    expect(merged.major).toBe('Sư phạm Toán');
    expect(merged.score).toBe(24);
    expect(merged.year).toBe(2025);
  });

  it('buildSessionContextHint mirrors intent.txt context_note style', () => {
    const session = updateSessionContext(
      emptySessionContext(),
      'ask_tuition_fee',
      {
        ...emptyEntities,
        university_name: 'PTIT',
        major: 'CNTT',
      },
    );

    const hint = buildSessionContextHint(session);
    expect(hint).toContain('PTIT');
    expect(hint).toContain('CNTT');
  });

  it('parseCorpusContextNote extracts intent and entities from context_note', () => {
    const session = parseCorpusContextNote(
      'User vừa hỏi điểm chuẩn Bách Khoa ngành CNTT năm 2024',
    );

    expect(session.last_intent).toBe('ask_cutoff_score');
    expect(session.last_major).toBe('CNTT');
    expect(session.last_year).toBe(2024);
  });

  it('parseCorpusContextNote extracts compared universities from context_note', () => {
    const session = parseCorpusContextNote(
      'Turn trước người dùng so sánh NEU và FTU về điểm chuẩn ngành Logistics.',
    );

    expect(session.last_intent).toBe('compare_universities');
    expect(session.last_compared_universities).toEqual(
      expect.arrayContaining(['NEU', 'FTU']),
    );
  });

  it('parseSessionContext ignores invalid values', () => {
    const parsed = parseSessionContext({
      last_university: '  NEU ',
      last_score: 99,
      last_year: 1999,
      last_intent: 'ask_cutoff_score',
    });

    expect(parsed.last_university).toBe('NEU');
    expect(parsed.last_score).toBeNull();
    expect(parsed.last_year).toBeNull();
    expect(parsed.last_intent).toBe('ask_cutoff_score');
  });
});
