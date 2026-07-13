// @file: Formats chatbot answers as Markdown bullets and tables.
import type { CutoffScore } from '../cutoff-scores/cutoff-score.entity';

/** Một dòng gạch đầu dòng (ký hiệu • — chuyển markdown ở bước cuối). */
export function bullet(text: string): string {
  return `• ${text.trim()}`;
}

/** Nhiều dòng bullet, mỗi dòng một mục. */
export function bulletList(items: string[]): string {
  return items.map((item) => bullet(item)).join('\n');
}

/** Dòng điểm chuẩn: ngành + năm + tổ hợp + điểm + PT xét tuyển. */
export function formatCutoffBullet(c: CutoffScore): string {
  const majorName = c.universityMajor?.major?.name?.trim();
  const majorPart = majorName ? `${majorName} — ` : '';
  const combo = c.subject_combination?.trim() || 'chưa rõ';
  const method = c.admission_method?.trim() || 'THPT Quốc gia';
  return bullet(
    `${majorPart}năm ${c.year}, tổ hợp ${combo}: ${c.score} điểm (${method})`,
  );
}

/**
 * Chuyển bullet • / – nội bộ sang markdown list để ChatMarkdown (react-markdown) hiển thị đúng.
 * Markdown cần `- item` và khối list tách bằng dòng trống — `\n` đơn giữa các • bị gộp thành một đoạn.
 */
export function formatAnswerMarkdown(text: string): string {
  const lines = text.split('\n');
  const out: string[] = [];
  let inBulletBlock = false;
  let inNumberedBlock = false;
  let inNestedBlock = false;

  const closeBlocks = () => {
    if (inBulletBlock || inNumberedBlock || inNestedBlock) {
      if (out.length > 0 && out[out.length - 1] !== '') out.push('');
    }
    inBulletBlock = false;
    inNumberedBlock = false;
    inNestedBlock = false;
  };

  for (const line of lines) {
    const trimmed = line.trimStart();
    const bulletMatch = trimmed.match(/^•\s+(.*)$/);
    const dashMatch = line.match(/^\s+[–-]\s+(.*)$/);
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);

    if (bulletMatch) {
      if (inNumberedBlock || inNestedBlock) closeBlocks();
      if (!inBulletBlock) {
        if (out.length > 0 && out[out.length - 1] !== '') out.push('');
        inBulletBlock = true;
      }
      out.push(`- ${bulletMatch[1]}`);
      continue;
    }

    if (dashMatch) {
      if (inBulletBlock || inNumberedBlock) closeBlocks();
      if (!inNestedBlock) {
        if (out.length > 0 && out[out.length - 1] !== '') out.push('');
        inNestedBlock = true;
      }
      out.push(`  - ${dashMatch[1]}`);
      continue;
    }

    if (numberedMatch) {
      if (inBulletBlock || inNestedBlock) closeBlocks();
      if (!inNumberedBlock) {
        if (out.length > 0 && out[out.length - 1] !== '') out.push('');
        inNumberedBlock = true;
      }
      out.push(`${numberedMatch[1]}. ${numberedMatch[2]}`);
      continue;
    }

    closeBlocks();
    out.push(line);
  }

  closeBlocks();
  return out
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
