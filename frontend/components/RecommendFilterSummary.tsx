'use client';

import { useLocale } from '@/lib/i18n/locale';

export interface RecommendFilterSummaryData {
    expectedScore: number;
    subjectCombination: string;
    interests: string;
    careerGoal?: string | null;
    budgetMaxYearly: number;
    methodLabel: string;
    location?: string;
}

function formatBudgetYearlyVnd(value: number): string {
    return `${Math.round(value).toLocaleString('vi-VN')} VNĐ/năm`;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-4 gap-y-0.5 text-sm">
            <dt className="text-slate-500">{label}</dt>
            <dd className="text-right font-medium text-slate-800">{value}</dd>
        </div>
    );
}

export function RecommendFilterSummary({
    expectedScore,
    subjectCombination,
    interests,
    careerGoal,
    budgetMaxYearly,
    methodLabel,
    location,
}: RecommendFilterSummaryData) {
    const { t } = useLocale();

    return (
        <aside className="rounded-xl border border-slate-200 bg-slate-50/90 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {t('recommend.filtersTitle')}
            </h3>
            <dl className="mt-3 space-y-2.5">
                <SummaryRow
                    label={t('recommend.filterScore')}
                    value={Number(expectedScore).toFixed(2)}
                />
                <SummaryRow
                    label={t('recommend.filterCombo')}
                    value={subjectCombination}
                />
                <SummaryRow
                    label={t('recommend.filterInterests')}
                    value={interests.trim() || '—'}
                />
                {careerGoal?.trim() ? (
                    <SummaryRow
                        label={t('recommend.filterGoal')}
                        value={careerGoal.trim()}
                    />
                ) : null}
                <SummaryRow
                    label={t('recommend.filterTuition')}
                    value={formatBudgetYearlyVnd(budgetMaxYearly)}
                />
                <SummaryRow
                    label={t('recommend.filterMethod')}
                    value={methodLabel}
                />
                {location ? (
                    <SummaryRow
                        label={t('recommend.filterArea')}
                        value={location}
                    />
                ) : null}
            </dl>
        </aside>
    );
}
