import type { CutoffScore, University, UniversityDetail } from '@/types';

export const COMPARE_MAX = 2;
export const COMPARE_STORAGE_KEY = 'uniguide_compare_ids';

export interface CompareEntry {
    id: number;
    name: string;
    short_name: string | null;
}

const COMPARE_CHANGE_EVENT = 'uniguide-compare-change';

/** Snapshot ổn định cho useSyncExternalStore (tránh vòng lặp vô hạn). */
const EMPTY_COMPARE_SNAPSHOT: CompareEntry[] = [];

let compareSnapshotCache: CompareEntry[] = EMPTY_COMPARE_SNAPSHOT;
let compareSnapshotRaw: string | null = null;

function parseCompareEntriesFromRaw(raw: string | null): CompareEntry[] {
    if (!raw) return EMPTY_COMPARE_SNAPSHOT;
    try {
        const parsed = JSON.parse(raw) as unknown;
        if (!Array.isArray(parsed)) return EMPTY_COMPARE_SNAPSHOT;
        const entries = parsed
            .map((item) => {
                if (typeof item === 'number') {
                    return {
                        id: item,
                        name: `Trường #${item}`,
                        short_name: null,
                    } satisfies CompareEntry;
                }
                if (item && typeof item === 'object' && 'id' in item) {
                    const row = item as CompareEntry;
                    const id = Number(row.id);
                    if (!Number.isFinite(id) || id <= 0) return null;
                    return {
                        id,
                        name: row.name || `Trường #${id}`,
                        short_name: row.short_name ?? null,
                    };
                }
                return null;
            })
            .filter((x): x is CompareEntry => x != null)
            .slice(0, COMPARE_MAX);
        return entries.length > 0 ? entries : EMPTY_COMPARE_SNAPSHOT;
    } catch {
        return EMPTY_COMPARE_SNAPSHOT;
    }
}

/** getSnapshot cho useSyncExternalStore — cùng tham chiếu nếu localStorage không đổi. */
export function getCompareSnapshot(): CompareEntry[] {
    if (typeof window === 'undefined') return EMPTY_COMPARE_SNAPSHOT;
    const raw = localStorage.getItem(COMPARE_STORAGE_KEY);
    if (raw === compareSnapshotRaw) return compareSnapshotCache;
    compareSnapshotRaw = raw;
    compareSnapshotCache = parseCompareEntriesFromRaw(raw);
    return compareSnapshotCache;
}

export function getServerCompareSnapshot(): CompareEntry[] {
    return EMPTY_COMPARE_SNAPSHOT;
}

function notifyCompareChange(): void {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new Event(COMPARE_CHANGE_EVENT));
}

export function subscribeCompareStorage(onStoreChange: () => void): () => void {
    if (typeof window === 'undefined') return () => {};
    const handler = () => onStoreChange();
    window.addEventListener('storage', handler);
    window.addEventListener(COMPARE_CHANGE_EVENT, handler);
    return () => {
        window.removeEventListener('storage', handler);
        window.removeEventListener(COMPARE_CHANGE_EVENT, handler);
    };
}

/** Parse `?ids=1,2,3` or array from Next searchParams. */
export function parseCompareIds(
    raw: string | string[] | undefined,
): number[] {
    const text = Array.isArray(raw) ? raw.join(',') : raw ?? '';
    const ids = text
        .split(/[,;\s]+/)
        .map((s) => Number(s.trim()))
        .filter((n) => Number.isFinite(n) && n > 0);
    return [...new Set(ids)].slice(0, COMPARE_MAX);
}

export function buildComparePath(ids: number[]): string {
    const unique = [...new Set(ids)].slice(0, COMPARE_MAX);
    if (unique.length < 2) return '/universities';
    return `/universities/compare?ids=${unique.join(',')}`;
}

export function readStoredCompareEntries(): CompareEntry[] {
    return getCompareSnapshot();
}

export function readStoredCompareIds(): number[] {
    return readStoredCompareEntries().map((e) => e.id);
}

export function writeStoredCompareEntries(entries: CompareEntry[]): void {
    if (typeof window === 'undefined') return;
    const seen = new Set<number>();
    const unique: CompareEntry[] = [];
    for (const e of entries) {
        if (seen.has(e.id) || unique.length >= COMPARE_MAX) continue;
        seen.add(e.id);
        unique.push(e);
    }
    if (unique.length === 0) {
        localStorage.removeItem(COMPARE_STORAGE_KEY);
        compareSnapshotRaw = null;
        compareSnapshotCache = EMPTY_COMPARE_SNAPSHOT;
    } else {
        const json = JSON.stringify(unique);
        localStorage.setItem(COMPARE_STORAGE_KEY, json);
        compareSnapshotRaw = json;
        compareSnapshotCache = unique;
    }
    notifyCompareChange();
}

