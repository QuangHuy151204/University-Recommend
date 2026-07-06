import type {
    AdmissionMethod,
    CutoffScore,
    University,
    UniversityDetail,
} from '@/types';

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

export interface MajorCutoffSummary {
    majorName: string;
    score: number;
    subjectCombination: string | null;
}

export interface CompareMethodOption {
    code: string;
    label: string;
}

export interface UniversityCompareStats {
    programCount: number;
    admissionMethodLabels: string[];
    cutoffYears: number[];
    latestYear: number | null;
    /** Min–max điểm chuẩn theo năm (tùy lọc tổ hợp / PT). */
    cutoffMin: number | null;
    cutoffMax: number | null;
    /** Số chương trình ngành có điểm sau lọc. */
    cutoffProgramCount: number;
    /** Top ngành có điểm thấp nhất (dễ vào hơn) sau lọc. */
    topMajorCutoffs: MajorCutoffSummary[];
}

/** Điểm chuẩn THPT / tổ hợp thường ≤ 40; loại điểm ĐGNL (~600–1000) khỏi khoảng min–max. */
export const COMPARE_THPT_SCORE_MAX = 40;

const COMPARE_TOP_MAJORS = 5;

export interface CompareCutoffFilters {
    year: number | null;
    subjectCombination: string | null;
    methodCode: string | null;
}

function resolveCatalogEntry(
    raw: string,
    catalog?: AdmissionMethod[],
): AdmissionMethod | undefined {
    if (!raw.trim() || !catalog?.length) return undefined;
    const lower = raw.trim().toLowerCase();
    return catalog.find(
        (am) =>
            lower === am.method_code.toLowerCase() ||
            lower === am.method_name.toLowerCase() ||
            lower.includes(am.method_code.toLowerCase()) ||
            lower.includes(am.method_name.toLowerCase()),
    );
}

/** PT có trong cutoff_scores của các trường đang so sánh (theo năm). */
export function collectCompareMethodOptions(
    universities: UniversityDetail[],
    year: number | null,
    catalog?: AdmissionMethod[],
): CompareMethodOption[] {
    const seen = new Map<string, string>();
    for (const uni of universities) {
        for (const p of uni.universityMajors ?? []) {
            for (const c of p.cutoffScores ?? []) {
                if (year != null && c.year !== year) continue;
                const raw = (c.admission_method ?? '').trim();
                if (!raw) continue;
                const match = resolveCatalogEntry(raw, catalog);
                const code = match?.method_code ?? raw;
                const label = match?.method_name ?? raw;
                if (!seen.has(code)) seen.set(code, label);
            }
        }
    }
    return [...seen.entries()]
        .map(([code, label]) => ({ code, label }))
        .sort((a, b) => a.label.localeCompare(b.label, 'vi'));
}

function cutoffMatchesMethod(
    cutoff: CutoffScore,
    methodCode: string | null,
    catalog?: AdmissionMethod[],
): boolean {
    if (!methodCode) return true;
    const raw = (cutoff.admission_method ?? '').trim();
    if (!raw) return methodCode.toUpperCase() === 'THPT';

    const match = resolveCatalogEntry(raw, catalog);
    const catalogEntry = catalog?.find(
        (am) => am.method_code.toUpperCase() === methodCode.toUpperCase(),
    );
    const targets = new Set(
        [methodCode, catalogEntry?.method_name, match?.method_code, match?.method_name]
            .filter(Boolean)
            .map((s) => String(s).toLowerCase()),
    );
    const rawLower = raw.toLowerCase();
    return [...targets].some(
        (t) => rawLower === t || rawLower.includes(t),
    );
}

function isComparableScore(score: number, methodCode: string | null): boolean {
    if (!Number.isFinite(score) || score <= 0) return false;
    if (methodCode) {
        const upper = methodCode.toUpperCase();
        if (upper.includes('DGNL')) return score > COMPARE_THPT_SCORE_MAX;
        return score <= COMPARE_THPT_SCORE_MAX;
    }
    return score <= COMPARE_THPT_SCORE_MAX;
}

