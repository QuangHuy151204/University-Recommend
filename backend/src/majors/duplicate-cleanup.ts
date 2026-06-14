import { canonicalMajorName } from './major-normalization';

export type MajorCleanupRow = {
  id: number;
  name: string;
  code: string | null;
  field_group: string | null;
  links?: number;
};

export type UniversityMajorCleanupRow = {
  id: number;
  university_id: number;
  major_id: number;
  training_program: string | null;
  duration: number | null;
  tuition_fee: number | null;
  quota: number | null;
  admission_methods: string | null;
  cutoff_count?: number;
};

export function pickLongerText(
  a: string | null,
  b: string | null,
): string | null {
  if (!a) return b;
  if (!b) return a;
  return b.trim().length > a.trim().length ? b : a;
}

export function pickMajorKeeper(
  candidates: Array<MajorCleanupRow & { links: number }>,
): MajorCleanupRow {
  const sorted = [...candidates].sort((a, b) => {
    if (b.links !== a.links) return b.links - a.links;
    const aCode = a.code?.trim() ? 1 : 0;
    const bCode = b.code?.trim() ? 1 : 0;
    if (bCode !== aCode) return bCode - aCode;
    return a.id - b.id;
  });
  return sorted[0];
}

export function pickUniversityMajorKeeper(
  candidates: Array<UniversityMajorCleanupRow & { cutoff_count: number }>,
): UniversityMajorCleanupRow {
  const sorted = [...candidates].sort((a, b) => {
    if (b.cutoff_count !== a.cutoff_count)
      return b.cutoff_count - a.cutoff_count;
    return a.id - b.id;
  });
  return sorted[0];
}

export function groupMajorsByCanonicalName(
  majors: MajorCleanupRow[],
): Map<string, MajorCleanupRow[]> {
  const byCanonical = new Map<string, MajorCleanupRow[]>();
  for (const m of majors) {
    const key = canonicalMajorName(m.name);
    const bucket = byCanonical.get(key) ?? [];
    bucket.push(m);
    byCanonical.set(key, bucket);
  }
  return byCanonical;
}

export function findDuplicateMajorGroups(
  majors: MajorCleanupRow[],
): Array<{ canonical: string; group: MajorCleanupRow[] }> {
  const byCanonical = groupMajorsByCanonicalName(majors);
  return [...byCanonical.entries()]
    .filter(([, arr]) => arr.length > 1)
    .map(([canonical, group]) => ({ canonical, group }));
}

export function groupUniversityMajorsByPair(
  rows: UniversityMajorCleanupRow[],
): Map<string, UniversityMajorCleanupRow[]> {
  const umByKey = new Map<string, UniversityMajorCleanupRow[]>();
  for (const um of rows) {
    const key = `${um.university_id}|${um.major_id}`;
    const list = umByKey.get(key) ?? [];
    list.push(um);
    umByKey.set(key, list);
  }
  return umByKey;
}

export function findDuplicateUniversityMajorGroups(
  rows: UniversityMajorCleanupRow[],
): Array<{ key: string; group: UniversityMajorCleanupRow[] }> {
  const umByKey = groupUniversityMajorsByPair(rows);
  return [...umByKey.entries()]
    .filter(([, group]) => group.length > 1)
    .map(([key, group]) => ({ key, group }));
}

function normalizeDedupePart(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, ' ');
}

/** Dedupe key for cutoff_scores rows (year + method + subject combination). */
export function cutoffDedupeKey(row: {
  year: number;
  admission_method: string | null;
  subject_combination: string | null;
}): string {
  return `${row.year}|${normalizeDedupePart(row.admission_method ?? '')}|${normalizeDedupePart(row.subject_combination ?? '').toUpperCase()}`;
}

export function countCutoffDuplicates(
  rows: Array<{
    id: number;
    year: number;
    admission_method: string | null;
    subject_combination: string | null;
  }>,
): number {
  const seen = new Set<string>();
  let dupes = 0;
  for (const c of rows) {
    const key = cutoffDedupeKey(c);
    if (seen.has(key)) dupes++;
    else seen.add(key);
  }
  return dupes;
}
