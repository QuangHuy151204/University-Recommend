import Link from 'next/link';

import type { AdmissionTier, RecommendationItem } from '@/types';

import {
    formatSubjectCombinations,
    groupCutoffScores,
} from '@/lib/cutoff-display';

import {
    RecommendFilterSummary,
    type RecommendFilterSummaryData,
} from '@/components/RecommendFilterSummary';

import { formatTuitionVnd } from '@/lib/utils';


const TIER_LABELS: Record<AdmissionTier, string> = {
    safety: 'An toàn',
    match: 'Vừa sức',
    reach: 'Cân nhắc',
};



const TIER_LEGEND: Record<AdmissionTier, string> = {

    safety: 'Điểm dự kiến bằng hoặc cao hơn điểm chuẩn gần nhất',
    match: 'Điểm dự kiến thấp hơn không quá 1.0 điểm',
    reach: 'Điểm dự kiến thấp hơn trên 1.0 điểm, nên xem là nguyện vọng thử sức',
};



const TIER_STYLES: Record<AdmissionTier, string> = {

    safety: 'bg-emerald-100 text-emerald-800',

    match: 'bg-amber-100 text-amber-800',

    reach: 'bg-rose-100 text-rose-800',

};



const TIER_ORDER: AdmissionTier[] = ['safety', 'match', 'reach'];



function tierBadge(tier: AdmissionTier | null) {

    if (!tier) return null;

    return (

        <span

            className={`rounded-full px-3 py-1 text-xs font-bold ${TIER_STYLES[tier]}`}

            title={TIER_LEGEND[tier]}

        >

            {TIER_LABELS[tier]}

        </span>

    );

}



