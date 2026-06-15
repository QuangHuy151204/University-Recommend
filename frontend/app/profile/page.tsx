'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, Sparkles } from 'lucide-react';
import { getMe, updateProfile } from '@/services/auth';
import { listAdmissionMethods } from '@/services/admission-methods';
import type { AdmissionMethod } from '@/types';
import { ApiClientError } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import {
    AlertBox,
    PageHeader,
    PageShell,
} from '@/components/ui/PageLayout';
import type {
    MeResponse,
    UpdateProfilePayload,
    StudentProfile,
} from '@/types';
import { SubjectCombinationPicker } from '@/components/ui/SubjectCombinationPicker';
import { WardPicker } from '@/components/ui/WardPicker';
import { FavoritesSection } from '@/components/favorites/FavoritesSection';

const BUDGET_MIN = 0;
const BUDGET_MAX = 80_000_000;
const BUDGET_STEP = 500_000;
function formatBudgetYearlyVnd(value: number): string {
    return `${Math.round(value).toLocaleString('vi-VN')} VNĐ/năm`;
}

function budgetRangeFromAmount(amount: number): UpdateProfilePayload['budget_range'] {
    if (amount <= 15_000_000) return 'low';
    if (amount <= 30_000_000) return 'medium';
    return 'high';
}

function budgetAmountFromRange(
    value: UpdateProfilePayload['budget_range'] | null | undefined,
): number {
    if (value === 'low') return 15_000_000;
    if (value === 'medium') return 30_000_000;
    if (value === 'high') return 50_000_000;
    return 20_000_000;
}

function emptyForm(p: StudentProfile | null | undefined): UpdateProfilePayload {
    return {
        expected_score: p?.expected_score ?? undefined,
        subject_combination: p?.subject_combination ?? '',
        interests: p?.interests ?? '',
        preferred_location: p?.preferred_location ?? '',
        budget_range: (p?.budget_range as UpdateProfilePayload['budget_range']) ?? undefined,
        career_goal: p?.career_goal ?? '',
        preferred_method_code: p?.preferred_method_code ?? 'THPT',
        budget_max_yearly: p?.budget_max_yearly ?? undefined,
    };
}

