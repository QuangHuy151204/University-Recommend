'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, X } from 'lucide-react';
import {
    buildComparePath,
    computeCompareStats,
    universityLabel,
    writeStoredCompareEntries,
} from '@/lib/university-compare';
import {
    formatCutoffScore,
    formatTuitionVnd,
    translateUniversityType,
} from '@/lib/utils';
import type { AdmissionMethod, UniversityDetail } from '@/types';
import { listAdmissionMethods } from '@/services/admission-methods';

interface Props {
    universities: UniversityDetail[];
    admissionMethods?: AdmissionMethod[];
    /** Ẩn nút xóa & thẻ mô tả — dùng nhúng trong chatbot. */
    embedded?: boolean;
}

type RowDef = {
    label: string;
    values: (string | React.ReactNode)[];
};

export function UniversityCompareView({
    universities,
    admissionMethods,
    embedded = false,
}: Props) {
    const router = useRouter();
    const [methodCatalog, setMethodCatalog] = useState<AdmissionMethod[]>(
        admissionMethods ?? [],
    );

    useEffect(() => {
        if (admissionMethods?.length) {
            setMethodCatalog(admissionMethods);
            return;
        }
        let cancelled = false;
        void listAdmissionMethods()
            .then((rows) => {
                if (!cancelled) setMethodCatalog(rows);
            })
            .catch(() => {});
        return () => {
            cancelled = true;
        };
    }, [admissionMethods]);
    const compareYear = useMemo(() => {
        const set = new Set<number>();
        for (const u of universities) {
            for (const p of u.universityMajors ?? []) {
                for (const c of p.cutoffScores ?? []) {
                    set.add(c.year);
                }
            }
        }
        const years = [...set].sort((a, b) => b - a);
        return years[0] ?? null;
    }, [universities]);

    const statsByUni = useMemo(
        () =>
            universities.map((u) =>
                computeCompareStats(
                    u,
                    compareYear,
                    null,
                    methodCatalog,
                    null,
                ),
            ),
        [universities, compareYear, methodCatalog],
    );

    const colPercent = universities.length > 0
        ? `${Math.floor(78 / universities.length)}%`
        : '39%';

    function renderCellContent(content: React.ReactNode) {
        return (
            <div className="flex min-h-[2.75rem] flex-col justify-center">
                {content}
            </div>
        );
    }

    function renderMajorCutoffList(majors: ReturnType<typeof computeCompareStats>['topMajorCutoffs']) {
        if (majors.length === 0) return '—';
        return (
            <ul className="space-y-1.5 text-xs">
                {majors.map((m) => (
                    <li key={`${m.majorName}-${m.score}`}>
                        <span className="font-medium text-slate-800">
                            {m.majorName}
                            {m.subjectCombination ? ` (${m.subjectCombination})` : ''}
                        </span>
                        <span className="text-slate-600">
                            {' '}
                            · {formatCutoffScore(m.score)}
                        </span>
                    </li>
                ))}
            </ul>
        );
    }

    function formatCutoffRange(s: ReturnType<typeof computeCompareStats>) {
        if (s.cutoffProgramCount === 0) return '—';
        if (s.cutoffMin == null || s.cutoffMax == null) return '—';
        const min = formatCutoffScore(s.cutoffMin);
        const max = formatCutoffScore(s.cutoffMax);
        const countLabel = `${s.cutoffProgramCount} ngành`;
        if (s.cutoffMin === s.cutoffMax) {
            return `${min} · ${countLabel}`;
        }
        return `${min} – ${max} · ${countLabel}`;
    }

    function renderTagList(labels: string[]) {
        if (labels.length === 0) return '—';
        return (
            <ul className="flex flex-wrap gap-1.5">
                {labels.map((label) => (
                    <li
                        key={label}
                        className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700"
                    >
                        {label}
                    </li>
                ))}
            </ul>
        );
    }

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
            values: statsByUni.map((s) => renderTagList(s.admissionMethodLabels)),
        },
        {
            label:
                compareYear != null
                    ? `Khoảng điểm chung ${compareYear}`
                    : 'Khoảng điểm chung',
            values: statsByUni.map((s) => formatCutoffRange(s)),
        },
        {
            label:
                compareYear != null
                    ? `Điểm theo ngành ${compareYear}`
                    : 'Điểm theo ngành',
            values: statsByUni.map((s) => renderMajorCutoffList(s.topMajorCutoffs)),
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
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full min-w-[640px] table-fixed border-collapse text-sm">
                    <colgroup>
                        <col className="w-[22%]" />
                        {universities.map((u) => (
                            <col key={u.id} style={{ width: colPercent }} />
                        ))}
                    </colgroup>
                    <thead>
                        <tr className="border-b border-slate-200 bg-neutral">
                            <th className="sticky left-0 z-10 bg-neutral px-4 py-3 text-left align-top font-semibold text-slate-600">
                                Tiêu chí
                            </th>
                            {universities.map((u) => (
                                <th
                                    key={u.id}
                                    className="px-4 py-3 text-left align-top font-display font-bold text-primary"
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
                                <td className="sticky left-0 z-10 bg-white px-4 py-3 align-top font-medium text-slate-600">
                                    {row.label}
                                </td>
                                {row.values.map((cell, i) => (
                                    <td
                                        key={`${row.label}-${universities[i]?.id ?? i}`}
                                        className="px-4 py-3 align-top text-slate-800"
                                    >
                                        {renderCellContent(cell)}
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
