'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useAuth } from '@/lib/auth';
import { useLocale } from '@/lib/i18n/locale';
import type { TranslationKey } from '@/lib/i18n/translations';
import { cn } from '@/lib/utils';

const navItems: { href: string; labelKey: TranslationKey; match: string }[] = [
    { href: '/home', labelKey: 'nav.home', match: '/home' },
    { href: '/universities', labelKey: 'nav.search', match: '/universities' },
    { href: '/majors', labelKey: 'nav.majors', match: '/majors' },
    { href: '/cutoff-scores', labelKey: 'nav.cutoff', match: '/cutoff-scores' },
    { href: '/chatbot', labelKey: 'nav.chatbot', match: '/chatbot' },
];

type NavbarVariant = 'landing' | 'minimal' | 'app';

export function Navbar({ variant = 'app' }: { variant?: NavbarVariant }) {
    const pathname = usePathname();
    const onUniversitySearch = pathname?.startsWith('/universities') ?? false;
    const onCutoffSearch = pathname?.startsWith('/cutoff-scores') ?? false;
    const showSearch = variant === 'app' && (onUniversitySearch || onCutoffSearch);
    const searchAction = onCutoffSearch ? '/cutoff-scores' : '/universities';

    const router = useRouter();
    const { user, loading, logout } = useAuth();
    const { t } = useLocale();

    function handleLogout() {
        logout();
        router.push('/');
    }

    const isLanding = variant === 'landing';
    const isMinimal = variant === 'minimal' || isLanding;
    const logoHref = user ? '/home' : '/';
    const switcherVariant = isLanding ? 'landing' : 'default';

    return (
        <header
            className={cn(
                'sticky top-0 z-50 backdrop-blur',
                isLanding
                    ? 'border-b border-white/10 bg-primary/90 text-white'
                    : 'border-b border-slate-200/80 bg-white/95',
            )}
        >
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
                <Link
                    href={logoHref}
                    className={cn(
                        'font-display text-xl font-bold tracking-tight',
                        isLanding ? 'text-white' : 'text-primary',
                    )}
                >
                    UniGuide AI
                </Link>

                {variant === 'app' && (
                    <nav className="hidden items-center gap-8 md:flex">
                        {navItems.map((item) => {
                            const isActive =
                                pathname === item.match ||
                                pathname?.startsWith(`${item.match}/`);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'text-sm font-medium transition-colors',
                                        isActive
                                            ? 'border-b-2 border-primary pb-0.5 text-primary'
                                            : 'text-slate-600 hover:text-primary',
                                    )}
                                >
                                    {t(item.labelKey)}
                                </Link>
                            );
                        })}
                    </nav>
                )}

                <div className="flex flex-1 items-center justify-end gap-3 md:flex-none">
                    {showSearch && (
                        <form
                            action={searchAction}
                            className="hidden max-w-xs flex-1 sm:flex"
                        >
                            <div className="relative w-full">
                                <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    name="search"
                                    placeholder={t('nav.searchPlaceholder')}
                                    className="input-search"
                                />
                            </div>
                        </form>
                    )}

                    {loading ? (
                        <span
                            className={cn(
                                'text-sm',
                                isLanding ? 'text-slate-300' : 'text-slate-400',
                            )}
                        >
                            …
                        </span>
                    ) : user ? (
                        <>
                            <Link
                                href="/profile"
                                className={cn(
                                    'hidden text-sm font-medium sm:inline',
                                    isLanding
                                        ? 'text-slate-200 hover:text-white'
                                        : 'text-slate-700 hover:text-primary',
                                )}
                            >
                                {user.name}
                            </Link>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className={cn(
                                    'text-sm',
                                    isLanding
                                        ? 'text-slate-300 hover:text-white'
                                        : 'text-slate-600 hover:text-danger',
                                )}
                            >
                                {t('nav.logout')}
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className={cn(
                                    'text-sm font-medium',
                                    isLanding
                                        ? 'text-slate-200 hover:text-white'
                                        : 'text-slate-700 hover:text-primary',
                                )}
                            >
                                {t('nav.login')}
                            </Link>
                            <Link
                                href="/register"
                                className={cn(isLanding ? 'btn-accent' : 'btn-primary')}
                            >
                                {t('nav.register')}
                            </Link>
                        </>
                    )}

                    <LanguageSwitcher variant={switcherVariant} />
                </div>
            </div>

            {variant === 'app' && (
                <nav className="flex gap-1 overflow-x-auto border-t border-slate-100 px-4 py-2 md:hidden">
                    {navItems.map((item) => {
                        const isActive =
                            pathname === item.match ||
                            pathname?.startsWith(`${item.match}/`);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium',
                                    isActive ? 'bg-primary text-white' : 'text-slate-600',
                                )}
                            >
                                {t(item.labelKey)}
                            </Link>
                        );
                    })}
                </nav>
            )}

            {isMinimal && !isLanding && (
                <div className="border-t border-slate-100 px-6 py-2 text-center md:hidden">
                    <Link href="/" className="text-xs text-slate-500 hover:text-primary">
                        {t('nav.backToLanding')}
                    </Link>
                </div>
            )}
        </header>
    );
}
