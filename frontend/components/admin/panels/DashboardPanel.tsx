'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    BarChart3,
    GraduationCap,
    ListChecks,
    Users,
} from 'lucide-react';
import { getAdminStats, type AdminStats } from '@/services/admin';
import { ApiClientError } from '@/lib/api';
import { ADMIN_TABS, adminTabHref, type AdminTabId } from '@/lib/admin-tabs';

const STAT_CARDS: Array<{
    key: keyof AdminStats;
    label: string;
    icon: typeof GraduationCap;
    tab: AdminTabId;
}> = [
    { key: 'universities', label: 'Trường đại học', icon: GraduationCap, tab: 'universities' },
    { key: 'majors', label: 'Ngành học', icon: ListChecks, tab: 'majors' },
    { key: 'cutoff_scores', label: 'Điểm chuẩn', icon: BarChart3, tab: 'cutoff-scores' },
    { key: 'users', label: 'Người dùng', icon: Users, tab: 'dashboard' },
];

export function DashboardPanel() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getAdminStats()
            .then(setStats)
            .catch((err) =>
                setError(
                    err instanceof ApiClientError
                        ? err.message
                        : 'Không tải được thống kê.',
                ),
            );
    }, []);

    return (
        <div className="space-y-6">
            <p className="text-sm text-slate-600">
                Tổng quan dữ liệu hệ thống (phạm vi Hà Nội, điểm chuẩn 2023–2025).
            </p>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {STAT_CARDS.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Link
                            key={card.key}
                            href={adminTabHref(card.tab)}
                            className="card group p-5 transition-shadow hover:shadow-md"
                        >
                            <div className="flex items-start justify-between">
                                <p className="text-sm text-slate-500">{card.label}</p>
                                <span className="rounded-lg bg-primary/10 p-2 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                                    <Icon className="size-4" aria-hidden />
                                </span>
                            </div>
                            <p className="mt-3 font-display text-3xl font-bold text-primary">
                                {stats
                                    ? stats[card.key].toLocaleString('vi-VN')
                                    : '—'}
                            </p>
                        </Link>
                    );
                })}
            </div>

            <div className="card p-5">
                <h2 className="font-display text-base font-semibold text-slate-900">
                    Quản lý nhanh
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                    Chọn mục bên trái hoặc bấm vào thẻ thống kê để chỉnh sửa dữ liệu.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                    {ADMIN_TABS.filter((t) => t.id !== 'dashboard').map((tab) => (
                        <Link
                            key={tab.id}
                            href={adminTabHref(tab.id)}
                            className="btn-outline text-xs sm:text-sm"
                        >
                            {tab.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
