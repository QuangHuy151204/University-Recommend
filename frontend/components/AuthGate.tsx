'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { isPublicPath } from '@/lib/routes';

function AuthLoading() {
    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-6">
            <div
                className="size-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary"
                aria-hidden
            />
            <p className="text-sm text-slate-500">Đang kiểm tra phiên đăng nhập…</p>
        </div>
    );
}

export function AuthGate({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading } = useAuth();
    const isPublic = isPublicPath(pathname);

    useEffect(() => {
        if (loading) return;

        if (user?.role === 'admin') {
            router.replace('/admin');
            return;
        }

        if (user && pathname === '/') {
            router.replace('/home');
            return;
        }
        if (!isPublic && !user) {
            const redirect = pathname && pathname !== '/' ? pathname : '/home';
            router.replace(`/login?redirect=${encodeURIComponent(redirect)}`);
        }
    }, [loading, user, pathname, isPublic, router]);

    if (user?.role === 'admin') {
        return <AuthLoading />;
    }

    if (isPublic) {
        return <>{children}</>;
    }

    if (loading || !user) {
        return <AuthLoading />;
    }

    return <>{children}</>;
}