function filterCutoffsForCompare(
    uni: UniversityDetail,
    filters: CompareCutoffFilters,
    catalog?: AdmissionMethod[],
): Array<CutoffScore & { majorName: string; programId: number }> {
    const rows: Array<CutoffScore & { majorName: string; programId: number }> =
        [];
    for (const p of uni.universityMajors ?? []) {
        const majorName = p.major?.name ?? '—';
        for (const c of p.cutoffScores ?? []) {
            if (filters.year != null && c.year !== filters.year) continue;
            if (
                filters.subjectCombination &&
                (c.subject_combination ?? '').trim() !==
                    filters.subjectCombination
            ) {
                continue;
            }
            if (!cutoffMatchesMethod(c, filters.methodCode, catalog)) continue;
            if (!isComparableScore(c.score, filters.methodCode)) continue;
            rows.push({ ...c, majorName, programId: p.id });
        }
    }
    return rows;
}

/** Một điểm đại diện mỗi chương trình ngành — lấy điểm thấp nhất trong bộ lọc. */
export function computeTopMajorCutoffs(
    uni: UniversityDetail,
    filters: CompareCutoffFilters,
    catalog?: AdmissionMethod[],
    limit = COMPARE_TOP_MAJORS,
): MajorCutoffSummary[] {
    const byProgram = new Map<number, MajorCutoffSummary>();
    for (const row of filterCutoffsForCompare(uni, filters, catalog)) {
        const combo = (row.subject_combination ?? '').trim() || null;
        const existing = byProgram.get(row.programId);
        if (!existing || row.score < existing.score) {
            byProgram.set(row.programId, {
                majorName: row.majorName,
                score: row.score,
                subjectCombination: combo,
            });
        }
    }
    return [...byProgram.values()]
        .sort((a, b) => a.score - b.score || a.majorName.localeCompare(b.majorName, 'vi'))
        .slice(0, limit);
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

function resolveAdmissionMethodLabel(
    raw: string,
    catalog?: AdmissionMethod[],
): string {
    const label = raw.trim();
    if (!label || !catalog?.length) return label;

    const lower = label.toLowerCase();
    const match = catalog.find(
        (am) =>
            lower === am.method_code.toLowerCase() ||
            lower === am.method_name.toLowerCase() ||
            lower.includes(am.method_code.toLowerCase()) ||
            lower.includes(am.method_name.toLowerCase()),
    );
    return match?.method_name ?? label;
}

/**
 * Thu thập PT xét tuyển từ cutoff_scores (nguồn đúng).
 * Không dùng university_majors.admission_methods — cột đó lưu ghi chú Excel.
 */
export function collectAdmissionMethodLabels(
    uni: UniversityDetail,
    catalog?: AdmissionMethod[],
): string[] {
    const raw = new Set<string>();
    for (const p of uni.universityMajors ?? []) {
        for (const c of p.cutoffScores ?? []) {
            const method = (c.admission_method ?? '').trim();
            if (method) raw.add(method);
        }
    }
    const labels = [...raw].map((m) => resolveAdmissionMethodLabel(m, catalog));
    return [...new Set(labels)].sort((a, b) => a.localeCompare(b, 'vi'));
}

/** @deprecated Chỉ dùng nội bộ khi cần đọc ghi chú ngành–trường, không phải PT xét tuyển. */
export function collectAdmissionNotesLabels(uni: UniversityDetail): string[] {
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
    catalog?: AdmissionMethod[],
    methodCode: string | null = null,
): UniversityCompareStats {
    const programs = uni.universityMajors ?? [];
    const cutoffYears = getCutoffYears(uni);
    const targetYear =
        year && cutoffYears.includes(year) ? year : (cutoffYears[0] ?? null);

    const filters: CompareCutoffFilters = {
        year: targetYear,
        subjectCombination,
        methodCode,
    };

    const byProgram = new Map<number, number>();
    for (const row of filterCutoffsForCompare(uni, filters, catalog)) {
        const prev = byProgram.get(row.programId);
        if (prev == null || row.score < prev) {
            byProgram.set(row.programId, row.score);
        }
    }
    const scoreValues = [...byProgram.values()];

    return {
        programCount: programs.length,
        admissionMethodLabels: collectAdmissionMethodLabels(uni, catalog),
        cutoffYears,
        latestYear: targetYear,
        cutoffMin: scoreValues.length ? Math.min(...scoreValues) : null,
        cutoffMax: scoreValues.length ? Math.max(...scoreValues) : null,
        cutoffProgramCount: byProgram.size,
        topMajorCutoffs: computeTopMajorCutoffs(uni, filters, catalog),
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
