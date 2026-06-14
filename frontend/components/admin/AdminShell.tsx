'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { LayoutDashboard, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import {
    ADMIN_TABS,
    adminTabHref,
    adminTabTitle,
    resolveAdminTab,
} from '@/lib/admin-tabs';
import { cn } from '@/lib/utils';

function AdminShellInner({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, logout } = useAuth();
    const activeTab = resolveAdminTab(pathname, searchParams.get('tab'));

    function handleLogout() {
        logout();
        router.push('/admin/login');
    }

    return (
        <div className="flex min-h-screen bg-slate-100">
            <aside className="flex w-60 shrink-0 flex-col bg-primary text-white">
                <div className="border-b border-white/10 px-5 py-6">
                    <div className="flex items-center gap-2">
                        <Shield className="size-5 text-secondary" aria-hidden />
                        <p className="font-display text-sm font-bold tracking-tight">
                            UniGuide Admin
                        </p>
                    </div>
                    <p className="mt-2 truncate text-xs text-slate-300">
                        {user?.name ?? 'Admin'}
                    </p>
                </div>

                <nav className="flex flex-1 flex-col gap-1 p-3">
                    {ADMIN_TABS.map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <Link
                                key={item.id}
                                href={adminTabHref(item.id)}
                                className={cn(
                                    'flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-white/15 text-white'
                                        : 'text-slate-200 hover:bg-white/10 hover:text-white',
                                )}
                            >
                                {item.id === 'dashboard' && (
                                    <LayoutDashboard className="size-4 shrink-0" aria-hidden />
                                )}
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t border-white/10 p-3">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-200 transition-colors hover:bg-red-500/20"
                    >
                        <LogOut className="size-4" aria-hidden />
                        Đăng xuất
                    </button>
                </div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="border-b border-slate-200 bg-white px-6 py-5">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Bảng điều khiển
                    </p>
                    <h1 className="font-display text-xl font-semibold text-slate-900">
                        {adminTabTitle(activeTab)}
                    </h1>
                </header>
                <div className="flex-1 overflow-auto p-6">{children}</div>
            </div>
        </div>
    );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-slate-100">
                    <p className="text-sm text-slate-500">Đang tải…</p>
                </div>
            }
        >
            <AdminShellInner>{children}</AdminShellInner>
        </Suspense>
    );
}
