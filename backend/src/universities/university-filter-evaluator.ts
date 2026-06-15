import { DATA_SCOPE_LOCATION } from '../common/data-scope';
import { CUTOFF_FILTER_YEARS } from '../common/subject-combination';
import { filterMajorIdsBySelectionName } from '../majors/major-name-match';
import {
  universityMajorPassesCutoffFilter,
  type CutoffFilterInput,
  type CutoffFilterRow,
} from './university-cutoff-filter';

export type UniversityFilterQuery = {
  search?: string;
  location?: string;
  ward?: string;
  type?: string;
  max_tuition?: number;
  subject_combination?: string;
  min_score?: number;
  major_id?: number;
};

export type CatalogMajor = { id: number; name: string };

export type UniversitySnapshot = {
  id: number;
  name: string;
  short_name: string;
  location: string;
  ward?: string | null;
  type: string | null;
  tuition_fee_min: number | null;
};

export type UniversityMajorSnapshot = {
  id: number;
  university_id: number;
  major_id: number;
};

export type CutoffSnapshot = {
  university_major_id: number;
  year: number;
  subject_combination: string | null;
  score: number;
};

export type FilterDataset = {
  universities: UniversitySnapshot[];
  universityMajors: UniversityMajorSnapshot[];
  cutoffs: CutoffSnapshot[];
  catalog: CatalogMajor[];
};

export function resolveMajorIdsForFilter(
  catalog: CatalogMajor[],
  major_id?: number,
): number[] | undefined {
  if (major_id == null || !Number.isInteger(major_id) || major_id <= 0) {
    return undefined;
  }
  const selected = catalog.find((m) => m.id === major_id);
  if (!selected) return [major_id];
  const ids = filterMajorIdsBySelectionName(catalog, selected.name);
  return ids.length > 0 ? ids : [major_id];
}

function hasActiveCutoffFilters(query: UniversityFilterQuery): boolean {
  const combo = query.subject_combination?.trim();
  const hasScore =
    query.min_score != null &&
    Number.isFinite(query.min_score) &&
    query.min_score > 0;
  const hasMajor =
    query.major_id != null &&
    Number.isInteger(query.major_id) &&
    query.major_id > 0;
  return Boolean(combo || hasScore || hasMajor);
}

function universityPassesBaseFilters(
  uni: UniversitySnapshot,
  query: UniversityFilterQuery,
): boolean {
  if (!uni.location?.includes(DATA_SCOPE_LOCATION)) return false;
  if (query.search?.trim()) {
    const s = query.search.trim().toLowerCase();
    const hit =
      uni.name.toLowerCase().includes(s) ||
      uni.short_name.toLowerCase().includes(s);
    if (!hit) return false;
  }
  if (query.location?.trim()) {
    if (
      !uni.location.toLowerCase().includes(query.location.trim().toLowerCase())
    ) {
      return false;
    }
  }
  if (query.ward?.trim()) {
    const want = query.ward.trim().toLowerCase();
    const have = (uni.ward ?? '').trim().toLowerCase();
    if (!have.includes(want)) return false;
  }
  if (query.type && uni.type !== query.type) return false;
  if (query.max_tuition != null && Number.isFinite(query.max_tuition)) {
    if (
      uni.tuition_fee_min == null ||
      uni.tuition_fee_min > query.max_tuition
    ) {
      return false;
    }
  }
  return true;
}

function universityMajorPassesFilter(
  um: UniversityMajorSnapshot,
  cutoffs: CutoffFilterRow[],
  majorIds: number[] | undefined,
  cutoffInput: CutoffFilterInput,
): boolean {
  if (
    majorIds != null &&
    majorIds.length > 0 &&
    !majorIds.includes(um.major_id)
  ) {
    return false;
  }
  if (
    !cutoffInput.subject_combination?.trim() &&
    (cutoffInput.min_score == null ||
      !Number.isFinite(cutoffInput.min_score) ||
      cutoffInput.min_score <= 0)
  ) {
    return true;
  }
  return universityMajorPassesCutoffFilter(cutoffs, cutoffInput);
}

/** Ground truth: tập id trường thỏa điều kiện (độc lập SQL). */
export function evaluateUniversityFilter(
  dataset: FilterDataset,
  query: UniversityFilterQuery,
): Set<number> {
  const majorIds = resolveMajorIdsForFilter(dataset.catalog, query.major_id);
  const cutoffInput: CutoffFilterInput = {
    subject_combination: query.subject_combination,
    min_score: query.min_score,
  };
  const needsCutoffJoin = hasActiveCutoffFilters(query);

  const cutoffsByUm = new Map<number, CutoffFilterRow[]>();
  for (const c of dataset.cutoffs) {
    const list = cutoffsByUm.get(c.university_major_id) ?? [];
    list.push({
      year: c.year,
      subject_combination: c.subject_combination,
      score: c.score,
    });
    cutoffsByUm.set(c.university_major_id, list);
  }

  const umsByUniversity = new Map<number, UniversityMajorSnapshot[]>();
  for (const um of dataset.universityMajors) {
    const list = umsByUniversity.get(um.university_id) ?? [];
    list.push(um);
    umsByUniversity.set(um.university_id, list);
  }

  const matched = new Set<number>();
  for (const uni of dataset.universities) {
    if (!universityPassesBaseFilters(uni, query)) continue;

    const ums = umsByUniversity.get(uni.id) ?? [];
    if (!needsCutoffJoin) {
      matched.add(uni.id);
      continue;
    }

    const qualifying = ums.some((um) =>
      universityMajorPassesFilter(
        um,
        cutoffsByUm.get(um.id) ?? [],
        majorIds,
        cutoffInput,
      ),
    );
    if (qualifying) matched.add(uni.id);
  }

  return matched;
}

export { CUTOFF_FILTER_YEARS };
