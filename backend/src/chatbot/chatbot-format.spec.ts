// @file: Automated tests for chatbot format.
import {
  bullet,
  bulletList,
  formatAnswerMarkdown,
  formatCutoffBullet,
} from './chatbot-format';
import type { CutoffScore } from '../cutoff-scores/cutoff-score.entity';

describe('chatbot-format', () => {
  it('bulletList joins items with bullet prefix', () => {
    expect(bulletList(['A', 'B'])).toBe('• A\n• B');
  });

  it('formatCutoffBullet includes major when relation is loaded', () => {
    const c = {
      year: 2025,
      score: 24.68,
      subject_combination: 'D01',
      admission_method: 'Xét điểm thi THPT',
      universityMajor: { major: { name: 'Sư phạm Toán học' } },
    } as CutoffScore;
    expect(formatCutoffBullet(c)).toContain('Sư phạm Toán học');
    expect(formatCutoffBullet(c)).toContain('tổ hợp D01');
  });

  it('formatAnswerMarkdown converts • lines to markdown list', () => {
    const raw = 'Tiêu đề:\n• Mục 1\n• Mục 2\n\nKết luận.';
    const out = formatAnswerMarkdown(raw);
    expect(out).toContain('- Mục 1');
    expect(out).toContain('- Mục 2');
    expect(out).toMatch(/\n\n- Mục 1/);
  });

  it('formatAnswerMarkdown converts nested – lines', () => {
    const raw = 'Điểm chuẩn:\n  – 2025: 24 (D01, THPT)';
    const out = formatAnswerMarkdown(raw);
    expect(out).toContain('  - 2025: 24 (D01, THPT)');
  });

  it('formatAnswerMarkdown converts numbered recommendation lines', () => {
    const raw = 'Gợi ý:\n1. HUST — CNTT\n2. NEU — KT';
    const out = formatAnswerMarkdown(raw);
    expect(out).toMatch(/\n\n1\. HUST/);
    expect(out).toContain('2. NEU — KT');
  });

  it('bullet wraps text once', () => {
    expect(bullet('Địa điểm: Hà Nội')).toBe('• Địa điểm: Hà Nội');
  });
});
