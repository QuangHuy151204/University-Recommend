import {
  asksMajorsInSchoolContext,
  asksUniversityOrPrograms,
  asksWhichSchoolsTeachMajor,
  classifyIntentRuleOnly,
  correctRuleIntent,
  extractExplicitUniversityFromMessage,
  extractParentheticalAcronym,
  isShortFollowUp,
  looksLikeCutoffScoreQuery,
} from './chatbot-intent-rules';

describe('chatbot-intent-rules helpers', () => {
  it('extractParentheticalAcronym', () => {
    expect(
      extractParentheticalAcronym(
        'học phí trường Khoa học và công nghệ Hà Nội (USTH)',
      ),
    ).toBe('USTH');
    expect(extractParentheticalAcronym('không có ngoặc')).toBeNull();
  });

  it('extractExplicitUniversityFromMessage finds acronym without parentheses', () => {
    expect(
      extractExplicitUniversityFromMessage(
        'điểm chuẩn ngành hàng không của USTH thì sao',
      ),
    ).toBe('USTH');
    expect(
      extractExplicitUniversityFromMessage(
        'cho tôi điểm chuẩn ngành AI của HUST',
      ),
    ).toBe('HUST');
  });

  it('asksMajorsInSchoolContext', () => {
    expect(asksMajorsInSchoolContext('có những ngành gì trong trường')).toBe(
      true,
    );
    expect(asksMajorsInSchoolContext('ngành CNTT ở Hà Nội')).toBe(false);
  });

  it('correctRuleIntent maps follow-up majors to search_university', () => {
    expect(
      correctRuleIntent('search_major', 'có những ngành gì trong trường'),
    ).toBe('search_university');
    expect(
      correctRuleIntent('ask_tuition_fee', 'có những ngành gì trong trường'),
    ).toBe('search_university');
  });

  it('asksUniversityOrPrograms covers program questions', () => {
    expect(
      asksUniversityOrPrograms('USTH có những chương trình đào tạo gì?'),
    ).toBe(true);
  });

  it('asksWhichSchoolsTeachMajor before generic trường search', () => {
    expect(
      asksWhichSchoolsTeachMajor(
        'Ngành CNTT có những trường nào ở Hà Nội đào tạo?',
      ),
    ).toBe(true);
    expect(classifyIntentRuleOnly('Ngành Khoa học Vũ trụ trường nào dạy')).toBe(
      'search_major',
    );
  });

  it('looksLikeCutoffScoreQuery matches thang điểm vào', () => {
    expect(looksLikeCutoffScoreQuery('thang diem vao HUST ngành CNTT')).toBe(
      true,
    );
    expect(classifyIntentRuleOnly('thang diem vao HUST ngành CNTT')).toBe(
      'ask_cutoff_score',
    );
  });

  it('resolveFollowUpIntent inherits session intent', () => {
    const session = {
      last_intent: 'recommendation_by_score' as const,
      last_university: null,
      last_major: 'CNTT',
      last_score: 24,
      last_subject_group: 'A00',
      last_method_code: null,
      last_location: 'Hà Nội',
      last_year: null,
    };
    expect(classifyIntentRuleOnly('có chắc không?', session)).toBe(
      'recommendation_by_score',
    );
    expect(isShortFollowUp('có chắc không?')).toBe(true);
  });
});
