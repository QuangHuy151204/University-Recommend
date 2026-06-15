'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Stepper } from '@/components/Stepper';
import { SubjectCombinationPicker } from '@/components/ui/SubjectCombinationPicker';
import { WardPicker } from '@/components/ui/WardPicker';
import { RecommendResults } from '@/components/RecommendResults';
import { RecommendEmptyState } from '@/components/RecommendEmptyState';
import { AlertBox, PageHeader, PageShell } from '@/components/ui/PageLayout';
import { useAuth } from '@/lib/auth';
import { ApiClientError } from '@/lib/api';
import { getMe, updateProfile } from '@/services/auth';
import { recommend } from '@/services/recommendations';
import { listAdmissionMethods } from '@/services/admission-methods';
import type {
    AdmissionMethod,
    RecommendRequest,
    RecommendResponse,
    StudentProfile,
} from '@/types';

const STEPS = [
    { id: 1, label: 'Điểm & khối' },
    { id: 2, label: 'Sở thích' },
    { id: 3, label: 'Ngân sách & xét tuyển' },
    { id: 4, label: 'Kết quả' },
];

const BUDGET_MIN = 0;
const BUDGET_MAX = 80_000_000;
const BUDGET_STEP = 500_000;

function formatBudgetYearlyVnd(value: number): string {
    return `${Math.round(value).toLocaleString('vi-VN')} VNĐ/năm`;
}

function budgetRangeFromAmount(amount: number): RecommendRequest['budget_range'] {
    if (amount <= 15_000_000) return 'low';
    if (amount <= 30_000_000) return 'medium';
    return 'high';
}

function budgetAmountFromProfile(p: StudentProfile | null | undefined): number {
    if (p?.budget_max_yearly && p.budget_max_yearly > 0) {
        return p.budget_max_yearly;
    }
    if (p?.budget_range === 'low') return 15_000_000;
    if (p?.budget_range === 'medium') return 30_000_000;
    if (p?.budget_range === 'high') return 50_000_000;
    return 20_000_000;
}

function profileToForm(p: StudentProfile | null | undefined): RecommendRequest {
    return {
        expected_score: p?.expected_score ?? 20,
        subject_combination: p?.subject_combination ?? 'A00',
        interests: p?.interests ?? '',
        preferred_location: p?.preferred_location ?? '',
        budget_range: p?.budget_range ?? 'medium',
        budget_max_yearly: budgetAmountFromProfile(p),
        career_goal: p?.career_goal ?? '',
        method_code: p?.preferred_method_code ?? 'THPT',
    };
}

function resolveMethodLabel(
    code: string | undefined,
    methods: AdmissionMethod[],
    fallback?: string | null,
): string {
    const method = methods.find((m) => m.method_code === code);
    if (method) return `${method.method_name} (${method.method_code})`;
    if (fallback) return fallback;
    return code?.trim() || 'THPT';
}

