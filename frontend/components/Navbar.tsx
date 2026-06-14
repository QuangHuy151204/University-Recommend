'use client';



import Link from 'next/link';

import { usePathname, useRouter } from 'next/navigation';

import { Search } from 'lucide-react';

import { useAuth } from '@/lib/auth';

import { cn } from '@/lib/utils';



const navItems = [

    { href: '/home', label: 'Trang chủ', match: '/home' },

    { href: '/universities', label: 'Tra cứu', match: '/universities' },

    { href: '/majors', label: 'Ngành', match: '/majors' },

    { href: '/cutoff-scores', label: 'Điểm chuẩn', match: '/cutoff-scores' },

    { href: '/chatbot', label: 'Tư vấn AI', match: '/chatbot' },

];



type NavbarVariant = 'landing' | 'minimal' | 'app';



export function Navbar({ variant = 'app' }: { variant?: NavbarVariant }) {

    const pathname = usePathname();

    const onUniversitySearch =
        pathname?.startsWith('/universities') ?? false;
    const onCutoffSearch = pathname?.startsWith('/cutoff-scores') ?? false;
    const showSearch = variant === 'app' && (onUniversitySearch || onCutoffSearch);
    const searchAction = onCutoffSearch ? '/cutoff-scores' : '/universities';

    const router = useRouter();

    const { user, loading, logout } = useAuth();



    function handleLogout() {

        logout();

        router.push('/');

    }



    const isLanding = variant === 'landing';

    const isMinimal = variant === 'minimal' || isLanding;

    const logoHref = user ? '/home' : '/';



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

                                    {item.label}

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

                                    placeholder="Tìm kiếm trường..."

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

                                Đăng xuất

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

                                Đăng nhập

                            </Link>

                            <Link

                                href="/register"

                                className={cn(

                                    isLanding ? 'btn-accent' : 'btn-primary',

                                )}

                            >

                                Đăng ký

                            </Link>

                        </>

                    )}

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

                                {item.label}

                            </Link>

                        );

                    })}

                </nav>

            )}



            {isMinimal && !isLanding && (

                <div className="border-t border-slate-100 px-6 py-2 text-center md:hidden">

                    <Link href="/" className="text-xs text-slate-500 hover:text-primary">

                        ← Về trang giới thiệu

                    </Link>

                </div>

            )}

        </header>

    );

}

