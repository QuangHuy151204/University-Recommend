import {
  pickMajorInterestPhrase,
  resolveMajorSearchTerm,
} from './major-search';

describe('major-search', () => {
  it('resolveMajorSearchTerm maps common aliases', () => {
    expect(resolveMajorSearchTerm('ngành marketing trường nào')).toBe(
      'Marketing',
    );
    expect(resolveMajorSearchTerm('ngành an toàn thông tin')).toBe(
      'An toàn thông tin',
    );
  });

  it('resolveMajorSearchTerm maps vũ trụ alias', () => {
    expect(resolveMajorSearchTerm('ngành khoa học vũ trụ trường nào dạy')).toBe(
      'Khoa học Vũ trụ',
    );
  });

  it('resolveMajorSearchTerm extracts fragment after ngành', () => {
    expect(resolveMajorSearchTerm('Ngành Logistics trường nào ở Hà Nội')).toBe(
      'Logistics',
    );
  });

  it('resolveMajorSearchTerm maps hàng không and stops before của trường', () => {
    expect(
      resolveMajorSearchTerm('điểm chuẩn ngành hàng không của USTH thì sao'),
    ).toBe('Hàng không');
  });

  it('pickMajorInterestPhrase keeps full entity major phrase', () => {
    expect(
      pickMajorInterestPhrase('25 điểm muốn học ngành gì', 'Sư phạm Toán'),
    ).toBe('Sư phạm Toán học');
  });

  it('pickMajorInterestPhrase extracts full fragment from message', () => {
    expect(
      pickMajorInterestPhrase(
        'Tôi được 25 điểm muốn học ngành sư phạm toán thì nên học trường gì',
        null,
      ),
    ).toBe('Sư phạm Toán học');
  });

  it('pickMajorInterestPhrase prefers message alias over weak Ollama entity', () => {
    expect(
      pickMajorInterestPhrase(
        'Tôi được 25 điểm muốn học ngành sư phạm toán thì nên học trường gì',
        'Kế toán',
      ),
    ).toBe('Sư phạm Toán học');
  });

  it('pickMajorInterestPhrase prefers message alias over single-token entity', () => {
    expect(
      pickMajorInterestPhrase(
        'Em 25 điểm học ngành sư phạm toán nên chọn trường nào',
        'toán',
      ),
    ).toBe('Sư phạm Toán học');
  });
});
