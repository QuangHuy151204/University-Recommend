// @file: Automated tests for major search.
import {
  pickMajorInterestPhrase,
  resolveMajorSearchTerm,
} from './major-search';

describe('major-search', () => {
  it('resolveMajorSearchTerm keeps full major before bao nhiêu', () => {
    expect(
      resolveMajorSearchTerm(
        'điểm chuẩn ngành an toàn thông tin là bao nhiêu ?',
      ),
    ).toBe('An toàn thông tin');
  });

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

  it('resolveMajorSearchTerm does not map ai inside đại học', () => {
    expect(resolveMajorSearchTerm('điểm chuẩn đại học USTH ngành Dược')).toBe(
      'Dược',
    );
  });

  it('resolveMajorSearchTerm still maps standalone AI alias', () => {
    expect(resolveMajorSearchTerm('nếu em muốn học AI ở USTH thì sao')).toBe(
      'Trí tuệ nhân tạo',
    );
    expect(resolveMajorSearchTerm('điểm chuẩn ngành AI của USTH')).toBe(
      'Trí tuệ nhân tạo',
    );
  });

  it('resolveMajorSearchTerm preserves diacritics for CNTT at USTH', () => {
    expect(
      resolveMajorSearchTerm(
        'Tôi muốn xem điểm chuẩn ngành Công nghệ thông tin của trường USTH',
      ),
    ).toBe('Công nghệ thông tin');
  });

  it('resolveMajorSearchTerm maps unaccented CNTT fragment', () => {
    expect(
      resolveMajorSearchTerm(
        'diem chuan nganh cong nghe thong tin truong USTH',
      ),
    ).toBe('Công nghệ thông tin');
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
