import type { AdmissionTier } from './recommendation.response';

/** Phân tầng Reach / Match / Safety theo chênh lệch điểm dự kiến − điểm chuẩn. */
export function classifyAdmissionTier(
  scoreDiff: number | null,
): AdmissionTier | null {
  if (scoreDiff === null) return null;
  if (scoreDiff >= 0) return 'safety';
  if (scoreDiff >= -1) return 'match';
  return 'reach';
}

export const RECOMMEND_MAX_RESULTS = 15;
export const RECOMMEND_MAX_MAJORS_PER_UNIVERSITY = 3;

/** Giới hạn số ngành / trường trong top N kết quả đã xếp hạng. */
export function applyUniversityDiversityCap<
  T extends { universityId: number | null },
>(
  results: T[],
  maxResults = RECOMMEND_MAX_RESULTS,
  maxPerUniversity = RECOMMEND_MAX_MAJORS_PER_UNIVERSITY,
): { items: T[]; capped: boolean } {
  const perUniversity = new Map<number, number>();
  const picked: T[] = [];
  let capped = false;

  for (const item of results) {
    const uniId = item.universityId;
    if (uniId == null) {
      picked.push(item);
      if (picked.length >= maxResults) break;
      continue;
    }
    const count = perUniversity.get(uniId) ?? 0;
    if (count >= maxPerUniversity) {
      capped = true;
      continue;
    }
    perUniversity.set(uniId, count + 1);
    picked.push(item);
    if (picked.length >= maxResults) break;
  }

  if (results.length > picked.length) {
    capped = true;
  }

  return { items: picked, capped };
}