function ResultCard({ r }: { r: RecommendationItem }) {

    return (

        <article className="card p-6">

            <div className="flex flex-wrap items-start justify-between gap-4">

                <div className="min-w-0 flex-1">

                    <Link

                        href={`/universities/${r.university.id}`}

                        className="font-display text-lg font-bold text-primary hover:underline"

                    >

                        {r.university.name}

                    </Link>

                    {r.university.short_name && (

                        <span className="ml-2 text-sm text-slate-500">

                            ({r.university.short_name})

                        </span>

                    )}

                    <p className="mt-1 text-sm text-slate-600">

                        Ngành:{' '}

                        <span className="font-semibold">{r.major.name}</span>

                        {(r.major.groups?.length
                            ? r.major.groups.map((g) => g.group_name)
                            : r.major.field_group
                              ? [r.major.field_group]
                              : []
                        ).map((groupName) => (
                            <span
                                key={groupName}
                                className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                            >
                                {groupName}
                            </span>
                        ))}

                    </p>

                    <p className="mt-1 text-xs text-slate-500">

                        {r.university.location ?? 'Hà Nội'} ·{' '}

                        {formatTuitionVnd(

                            r.university.tuition_fee_min,

                            r.university.tuition_fee_max,

                        )}

                        {r.referenceCutoff != null && (

                            <>

                                {' '}

                                · Chuẩn {r.referenceCutoff}

                                {r.scoreDiff != null && (

                                    <span>

                                        {' '}

                                        (

                                        {r.scoreDiff >= 0 ? '+' : ''}

                                        {r.scoreDiff.toFixed(2)})

                                    </span>

                                )}

                            </>

                        )}

                    </p>

                </div>

                <div className="flex flex-wrap items-center justify-end gap-2">

                    {tierBadge(r.admissionTier)}

                </div>

            </div>

            {r.cutoffScores && r.cutoffScores.length > 0 && (

                <div className="mt-4 overflow-x-auto rounded-xl border border-slate-100">

                    <table className="min-w-full text-sm">

                        <thead className="bg-neutral text-left text-xs font-semibold text-primary">

                            <tr>

                                <th className="px-4 py-2">Năm</th>

                                <th className="px-4 py-2">Tổ hợp</th>

                                <th className="px-4 py-2">Phương thức</th>

                                <th className="px-4 py-2 text-right">Điểm</th>

                            </tr>

                        </thead>

                        <tbody>

                            {groupCutoffScores(r.cutoffScores).map((row) => (

                                <tr

                                    key={row.rowKey}

                                    className="border-t border-slate-100"

                                >

                                    <td className="px-4 py-2">{row.year}</td>

                                    <td className="px-4 py-2">

                                        {formatSubjectCombinations(

                                            row.subjectCombinations,

                                        )}

                                    </td>

                                    <td className="px-4 py-2">

                                        {row.admission_method ?? '—'}

                                    </td>

                                    <td className="px-4 py-2 text-right font-bold text-primary">

                                        {row.score}

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

            {r.reason.length > 0 && (

                <ul className="mt-3 space-y-1 text-xs text-slate-600">

                    {r.reason.map((reason, i) => (

                        <li key={i}>• {reason}</li>

                    ))}

                </ul>

            )}

        </article>

    );

}



export function RecommendResults({
    results,
    diversified,
    filters,
}: {
    results: RecommendationItem[];
    diversified?: boolean;
    filters?: RecommendFilterSummaryData;
}) {
    const tierCounts = TIER_ORDER.reduce(

        (acc, tier) => {

            acc[tier] = results.filter((r) => r.admissionTier === tier).length;

            return acc;

        },

        {} as Record<AdmissionTier, number>,

    );

    const untiered = results.filter((r) => !r.admissionTier).length;



    const grouped = TIER_ORDER.map((tier) => ({

        tier,

        items: results.filter((r) => r.admissionTier === tier),

    })).filter((g) => g.items.length > 0);

    const untieredItems = results.filter((r) => !r.admissionTier);



    return (
        <div className="space-y-6">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(240px,280px)] lg:items-start">
                <div className="space-y-3">
                    <div>
                        <h2 className="font-display text-xl font-bold text-primary sm:text-2xl">
                            Top {results.length} gợi ý phù hợp
                        </h2>
                        {diversified && (
                            <p className="mt-1 text-sm text-slate-500">
                                Tối đa 3 ngành / trường để danh sách đa dạng hơn.
                            </p>
                        )}
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3">
                        <div className="flex flex-wrap gap-2 text-xs">
                            {TIER_ORDER.map((tier) =>
                                tierCounts[tier] > 0 ? (
                                    <span
                                        key={tier}
                                        className={`rounded-full px-3 py-1 font-medium ${TIER_STYLES[tier]}`}
                                        title={TIER_LEGEND[tier]}
                                    >
                                        {TIER_LABELS[tier]}: {tierCounts[tier]}
                                    </span>
                                ) : null,
                            )}
                            {untiered > 0 && (
                                <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">
                                    Chưa có chuẩn: {untiered}
                                </span>
                            )}
                        </div>
                        <p className="mt-2.5 text-xs leading-relaxed text-slate-500">
                            Phân tầng dựa trên chênh lệch giữa điểm dự kiến và điểm
                            chuẩn gần nhất: An toàn {'\u2265'} 0, Vừa sức từ -1.0 đến{' '}
                            {'<'} 0, Cân nhắc {'<'} -1.0.
                        </p>
                    </div>
                </div>

                {filters ? <RecommendFilterSummary {...filters} /> : null}
            </div>


            {grouped.map(({ tier, items }) => (

                <section key={tier} className="space-y-4">

                    <h3 className="text-sm font-semibold text-slate-700">

                        {TIER_LABELS[tier]} ({items.length})

                    </h3>

                    {items.map((r) => (

                        <ResultCard key={r.id} r={r} />

                    ))}

                </section>

            ))}



            {untieredItems.length > 0 && (

                <section className="space-y-4">

                    <h3 className="text-sm font-semibold text-slate-700">

                        Chưa đủ điểm chuẩn để phân tầng ({untieredItems.length})

                    </h3>

                    {untieredItems.map((r) => (

                        <ResultCard key={r.id} r={r} />

                    ))}

                </section>

            )}

        </div>

    );

}