export function RecommendWizard() {
    const { token } = useAuth();
    const [step, setStep] = useState(1);
    const [form, setForm] = useState<RecommendRequest>(profileToForm(null));
    const [budgetAmount, setBudgetAmount] = useState(20_000_000);
    const [methods, setMethods] = useState<AdmissionMethod[]>([]);
    const [loadingProfile, setLoadingProfile] = useState(!!token);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [response, setResponse] = useState<RecommendResponse | null>(null);
    useEffect(() => {
        listAdmissionMethods()
            .then(setMethods)
            .catch(() => setMethods([]));
    }, []);

    useEffect(() => {
        if (!token) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLoadingProfile(false);
            return;
        }
        let cancelled = false;
        getMe()
            .then((me) => {
                if (cancelled) return;
                const next = profileToForm(me.profile);
                setForm(next);
                setBudgetAmount(next.budget_max_yearly ?? 20_000_000);
            })
            .catch(() => {})
            .finally(() => {
                if (!cancelled) setLoadingProfile(false);
            });
        return () => {
            cancelled = true;
        };
    }, [token]);

    function goNext() {
        setError(null);
        if (step === 1) {
            if (!form.subject_combination?.trim()) {
                setError('Vui lòng chọn tổ hợp môn.');
                return;
            }
            if (
                form.expected_score == null ||
                form.expected_score < 0 ||
                form.expected_score > 30
            ) {
                setError('Điểm dự kiến phải từ 0 đến 30.');
                return;
            }
        }
        if (step === 2 && !form.interests?.trim()) {
            setError('Nhập ít nhất một từ khóa ngành / sở thích.');
            return;
        }
        if (step === 3) {
            void runRecommend();
            return;
        }
        setStep((s) => Math.min(s + 1, 4));
    }

    async function runRecommend() {
        setSubmitting(true);
        setError(null);
        const payload: RecommendRequest = {
            ...form,
            preferred_location: form.preferred_location?.trim() || undefined,
            budget_range: budgetRangeFromAmount(budgetAmount),
            budget_max_yearly: budgetAmount,
            method_code: form.method_code?.trim() || 'THPT',
        };
        try {
            const res = await recommend(payload, token ?? undefined);
            setResponse(res);
            if (token) {
                try {
                    await updateProfile(
                        {
                            expected_score: payload.expected_score,
                            subject_combination: payload.subject_combination,
                            interests: payload.interests,
                            preferred_location: payload.preferred_location,
                            budget_range: payload.budget_range,
                            budget_max_yearly: payload.budget_max_yearly,
                            career_goal: payload.career_goal,
                            preferred_method_code: payload.method_code,
                        },
                        token,
                    );
                } catch {
                    // Profile sync is best-effort; results still shown.
                }
            }
            setStep(4);
        } catch (err) {
            setError(
                err instanceof ApiClientError
                    ? err.message
                    : 'Không lấy được gợi ý. Kiểm tra backend.',
            );
        } finally {
            setSubmitting(false);
        }
    }

    if (loadingProfile) {
        return (
            <PageShell>
                <p className="text-center text-sm text-slate-500">
                    Đang tải bộ lọc từ hồ sơ…
                </p>
            </PageShell>
        );
    }

    return (
        <PageShell maxWidth="max-w-3xl">
            <PageHeader
                eyebrow="Gợi ý"
                title="Gợi ý trường – ngành"
                subtitle={
                    token
                        ? 'Đã điền sẵn từ hồ sơ của bạn. Bạn có thể chỉnh trước khi xem gợi ý.'
                        : 'Điền tiêu chí để nhận danh sách trường và ngành phù hợp (An toàn / Vừa sức / Cân nhắc).'
                }
            />

            <div className="mb-8">
                <Stepper steps={STEPS} current={step} />
            </div>

            <div className="card space-y-5 p-6 sm:p-8">
                {step === 1 && (
                    <>
                        <div className="flex items-center gap-2 text-primary">
                            <Sparkles className="size-5" aria-hidden />
                            <h2 className="font-display font-bold">Điểm & tổ hợp</h2>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Điểm dự kiến (0–30)
                                </label>
                                <input
                                    type="number"
                                    step="0.05"
                                    min={0}
                                    max={30}
                                    value={form.expected_score}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            expected_score: Number(e.target.value),
                                        })
                                    }
                                    className="input-field"
                                />
                            </div>
                            <SubjectCombinationPicker
                                id="recommend-subject"
                                label="Tổ hợp môn"
                                value={form.subject_combination}
                                onChange={(code) =>
                                    setForm({
                                        ...form,
                                        subject_combination: code || 'A00',
                                    })
                                }
                            />
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <h2 className="font-display font-bold text-primary">
                            Sở thích & mục tiêu
                        </h2>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Ngành / lĩnh vực quan tâm
                            </label>
                            <input
                                type="text"
                                placeholder="VD: CNTT, Marketing, Y khoa"
                                value={form.interests}
                                onChange={(e) =>
                                    setForm({ ...form, interests: e.target.value })
                                }
                                className="input-field"
                            />
                        </div>
                        <WardPicker
                            id="recommend-ward"
                            label="Khu vực"
                            value={form.preferred_location ?? ''}
                            onChange={(ward) =>
                                setForm({ ...form, preferred_location: ward || undefined })
                            }
                        />
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Mục tiêu nghề nghiệp (tuỳ chọn)
                            </label>
                            <textarea
                                rows={3}
                                value={form.career_goal ?? ''}
                                onChange={(e) =>
                                    setForm({ ...form, career_goal: e.target.value })
                                }
                                className="input-field resize-y"
                            />
                        </div>
                    </>
                )}

                {step === 3 && (
                    <>
                        <h2 className="font-display font-bold text-primary">
                            Ngân sách & phương thức xét tuyển
                        </h2>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Học phí tối đa / năm
                            </label>
                            <input
                                type="range"
                                min={BUDGET_MIN}
                                max={BUDGET_MAX}
                                step={BUDGET_STEP}
                                value={budgetAmount}
                                onChange={(e) =>
                                    setBudgetAmount(Number(e.target.value))
                                }
                                className="w-full accent-primary"
                            />
                            <p className="mt-2 text-sm font-semibold text-primary">
                                {formatBudgetYearlyVnd(budgetAmount)}
                            </p>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Phương thức xét tuyển
                            </label>
                            <select
                                value={form.method_code ?? 'THPT'}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        method_code: e.target.value,
                                    })
                                }
                                className="input-field"
                            >
                                {methods.length > 0 ? (
                                    methods.map((m) => (
                                        <option key={m.method_code} value={m.method_code}>
                                            {m.method_name} ({m.method_code})
                                        </option>
                                    ))
                                ) : (
                                    <option value="THPT">THPT Quốc gia (THPT)</option>
                                )}
                            </select>
                            <p className="mt-1 text-xs text-slate-500">
                                Điểm chuẩn được so sánh theo phương thức xét tuyển bạn
                                chọn (mặc định THPT Quốc gia).
                            </p>
                        </div>
                    </>
                )}

                {step === 4 && response && (
                    <>
                        {response.results.length === 0 && response.meta ? (
                            <RecommendEmptyState meta={response.meta} />
                        ) : (
                            <RecommendResults
                                results={response.results}
                                diversified={response.meta.diversified}
                                filters={{
                                    expectedScore: form.expected_score,
                                    subjectCombination: form.subject_combination,
                                    interests: form.interests,
                                    careerGoal: form.career_goal,
                                    budgetMaxYearly: budgetAmount,
                                    methodLabel: resolveMethodLabel(
                                        form.method_code,
                                        methods,
                                        response.meta.filtersApplied.method_label,
                                    ),
                                    location: form.preferred_location?.trim() || 'Tất cả phường (Hà Nội)',
                                }}
                            />
                        )}
                    </>
                )}

                {error && <AlertBox variant="error">{error}</AlertBox>}

                <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5">
                    {step > 1 && step < 4 && (
                        <button
                            type="button"
                            onClick={() => setStep((s) => s - 1)}
                            className="btn-secondary"
                        >
                            Quay lại
                        </button>
                    )}
                    {step < 4 && (
                        <button
                            type="button"
                            onClick={goNext}
                            disabled={submitting}
                            className="btn-primary"
                        >
                            {step === 3
                                ? submitting
                                    ? 'Đang gợi ý…'
                                    : 'Xem gợi ý'
                                : 'Tiếp theo'}
                        </button>
                    )}
                    {step === 4 && (
                        <>
                            <button
                                type="button"
                                onClick={() => {
                                    setResponse(null);
                                    setStep(1);
                                }}
                                className="btn-secondary"
                            >
                                Chỉnh bộ lọc
                            </button>
                            {!token && (
                                <Link href="/login?redirect=/recommend" className="btn-primary">
                                    Đăng nhập để lưu hồ sơ
                                </Link>
                            )}
                            {token && (
                                <Link href="/profile" className="btn-secondary">
                                    Xem hồ sơ
                                </Link>
                            )}
                        </>
                    )}
                    {!token && step < 4 && (
                        <Link
                            href="/login?redirect=/recommend"
                            className="text-sm text-slate-500 hover:text-primary"
                        >
                            Đăng nhập để dùng bộ lọc đã lưu
                        </Link>
                    )}
                </div>
            </div>
        </PageShell>
    );
}
