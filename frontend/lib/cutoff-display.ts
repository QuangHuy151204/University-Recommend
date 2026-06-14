import type { CutoffScore } from '@/types';

/** Một dòng điểm chuẩn sau khi gộp các tổ hợp cùng năm + PT + điểm. */
export interface GroupedCutoffRow {
    rowKey: string;
    year: number;
    /** Rỗng → hiển thị «Chung» (mọi tổ hợp cùng mức điểm). */
    subjectCombinations: string[];
    admission_method: string | null;
    score: number;
}

function normalizeMethod(method: string | null | undefined): string {
    return (method ?? '').trim();
}

/**
 * Gộp các bản ghi có cùng năm, phương thức xét tuyển và điểm chuẩn
 * thành một dòng; cột tổ hợp liệt kê A00, A01, …
 */
export function groupCutoffScores(cutoffs: CutoffScore[]): GroupedCutoffRow[] {
    const map = new Map<
        string,
        {
            year: number;
            admission_method: string | null;
            score: number;
            combos: Set<string>;
        }
    >();

    for (const c of cutoffs) {
        const methodKey = normalizeMethod(c.admission_method) || '—';
        const key = `${c.year}\0${methodKey}\0${c.score}`;
        let group = map.get(key);
        if (!group) {
            group = {
                year: c.year,
                admission_method: c.admission_method,
                score: c.score,
                combos: new Set(),
            };
            map.set(key, group);
        }
        const combo = (c.subject_combination ?? '').trim();
        if (combo && combo !== '—') {
            group.combos.add(combo);
        }
    }

    return [...map.values()]
        .map((g) => {
            const methodKey = normalizeMethod(g.admission_method) || '—';
            return {
                rowKey: `${g.year}-${methodKey}-${g.score}`,
                year: g.year,
                subjectCombinations: [...g.combos].sort((a, b) =>
                    a.localeCompare(b, 'vi'),
                ),
                admission_method: g.admission_method,
                score: g.score,
            };
        })
        .sort((a, b) => {
            if (b.year !== a.year) return b.year - a.year;
            const methodCmp = normalizeMethod(a.admission_method).localeCompare(
                normalizeMethod(b.admission_method),
                'vi',
            );
            if (methodCmp !== 0) return methodCmp;
            return b.score - a.score;
        });
}

export function formatSubjectCombinations(combos: string[]): string {
    if (combos.length === 0) return 'Chung';
    return combos.join(', ');
}
