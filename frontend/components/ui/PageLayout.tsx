import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const backControlClassName =
    'inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm transition-colors hover:bg-primary-dark';

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

export function BackLink({
    href,
    label,
    className,
}: {
    href: string;
    /** Nhãn cho screen reader / tooltip — không hiển thị trên UI. */
    label: string;
    className?: string;
}) {
    return (
        <Link
            href={href}
            aria-label={label}
            title={label}
            className={cn(backControlClassName, className)}
        >
            <ArrowLeft className="size-4 shrink-0" aria-hidden />
        </Link>
    );
}

export function BackButton({
    onClick,
    label,
    className,
}: {
    onClick: () => void;
    label: string;
    className?: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            title={label}
            className={cn(backControlClassName, className)}
        >
            <ArrowLeft className="size-4 shrink-0" aria-hidden />
        </button>
    );
}

export function PageSearchBar({
    action,
    placeholder = 'Tìm kiếm...',
    defaultValue,
    hiddenFields,
    className,
    submitLabel = 'Tìm',
}: {
    action: string;
    placeholder?: string;
    defaultValue?: string;
    hiddenFields?: Record<string, string>;
    className?: string;
    submitLabel?: string;
}) {
    return (
        <form
            className={cn('flex min-w-0 gap-2', className)}
            action={action}
        >
            {hiddenFields &&
                Object.entries(hiddenFields).map(([name, value]) => (
                    <input key={name} type="hidden" name={name} value={value} />
                ))}
            <div className="relative min-w-0 flex-1">
                <Search
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                    aria-hidden
                />
                <input
                    name="search"
                    type="search"
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                    className="input-field !w-full !pl-10"
                />
            </div>
            <button type="submit" className="btn-primary shrink-0">
                {submitLabel}
            </button>
        </form>
    );
}

export function SubpageToolbar({
    backHref,
    backLabel,
    search,
    className,
}: {
    backHref: string;
    backLabel: string;
    search?: {
        action: string;
        placeholder?: string;
        defaultValue?: string;
        hiddenFields?: Record<string, string>;
    };
    className?: string;
}) {
    return (
        <div
            className={cn(
                'mb-5 flex flex-wrap items-center justify-between gap-3',
                className,
            )}
        >
            <BackLink href={backHref} label={backLabel} />
            {search && (
                <PageSearchBar
                    action={search.action}
                    placeholder={search.placeholder}
                    defaultValue={search.defaultValue}
                    hiddenFields={search.hiddenFields}
                    className="w-full sm:ml-auto sm:w-auto sm:max-w-sm"
                />
            )}
        </div>
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
