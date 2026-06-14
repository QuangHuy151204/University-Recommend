import { majorMatchesInterestTerms } from './major-interest-match';

describe('majorMatchesInterestTerms', () => {
  it('matches Sư phạm Toán học for interest sư phạm toán', () => {
    const result = majorMatchesInterestTerms(
      'Sư phạm Toán học',
      ['sư phạm', 'toán'],
      'Giáo viên dạy Toán',
      ['sư phạm toán', 'su pham toan'],
    );

    expect(result.matched).toBe(true);
  });

  it('does not match Kế toán when interest is sư phạm toán', () => {
    const result = majorMatchesInterestTerms(
      'Kế toán',
      ['kế toán', 'accounting'],
      'Kế toán viên',
      ['sư phạm toán', 'su pham toan'],
    );

    expect(result.matched).toBe(false);
  });

  it('does not match food safety major when interest is sư phạm toán', () => {
    const result = majorMatchesInterestTerms(
      'Đảm bảo chất lượng và an toàn thực phẩm (CS Hà Nội)',
      ['dam', 'bao', 'toan', 'thuc', 'pham'],
      null,
      ['sư phạm toán', 'su pham toan'],
    );

    expect(result.matched).toBe(false);
  });

  it('does not match other pedagogy majors when interest is sư phạm toán', () => {
    const result = majorMatchesInterestTerms(
      'Sư phạm Tin học',
      ['su phạm', 'tin hoc'],
      null,
      ['sư phạm toán'],
    );

    expect(result.matched).toBe(false);
  });

  it('matches SP Toán shorthand for sư phạm toán interest', () => {
    const result = majorMatchesInterestTerms(
      'SP Toán',
      ['su phạm', 'toan'],
      null,
      ['sư phạm toán'],
    );

    expect(result.matched).toBe(true);
  });

  it('still matches Kế toán when interest explicitly says kế toán', () => {
    const result = majorMatchesInterestTerms('Kế toán', ['kế toán'], null, [
      'kế toán',
      'ke toan',
    ]);

    expect(result.matched).toBe(true);
  });
});
