import { expandInterestPhrases } from './interest-synonyms';

describe('interest-synonyms', () => {
  it('expands lập trình to CNTT-related phrases', () => {
    const expanded = expandInterestPhrases(['lập trình']);
    expect(expanded.some((p) => p.includes('công nghệ thông tin'))).toBe(true);
  });

  it('expands AI to trí tuệ nhân tạo', () => {
    const expanded = expandInterestPhrases(['AI']);
    expect(expanded).toContain('trí tuệ nhân tạo');
  });

  it('keeps original phrase alongside synonyms', () => {
    const expanded = expandInterestPhrases(['marketing']);
    expect(expanded).toContain('marketing');
  });

  it('expands sư phạm toán to canonical major name', () => {
    const expanded = expandInterestPhrases(['sư phạm toán']);
    expect(expanded).toContain('sư phạm toán học');
  });
});