export default function ProfilePage() {
    const router = useRouter();
    const { token, user, loading: authLoading, refreshUser } = useAuth();

    const [me, setMe] = useState<MeResponse | null>(null);
    const [form, setForm] = useState<UpdateProfilePayload>(emptyForm(null));
    const [budgetAmount, setBudgetAmount] = useState<number>(20_000_000);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [methods, setMethods] = useState<AdmissionMethod[]>([]);

    useEffect(() => {
        if (authLoading) return;
        if (!token) {
            router.replace('/login?redirect=/profile');
            return;
        }

        let cancelled = false;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);

        listAdmissionMethods()
            .then(setMethods)
            .catch(() => setMethods([]));

        getMe()
            .then((data) => {
                if (cancelled) return;
                setMe(data);
                setForm(emptyForm(data.profile));
                setBudgetAmount(
                    budgetAmountFromRange(
                        data.profile?.budget_range as
                            | UpdateProfilePayload['budget_range']
                            | null
                            | undefined,
                    ),
                );
                if (user && (user.name !== data.name || user.email !== data.email)) {
                    refreshUser({
                        id: data.id,
                        name: data.name,
                        email: data.email,
                        role: data.role,
                    });
                }
            })
            .catch((err) => {
                if (cancelled) return;
                if (err instanceof ApiClientError && err.status === 401) {
                    router.replace('/login?redirect=/profile');
                    return;
                }
                setError(
                    err instanceof ApiClientError
                        ? err.message
                        : 'Không tải được hồ sơ.',
                );
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, authLoading]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!token || saving) return;
        setError(null);
        setSuccess(null);
        setSaving(true);

        const payload: UpdateProfilePayload = {};
        if (form.expected_score !== undefined && form.expected_score !== null) {
            payload.expected_score = Number(form.expected_score);
        }
        if (form.subject_combination) payload.subject_combination = form.subject_combination;
        if (form.interests) payload.interests = form.interests;
        if (form.preferred_location !== undefined) {
            payload.preferred_location = form.preferred_location.trim() || undefined;
        }
        payload.budget_range = budgetRangeFromAmount(budgetAmount);
        payload.budget_max_yearly = budgetAmount;
        if (form.career_goal) payload.career_goal = form.career_goal;
        if (form.preferred_method_code) {
            payload.preferred_method_code = form.preferred_method_code;
        }

        try {
            const updated = await updateProfile(payload);
            setMe(updated);
            setForm(emptyForm(updated.profile));
            setSuccess('Đã lưu hồ sơ.');
        } catch (err) {
            setError(
                err instanceof ApiClientError
                    ? err.message
                    : 'Lưu hồ sơ thất bại.',
            );
        } finally {
            setSaving(false);
        }
    }

    if (authLoading || loading) {
        return (
            <PageShell maxWidth="max-w-2xl" className="space-y-6">
                <p className="text-center text-sm text-slate-500">Đang tải hồ sơ…</p>
            </PageShell>
        );
    }

    return (
        <PageShell maxWidth="max-w-2xl" className="space-y-6">
            <PageHeader
                eyebrow="Tài khoản"
                title="Hồ sơ học sinh"
                subtitle="Thông tin này được dùng để điền sẵn form gợi ý và dùng chatbot."
            />

            {me && (
                <div className="card mb-6 flex gap-4 p-5">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <User className="size-6" aria-hidden />
                    </div>
                    <dl className="space-y-1 text-sm">
                        <div>
                            <dt className="inline font-medium text-slate-500">Tên: </dt>
                            <dd className="inline text-slate-900">{me.name}</dd>
                        </div>
                        <div>
                            <dt className="inline font-medium text-slate-500">Email: </dt>
                            <dd className="inline text-slate-900">{me.email}</dd>
                        </div>
                        <div>
                            <dt className="inline font-medium text-slate-500">Vai trò: </dt>
                            <dd className="inline capitalize text-slate-900">{me.role}</dd>
                        </div>
                    </dl>
                </div>
            )}

            <form onSubmit={handleSubmit} className="card space-y-5 p-6 sm:p-8">
                <div className="flex items-center gap-2 text-primary">
                    <Sparkles className="size-5" aria-hidden />
                    <h2 className="font-display font-bold">Tiêu chí tuyển sinh</h2>
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
                            value={form.expected_score ?? ''}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    expected_score:
                                        e.target.value === ''
                                            ? undefined
                                            : Number(e.target.value),
                                })
                            }
                            className="input-field"
                        />
                    </div>

                    <div>
                        <SubjectCombinationPicker
                            id="profile-subject"
                            label="Tổ hợp môn"
                            value={form.subject_combination ?? ''}
                            onChange={(code) =>
                                setForm({
                                    ...form,
                                    subject_combination: code || undefined,
                                })
                            }
                        />
                    </div>

                    <WardPicker
                        id="profile-ward"
                        label="Khu vực"
                        value={form.preferred_location ?? ''}
                        onChange={(ward) =>
                            setForm({ ...form, preferred_location: ward || undefined })
                        }
                    />

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Khả năng tài chính tối đa cho học phí
                        </label>
                        <input
                            type="range"
                            min={BUDGET_MIN}
                            max={BUDGET_MAX}
                            step={BUDGET_STEP}
                            value={budgetAmount}
                            onChange={(e) => setBudgetAmount(Number(e.target.value))}
                            className="mt-1 w-full accent-primary"
                        />
                        <p className="mt-2 text-sm font-semibold text-primary">
                            Tối đa: {formatBudgetYearlyVnd(budgetAmount)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                            Đơn vị là học phí ước tính cho 1 năm học (12 tháng).
                        </p>
                    </div>
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Sở thích ngành nghề
                    </label>
                    <input
                        type="text"
                        placeholder="VD: CNTT, Trí tuệ nhân tạo, Marketing"
                        value={form.interests ?? ''}
                        onChange={(e) =>
                            setForm({ ...form, interests: e.target.value })
                        }
                        className="input-field"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Phương thức xét tuyển ưu tiên
                    </label>
                    <select
                        value={form.preferred_method_code ?? 'THPT'}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                preferred_method_code: e.target.value,
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
                        Dùng làm mặc định cho trang gợi ý và tra cứu điểm chuẩn.
                    </p>
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Mục tiêu nghề nghiệp
                    </label>
                    <textarea
                        rows={3}
                        placeholder="VD: trở thành kỹ sư phần mềm tại doanh nghiệp công nghệ"
                        value={form.career_goal ?? ''}
                        onChange={(e) =>
                            setForm({ ...form, career_goal: e.target.value })
                        }
                        className="input-field resize-y"
                    />
                </div>

                {error && <AlertBox variant="error">{error}</AlertBox>}
                {success && <AlertBox variant="success">{success}</AlertBox>}

                <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5">
                    <button type="submit" disabled={saving} className="btn-primary">
                        {saving ? 'Đang lưu…' : 'Lưu hồ sơ'}
                    </button>
                    <Link href="/recommend" className="btn-secondary">
                        Gợi ý trường – ngành
                    </Link>
                    <Link href="/chatbot" className="btn-secondary">
                        Chatbot
                    </Link>
                </div>
            </form>

            <FavoritesSection />
        </PageShell>
    );
}
