'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { isAdminLoginPath } from '@/lib/routes';

function AdminLoading() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100">
            <p className="text-sm text-slate-500">Đang kiểm tra quyền admin…</p>
        </div>
    );
}

export function AdminGate({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading } = useAuth();
    const isLogin = isAdminLoginPath(pathname);

    useEffect(() => {
        if (loading) return;
        if (isLogin) {
            if (user?.role === 'admin') {
                router.replace('/admin');
            }
            return;
        }
        if (!user) {
            router.replace(`/admin/login?redirect=${encodeURIComponent(pathname ?? '/admin')}`);
            return;
        }
        if (user.role !== 'admin') {
            router.replace('/home');
        }
    }, [loading, user, pathname, isLogin, router]);

    if (isLogin) {
        if (user?.role === 'admin') return <AdminLoading />;
        return <>{children}</>;
    }
    if (loading || !user || user.role !== 'admin') return <AdminLoading />;
    return <>{children}</>;
}
