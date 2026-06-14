'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { ExternalLink, X } from 'lucide-react';
import {
    buildComparePath,
    collectSubjectCombinations,
    computeCompareStats,
    universityLabel,
    writeStoredCompareEntries,
} from '@/lib/university-compare';
import {
    formatTuitionVnd,
    translateUniversityType,
} from '@/lib/utils';
import type { UniversityDetail } from '@/types';

interface Props {
    universities: UniversityDetail[];
    /** Ẩn nút xóa & thẻ mô tả — dùng nhúng trong chatbot. */
    embedded?: boolean;
}

type RowDef = {
    label: string;
    values: (string | React.ReactNode)[];
};

export function UniversityCompareView({ universities, embedded = false }: Props) {
    const router = useRouter();
    const allYears = useMemo(() => {
        const set = new Set<number>();
        for (const u of universities) {
            for (const p of u.universityMajors ?? []) {
                for (const c of p.cutoffScores ?? []) {
                    set.add(c.year);
                }
            }
        }
        return [...set].sort((a, b) => b - a);
    }, [universities]);

    const [year, setYear] = useState<number | null>(allYears[0] ?? null);
    const [subjectCombo, setSubjectCombo] = useState<string>('');

    const subjectOptions = useMemo(
        () => collectSubjectCombinations(universities, year),
        [universities, year],
    );

    const statsByUni = useMemo(
        () =>
            universities.map((u) =>
                computeCompareStats(
                    u,
                    year,
                    subjectCombo || null,
                ),
            ),
        [universities, year, subjectCombo],
    );

    const removeUniversity = (id: number) => {
        const remaining = universities.filter((u) => u.id !== id);
        writeStoredCompareEntries(
            remaining.map((u) => ({
                id: u.id,
                name: u.name,
                short_name: u.short_name,
            })),
        );
        if (remaining.length < 2) {
            router.push('/universities');
            return;
        }
        router.push(buildComparePath(remaining.map((u) => u.id)));
    };

    const rows: RowDef[] = [
        {
            label: 'Tên trường',
            values: universities.map((u) => (
                <Link
                    key={u.id}
                    href={`/universities/${u.id}`}
                    className="font-medium text-primary hover:underline"
                >
                    {u.name}
                </Link>
            )),
        },
        {
            label: 'Viết tắt',
            values: universities.map((u) => u.short_name ?? '—'),
        },
        {
            label: 'Loại hình',
            values: universities.map((u) => translateUniversityType(u.type)),
        },
        {
            label: 'Khu vực',
            values: universities.map((u) => u.location ?? '—'),
        },
        {
            label: 'Địa chỉ',
            values: universities.map((u) => u.address ?? '—'),
        },
        {
            label: 'Học phí (ước tính)',
            values: universities.map((u) =>
                formatTuitionVnd(u.tuition_fee_min, u.tuition_fee_max),
            ),
        },
        {
            label: 'Năm thành lập',
            values: universities.map((u) =>
                u.established_year ? String(u.established_year) : '—',
            ),
        },
        {
            label: 'Số ngành đào tạo',
            values: statsByUni.map((s) => String(s.programCount)),
        },
        {
            label: 'Phương thức xét tuyển',
            values: statsByUni.map((s) =>
                s.admissionMethodLabels.length
                    ? s.admissionMethodLabels.join(', ')
                    : '—',
            ),
        },
        {
            label:
                year != null
                    ? `Điểm chuẩn ${year}${subjectCombo ? ` · ${subjectCombo}` : ''}`
                    : 'Điểm chuẩn',
            values: statsByUni.map((s) => {
                if (s.cutoffCount === 0) return '—';
                if (s.cutoffMin != null && s.cutoffMax != null) {
                    if (s.cutoffMin === s.cutoffMax) {
                        return `${s.cutoffMin} (${s.cutoffCount} mức)`;
                    }
                    return `${s.cutoffMin} – ${s.cutoffMax} (${s.cutoffCount} mức)`;
                }
                return '—';
            }),
        },
        {
            label: 'Website',
            values: universities.map((u) =>
                u.website ? (
                    <a
                        key={u.id}
                        href={u.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                        Mở
                        <ExternalLink className="size-3.5" />
                    </a>
                ) : (
                    '—'
                ),
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="card flex flex-wrap items-end gap-4 p-4">
                <div>
                    <label
                        htmlFor="compare-year"
                        className="text-xs font-semibold uppercase text-slate-500"
                    >
                        Năm điểm chuẩn
                    </label>
                    <select
                        id="compare-year"
                        value={year ?? ''}
                        onChange={(e) => {
                            const v = Number(e.target.value);
                            setYear(Number.isFinite(v) ? v : null);
                            setSubjectCombo('');
                        }}
                        className="input-field mt-1 !w-auto min-w-[8rem]"
                    >
                        {allYears.length === 0 && (
                            <option value="">Không có dữ liệu</option>
                        )}
                        {allYears.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label
                        htmlFor="compare-combo"
                        className="text-xs font-semibold uppercase text-slate-500"
                    >
                        Tổ hợp môn
                    </label>
                    <select
                        id="compare-combo"
                        value={subjectCombo}
                        onChange={(e) => setSubjectCombo(e.target.value)}
                        className="input-field mt-1 !w-auto min-w-[10rem]"
                    >
                        <option value="">Tất cả tổ hợp</option>
                        {subjectOptions.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>
                <p className="text-xs text-slate-500">
                    Thông tin tham khảo — nên kiểm tra thêm trên website tuyển sinh
                    chính thức của từng trường.
                </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full min-w-[640px] border-collapse text-sm">
                    <thead>
                        <tr className="border-b border-slate-200 bg-neutral">
                            <th className="sticky left-0 z-10 bg-neutral px-4 py-3 text-left font-semibold text-slate-600">
                                Tiêu chí
                            </th>
                            {universities.map((u) => (
                                <th
                                    key={u.id}
                                    className="min-w-[10rem] px-4 py-3 text-left font-display font-bold text-primary"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <span>{universityLabel(u)}</span>
                                        {!embedded && (
                                            <button
                                                type="button"
                                                onClick={() => removeUniversity(u.id)}
                                                className="shrink-0 text-slate-400 hover:text-danger"
                                                title="Bỏ trường này"
                                            >
                                                <X className="size-4" />
                                            </button>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr
                                key={row.label}
                                className="border-b border-slate-100 last:border-0"
                            >
                                <td className="sticky left-0 z-10 bg-white px-4 py-3 font-medium text-slate-600">
                                    {row.label}
                                </td>
                                {row.values.map((cell, i) => (
                                    <td
                                        key={`${row.label}-${universities[i]?.id ?? i}`}
                                        className="px-4 py-3 text-slate-800"
                                    >
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {!embedded && (
                <div className="grid gap-4 lg:grid-cols-2">
                    {universities.map((u) => {
                        const topPrograms = [...(u.universityMajors ?? [])]
                            .slice(0, 6)
                            .map((p) => p.major.name);
                        return (
                            <div key={u.id} className="card p-4">
                                <h3 className="font-display font-bold text-primary">
                                    {universityLabel(u)}
                                </h3>
                                {u.description ? (
                                    <p className="mt-2 line-clamp-4 text-sm text-slate-600">
                                        {u.description}
                                    </p>
                                ) : (
                                    <p className="mt-2 text-sm text-slate-500">
                                        Chưa có mô tả.
                                    </p>
                                )}
                                {topPrograms.length > 0 && (
                                    <p className="mt-3 text-xs text-slate-500">
                                        Một số ngành:{' '}
                                        {topPrograms.join(' · ')}
                                        {(u.universityMajors?.length ?? 0) > 6
                                            ? ' …'
                                            : ''}
                                    </p>
                                )}
                                <Link
                                    href={`/universities/${u.id}`}
                                    className="btn-secondary mt-4 inline-flex text-sm"
                                >
                                    Xem chi tiết & điểm chuẩn
                                </Link>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
