'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AuthGate } from '@/components/AuthGate';
import { isAdminPath, isPublicPath } from '@/lib/routes';

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = isAdminPath(pathname);

    if (isAdmin) {
        return <main className="flex-1">{children}</main>;
    }

    const isLanding = pathname === '/';
    const isPublic = isPublicPath(pathname);

    return (
        <>
            <Navbar variant={isLanding ? 'landing' : isPublic ? 'minimal' : 'app'} />
            <main className="flex-1">
                <AuthGate>{children}</AuthGate>
            </main>
            <Footer variant={isLanding || isPublic ? 'public' : 'app'} />
        </>
    );
}
