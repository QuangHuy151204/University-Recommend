/** Routes accessible without signing in. */
export const PUBLIC_PATH_PREFIXES = [
    '/login',
    '/register',
    '/verify-email',
    '/forgot-password',
    '/reset-password',
    '/admin/login',
] as const;

export function isAdminPath(pathname: string | null | undefined): boolean {
    if (!pathname) return false;
    return pathname === '/admin' || pathname.startsWith('/admin/');
}

export function isAdminLoginPath(pathname: string | null | undefined): boolean {
    if (!pathname) return false;
    return pathname === '/admin/login';
}

export function isPublicPath(pathname: string | null | undefined): boolean {
    if (!pathname) return false;
    if (pathname === '/') return true;
    return PUBLIC_PATH_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );
}

export function isAuthEntryPath(pathname: string | null | undefined): boolean {
    if (!pathname) return false;
    return (
        pathname === '/login' ||
        pathname === '/register' ||
        pathname.startsWith('/verify-email') ||
        pathname.startsWith('/forgot-password') ||
        pathname.startsWith('/reset-password')
    );
}
