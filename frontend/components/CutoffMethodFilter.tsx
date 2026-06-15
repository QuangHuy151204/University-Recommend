'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { AdmissionMethod, CutoffScore } from '@/types';
import {
    formatSubjectCombinations,
    groupCutoffScores,
} from '@/lib/cutoff-display';
import { FavoriteProgramButton } from '@/components/universities/FavoriteProgramButton';
import { SearchField } from '@/components/ui/SearchField';

interface ProgramCutoff {
    programId: number;
    majorName: string;
    majorLinkId: number;
    majorCode: string | null;
    fieldGroup: string | null;
    trainingProgram: string | null;
    duration: number | null;
    tuitionFee: number | null;
    cutoffs: CutoffScore[];
}

interface CutoffMethodFilterProps {
    methods: AdmissionMethod[];
    programs: ProgramCutoff[];
}

function matchesMethod(
    cutoffMethod: string | null,
    selected: AdmissionMethod | null,
): boolean {
    if (!selected) return true;
    const label = cutoffMethod ?? '';
    const name = selected.method_name;
    const code = selected.method_code;
    return (
        label.toLowerCase().includes(name.toLowerCase()) ||
        label.toLowerCase().includes(code.toLowerCase())
    );
}

export function CutoffMethodFilter({
    methods,
    programs,
}: CutoffMethodFilterProps) {
    const [methodCode, setMethodCode] = useState<string>('');
    const [majorQuery, setMajorQuery] = useState('');

    const selected = useMemo(
        () => methods.find((m) => m.method_code === methodCode) ?? null,
        [methods, methodCode],
    );

    const queryFilteredPrograms = useMemo(() => {
        const q = majorQuery.trim().toLowerCase();
        if (!q) return programs;
        return programs.filter((p) => {
            const haystack = [
                p.majorName,
                p.majorCode,
                p.fieldGroup,
                p.trainingProgram,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();
            return haystack.includes(q);
        });
    }, [programs, majorQuery]);

    const sortedPrograms = useMemo(() => {
        return queryFilteredPrograms
            .map((p) => {
                const filtered = p.cutoffs
                    .filter((c) => matchesMethod(c.admission_method, selected))
                    .sort((a, b) => b.year - a.year);
                const grouped = groupCutoffScores(filtered);
                const latest = filtered[0]?.score ?? -1;
                return { ...p, filtered, grouped, latest };
            })
            .sort((a, b) => b.latest - a.latest);
    }, [queryFilteredPrograms, selected]);

    return (
        <div>
            <div className="mb-4 flex flex-wrap items-center justify-end gap-3">
                <SearchField
                    value={majorQuery}
                    onChange={setMajorQuery}
                    placeholder="Tìm ngành..."
                    className="sm:max-w-sm"
                />
            </div>

            {methods.length > 0 && (
                <div className="mb-4 flex flex-wrap items-center gap-3">
                    <label
                        htmlFor="cutoff-method"
                        className="text-sm font-medium text-slate-700"
                    >
                        Phương thức xét tuyển
                    </label>
                    <select
                        id="cutoff-method"
                        value={methodCode}
                        onChange={(e) => setMethodCode(e.target.value)}
                        className="input-field max-w-xs py-2"
                    >
                        <option value="">Tất cả phương thức</option>
                        {methods.map((m) => (
                            <option key={m.method_code} value={m.method_code}>
                                {m.method_name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="space-y-4">
                {sortedPrograms.length === 0 ? (
                    <div className="card p-8 text-center text-sm text-slate-600">
                        {majorQuery.trim()
                            ? `Không tìm thấy ngành nào cho "${majorQuery.trim()}".`
                            : 'Chưa có dữ liệu ngành.'}
                    </div>
                ) : (
                    sortedPrograms.map((p) => (
                    <article key={p.programId} className="card p-5 sm:p-6">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Link
                                        href={`/majors/${p.majorLinkId}`}
                                        className="font-display text-base font-bold text-primary hover:text-tertiary"
                                    >
                                        {p.majorName}
                                    </Link>
                                    <FavoriteProgramButton
                                        universityMajorId={p.programId}
                                        compact
                                    />
                                </div>
                                <div className="mt-1 flex flex-wrap gap-2">
                                    {p.majorCode && (
                                        <span className="text-xs text-slate-500">
                                            Mã {p.majorCode}
                                        </span>
                                    )}
                                    {p.fieldGroup && (
                                        <span className="badge-mint">{p.fieldGroup}</span>
                                    )}
                                </div>
                            </div>
                            <dl className="text-right text-xs text-slate-600">
                                {p.trainingProgram && (
                                    <div>
                                        <dt className="inline font-medium text-slate-500">
                                            CT:{' '}
                                        </dt>
                                        <dd className="inline">{p.trainingProgram}</dd>
                                    </div>
                                )}
                                {p.duration != null && (
                                    <div>
                                        <dt className="inline font-medium text-slate-500">
                                            Thời gian:{' '}
                                        </dt>
                                        <dd className="inline">{p.duration} năm</dd>
                                    </div>
                                )}
                                {p.tuitionFee != null && (
                                    <div>
                                        <dt className="inline font-medium text-slate-500">
                                            Học phí:{' '}
                                        </dt>
                                        <dd className="inline font-semibold text-primary">
                                            {(p.tuitionFee / 1_000_000).toFixed(1)}{' '}
                                            triệu/năm
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        {p.grouped.length > 0 ? (
                            <div className="mt-4 overflow-x-auto rounded-xl border border-slate-100">
                                <table className="min-w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200 bg-neutral/80 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            <th className="px-3 py-2.5">Năm</th>
                                            <th className="px-3 py-2.5">Tổ hợp</th>
                                            <th className="px-3 py-2.5">Phương thức</th>
                                            <th className="px-3 py-2.5 text-right">
                                                Điểm chuẩn
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {p.grouped.map((row) => (
                                            <tr
                                                key={row.rowKey}
                                                className="border-b border-slate-100 last:border-0"
                                            >
                                                <td className="px-3 py-2 whitespace-nowrap">
                                                    {row.year}
                                                </td>
                                                <td className="px-3 py-2 text-slate-700">
                                                    {formatSubjectCombinations(
                                                        row.subjectCombinations,
                                                    )}
                                                </td>
                                                <td className="max-w-[14rem] px-3 py-2 text-slate-600">
                                                    {row.admission_method ?? '—'}
                                                </td>
                                                <td className="px-3 py-2 text-right">
                                                    <span className="badge-score">
                                                        {row.score}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="mt-4 text-sm text-slate-500">
                                {selected
                                    ? 'Không có điểm chuẩn cho phương thức đã chọn.'
                                    : 'Chưa có điểm chuẩn.'}
                            </p>
                        )}
                    </article>
                    ))
                )}
            </div>
        </div>
    );
}
