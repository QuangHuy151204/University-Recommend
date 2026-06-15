'use client';

import Link from 'next/link';
import {
    BookOpen,
    Brain,
    Cpu,
    Factory,
    Globe,
    GraduationCap,
    HeartPulse,
    Landmark,
    Leaf,
    Megaphone,
    Microchip,
    Plane,
    Sparkles,
    Truck,
    type LucideIcon,
} from 'lucide-react';
import {
    FEATURED_MAJOR_GROUPS,
    getFeaturedMajorGroupCopy,
} from '@/lib/featured-major-groups';
import { useLocale } from '@/lib/i18n/locale';

const GROUP_ICONS: Record<string, LucideIcon> = {
    it: Cpu,
    'ai-data': Brain,
    semiconductor: Microchip,
    engineering: Factory,
    logistics: Truck,
    'digital-economy': Megaphone,
    finance: Landmark,
    healthcare: HeartPulse,
    'green-energy': Leaf,
    languages: Globe,
    tourism: Plane,
    education: BookOpen,
};

const ACCENT_STYLES = {
    primary: {
        icon: 'text-primary',
        badge: 'bg-primary/10 text-primary',
        ring: 'group-hover:border-primary/30',
    },
    secondary: {
        icon: 'text-secondary-dark',
        badge: 'bg-secondary/15 text-secondary-dark',
        ring: 'group-hover:border-secondary/40',
    },
    tertiary: {
        icon: 'text-tertiary',
        badge: 'bg-tertiary/10 text-tertiary',
        ring: 'group-hover:border-tertiary/30',
    },
} as const;

export function FeaturedMajorGroups() {
    const { locale, t } = useLocale();

    return (
        <section className="border-t border-slate-200 bg-neutral py-14 sm:py-16">
            <div className="mx-auto max-w-6xl px-6 sm:px-8">
                <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-2xl">
                        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary-dark">
                            <Sparkles className="size-3.5" />
                            {t('home.featuredMajorsEyebrow')}
                        </p>
                        <h2 className="font-display mt-2 text-2xl font-bold text-primary sm:text-3xl">
                            {t('home.featuredMajorsTitle')}
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                            {t('home.featuredMajorsSubtitle')}
                        </p>
                    </div>
                    <Link
                        href="/majors"
                        className="shrink-0 text-sm font-semibold text-tertiary hover:underline"
                    >
                        {t('home.featuredMajorsViewAll')}
                    </Link>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {FEATURED_MAJOR_GROUPS.map((group, index) => {
                        const copy = getFeaturedMajorGroupCopy(group, locale);
                        const Icon = GROUP_ICONS[group.id] ?? GraduationCap;
                        const styles = ACCENT_STYLES[group.accent];
                        const searchHref = `/majors?search=${encodeURIComponent(group.searchTerm)}`;

                        return (
                            <article
                                key={group.id}
                                className={`card group flex h-full flex-col p-5 transition-shadow hover:shadow-md sm:p-6 ${styles.ring}`}
                            >
                                <div className="flex items-start gap-3">
                                    <span
                                        className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${styles.badge}`}
                                    >
                                        <Icon className={`size-5 ${styles.icon}`} />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                            #{index + 1}
                                        </span>
                                        <h3 className="font-display mt-0.5 text-base font-bold leading-snug text-primary">
                                            {copy.title}
                                        </h3>
                                    </div>
                                </div>

                                <p className="mt-4 text-xs font-medium text-slate-500">
                                    {t('home.featuredMajorsSample')}
                                </p>
                                <p className="mt-1 text-sm leading-relaxed text-slate-700">
                                    {copy.majors}
                                </p>

                                <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">
                                    {copy.highlight}
                                </p>

                                <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                                    <Link
                                        href={searchHref}
                                        className="btn-outline !px-3 !py-1.5 !text-xs"
                                    >
                                        {t('home.featuredMajorsBrowse')}
                                    </Link>
                                    <Link
                                        href="/recommend"
                                        className="inline-flex items-center justify-center rounded-xl px-3 py-1.5 text-xs font-semibold text-tertiary transition-colors hover:bg-tertiary/10"
                                    >
                                        {t('home.featuredMajorsSuggest')}
                                    </Link>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
