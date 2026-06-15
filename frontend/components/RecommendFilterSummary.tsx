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
    return (
        <aside className="rounded-xl border border-slate-200 bg-slate-50/90 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Bộ lọc của bạn
            </h3>
            <dl className="mt-3 space-y-2.5">
                <SummaryRow
                    label="Điểm dự kiến"
                    value={Number(expectedScore).toFixed(2)}
                />
                <SummaryRow label="Tổ hợp" value={subjectCombination} />
                <SummaryRow label="Sở thích" value={interests.trim() || '—'} />
                {careerGoal?.trim() ? (
                    <SummaryRow label="Mục tiêu" value={careerGoal.trim()} />
                ) : null}
                <SummaryRow
                    label="Học phí tối đa"
                    value={formatBudgetYearlyVnd(budgetMaxYearly)}
                />
                <SummaryRow label="Xét tuyển" value={methodLabel} />
                {location ? <SummaryRow label="Khu vực" value={location} /> : null}
            </dl>
        </aside>
    );
}
