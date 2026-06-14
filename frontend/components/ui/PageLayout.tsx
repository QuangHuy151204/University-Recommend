import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PageShell({
    children,
    className,
    maxWidth = 'max-w-5xl',
}: {
    children: React.ReactNode;
    className?: string;
    maxWidth?: 'max-w-2xl' | 'max-w-3xl' | 'max-w-5xl' | 'max-w-6xl';
}) {
    return (
        <div className={cn('bg-neutral pb-16', className)}>
            <div className={cn('mx-auto px-6 py-10', maxWidth)}>{children}</div>
        </div>
    );
}

export function BackLink({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-tertiary transition-colors hover:text-primary"
        >
            <ArrowLeft className="size-4 shrink-0" aria-hidden />
            {label}
        </Link>
    );
}

export function PageHeader({
    eyebrow,
    title,
    subtitle,
    action,
}: {
    eyebrow?: string;
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
                {eyebrow && (
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {eyebrow}
                    </p>
                )}
                <h1 className="font-display text-2xl font-bold text-primary sm:text-3xl">
                    {title}
                </h1>
                {subtitle && (
                    <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
                )}
            </div>
            {action}
        </div>
    );
}

export function AlertBox({
    variant,
    children,
    className,
}: {
    variant: 'error' | 'success' | 'warning';
    children: React.ReactNode;
    className?: string;
}) {
    const styles = {
        error: 'border-red-200 bg-red-50 text-red-700',
        success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
        warning: 'border-amber-200 bg-amber-50 text-amber-800',
    }[variant];

    return (
        <div
            className={cn(
                'rounded-xl border px-4 py-3 text-sm',
                styles,
                className,
            )}
            role="alert"
        >
            {children}
        </div>
    );
}
