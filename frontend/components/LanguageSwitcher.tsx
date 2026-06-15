'use client';

import { cn } from '@/lib/utils';
import { useLocale } from '@/lib/i18n/locale';
import type { Locale } from '@/lib/i18n/translations';

type LanguageSwitcherVariant = 'landing' | 'default';

function Segment({
    code,
    label,
    active,
    onClick,
    variant,
}: {
    code: Locale;
    label: string;
    active: boolean;
    onClick: () => void;
    variant: LanguageSwitcherVariant;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            aria-label={code === 'en' ? 'English' : 'Tiếng Việt'}
            className={cn(
                'min-w-[2.25rem] px-2.5 py-1 text-xs font-bold transition-colors',
                active
                    ? variant === 'landing'
                        ? 'bg-white text-primary'
                        : 'bg-[#9B2335] text-white'
                    : variant === 'landing'
                      ? 'bg-white/10 text-white/80 hover:bg-white/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
            )}
        >
            {label}
        </button>
    );
}

export function LanguageSwitcher({
    variant = 'default',
}: {
    variant?: LanguageSwitcherVariant;
}) {
    const { locale, setLocale } = useLocale();

    return (
        <div className="flex shrink-0 items-center gap-2">
            <span
                className={cn(
                    'hidden h-4 w-px sm:block',
                    variant === 'landing' ? 'bg-white/25' : 'bg-slate-300',
                )}
                aria-hidden
            />
            <div
                className={cn(
                    'flex overflow-hidden rounded-md',
                    variant === 'landing'
                        ? 'border border-white/20'
                        : 'border border-slate-200',
                )}
                role="group"
                aria-label="Language"
            >
                <Segment
                    code="en"
                    label="EN"
                    active={locale === 'en'}
                    onClick={() => setLocale('en')}
                    variant={variant}
                />
                <Segment
                    code="vi"
                    label="VI"
                    active={locale === 'vi'}
                    onClick={() => setLocale('vi')}
                    variant={variant}
                />
            </div>
        </div>
    );
}