export function writeStoredCompareIds(ids: number[]): void {
    const current = readStoredCompareEntries();
    const byId = new Map(current.map((e) => [e.id, e]));
    writeStoredCompareEntries(
        ids.map(
            (id) =>
                byId.get(id) ?? {
                    id,
                    name: `Trường #${id}`,
                    short_name: null,
                },
        ),
    );
}

export function toggleStoredUniversity(entry: CompareEntry): CompareEntry[] {
    const current = readStoredCompareEntries();
    if (current.some((x) => x.id === entry.id)) {
        const next = current.filter((x) => x.id !== entry.id);
        writeStoredCompareEntries(next);
        return next;
    }
    if (current.length >= COMPARE_MAX) return current;
    const next = [...current, entry];
    writeStoredCompareEntries(next);
    return next;
}

export interface UniversityCompareStats {
    programCount: number;
    admissionMethodLabels: string[];
    cutoffYears: number[];
    latestYear: number | null;
    /** Min–max điểm chuẩn theo năm (tùy lọc tổ hợm). */
    cutoffMin: number | null;
    cutoffMax: number | null;
    cutoffCount: number;
}

function parseAdmissionMethodsText(raw: string | null | undefined): string[] {
    if (!raw?.trim()) return [];
    const trimmed = raw.trim();
    if (trimmed.startsWith('[')) {
        try {
            const arr = JSON.parse(trimmed) as unknown;
            if (Array.isArray(arr)) {
                return arr
                    .map((x) => String(x).trim())
                    .filter(Boolean);
            }
        } catch {
            // fall through
        }
    }
    return trimmed
        .split(/[,;|/]+/)
        .map((s) => s.trim())
        .filter(Boolean);
}

export function collectAdmissionMethodLabels(
    uni: UniversityDetail,
): string[] {
    const set = new Set<string>();
    for (const p of uni.universityMajors ?? []) {
        for (const label of parseAdmissionMethodsText(p.admission_methods)) {
            set.add(label);
        }
    }
    return [...set].sort((a, b) => a.localeCompare(b, 'vi'));
}

export function getCutoffYears(uni: UniversityDetail): number[] {
    const years = new Set<number>();
    for (const p of uni.universityMajors ?? []) {
        for (const c of p.cutoffScores ?? []) {
            years.add(c.year);
        }
    }
    return [...years].sort((a, b) => b - a);
}

export function computeCompareStats(
    uni: UniversityDetail,
    year: number | null,
    subjectCombination: string | null,
): UniversityCompareStats {
    const programs = uni.universityMajors ?? [];
    const allCutoffs: CutoffScore[] = programs.flatMap(
        (p) => p.cutoffScores ?? [],
    );
    const cutoffYears = getCutoffYears(uni);
    const targetYear =
        year && cutoffYears.includes(year) ? year : (cutoffYears[0] ?? null);

    let filtered = allCutoffs;
    if (targetYear != null) {
        filtered = filtered.filter((c) => c.year === targetYear);
    }
    if (subjectCombination) {
        filtered = filtered.filter(
            (c) =>
                (c.subject_combination ?? '').trim() === subjectCombination,
        );
    }

    const scores = filtered
        .map((c) => c.score)
        .filter((s) => typeof s === 'number' && s > 0);

    return {
        programCount: programs.length,
        admissionMethodLabels: collectAdmissionMethodLabels(uni),
        cutoffYears,
        latestYear: targetYear,
        cutoffMin: scores.length ? Math.min(...scores) : null,
        cutoffMax: scores.length ? Math.max(...scores) : null,
        cutoffCount: filtered.length,
    };
}

export function collectSubjectCombinations(
    universities: UniversityDetail[],
    year: number | null,
): string[] {
    const set = new Set<string>();
    for (const uni of universities) {
        for (const p of uni.universityMajors ?? []) {
            for (const c of p.cutoffScores ?? []) {
                if (year != null && c.year !== year) continue;
                const combo = (c.subject_combination ?? '').trim();
                if (combo) set.add(combo);
            }
        }
    }
    return [...set].sort((a, b) => a.localeCompare(b, 'vi'));
}

export function universityLabel(u: Pick<University, 'short_name' | 'name'>): string {
    return u.short_name || u.name;
}
