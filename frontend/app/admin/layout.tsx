'use client';

import { usePathname } from 'next/navigation';
import { AdminGate } from '@/components/admin/AdminGate';
import { AdminShell } from '@/components/admin/AdminShell';
import { isAdminLoginPath } from '@/lib/routes';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLogin = isAdminLoginPath(pathname);

    return (
        <AdminGate>
            {isLogin ? children : <AdminShell>{children}</AdminShell>}
        </AdminGate>
    );
}
