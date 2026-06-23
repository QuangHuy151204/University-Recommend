'use client';

import Link from 'next/link';
import {
    BarChart3,
    GraduationCap,
    ListChecks,
    MessageCircle,
    Search,
    Sparkles,
} from 'lucide-react';
import type { University } from '@/types';
import { useLocale } from '@/lib/i18n/locale';
import { formatTuitionVnd } from '@/lib/utils';
import { FeaturedMajorGroups } from '@/components/home/FeaturedMajorGroups';

export function HomeDashboard({ featured }: { featured: University[] }) {
    const { t } = useLocale();

    return (
        <div className="space-y-16 sm:space-y-20">
            <section className="relative overflow-hidden bg-primary">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('/home-hero-bg.png')",
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/85 to-primary/75" />
                <div className="relative mx-auto max-w-4xl px-6 py-20 text-center sm:px-8 sm:py-28">
                    <h1 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
                        {t('home.heroTitle')}
                    </h1>
                    <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-200 sm:mt-6 sm:text-lg">
                        {t('home.heroSubtitle')}
                    </p>
                    <form
                        action="/universities"
                        className="mx-auto mt-10 flex max-w-xl overflow-hidden rounded-full bg-white p-1.5 shadow-xl sm:mt-12"
                    >
                        <div className="relative flex flex-1 items-center">
                            <Search className="absolute left-4 size-5 text-slate-400" />
                            <input
                                name="search"
                                placeholder={t('home.searchPlaceholder')}
                                className="w-full rounded-full border-0 bg-transparent py-3 pl-12 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                            />
                        </div>
                        <button type="submit" className="btn-primary !rounded-full shrink-0">
                            {t('home.searchNow')}
                        </button>
                    </form>
                </div>
            </section>

            <section className="mx-auto grid max-w-6xl gap-6 px-6 sm:grid-cols-3 sm:gap-8 sm:px-8">
                <Link
                    href="/cutoff-scores"
                    className="card group bg-secondary/15 p-7 transition-shadow hover:shadow-md sm:p-8"
                >
                    <BarChart3 className="size-8 text-secondary-dark" />
                    <h2 className="font-display mt-5 text-lg font-bold text-primary">
                        {t('home.cutoffTitle')}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        {t('home.cutoffDesc')}
                    </p>
                    <span className="mt-5 inline-block text-sm font-semibold text-secondary-dark group-hover:underline">
                        {t('home.cutoffLink')}
                    </span>
                </Link>
                <Link href="/universities" className="card p-7 transition-shadow hover:shadow-md sm:p-8">
                    <GraduationCap className="size-8 text-primary" />
                    <h2 className="font-display mt-5 text-lg font-bold text-primary">
                        {t('home.unisTitle')}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        {t('home.unisDesc')}
                    </p>
                </Link>
                <Link href="/majors" className="card p-7 transition-shadow hover:shadow-md sm:p-8">
                    <ListChecks className="size-8 text-tertiary" />
                    <h2 className="font-display mt-5 text-lg font-bold text-primary">
                        {t('home.majorsTitle')}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        {t('home.majorsDesc')}
                    </p>
                </Link>
            </section>

            <section className="mx-auto max-w-6xl px-6 sm:px-8">
                <div className="flex flex-col gap-8 rounded-2xl bg-primary px-8 py-12 sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:px-10 sm:py-14">
                    <div className="max-w-lg">
                        <h2 className="font-display text-xl font-bold text-white sm:text-2xl">
                            {t('home.bannerTitle')}
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                            {t('home.bannerDesc')}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-4 sm:shrink-0">
                        <Link href="/recommend" className="btn-accent">
                            {t('home.recommend')}
                        </Link>
                        <Link href="/universities" className="btn-secondary">
                            {t('home.viewScores')}
                        </Link>
                        <Link
                            href="/chatbot"
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/20"
                            title={t('home.aiAdvisor')}
                        >
                            <MessageCircle className="size-5" />
                            {t('home.aiAdvisor')}
                        </Link>
                    </div>
                </div>
            </section>

            {featured.length > 0 && (
                <section className="mx-auto max-w-6xl px-6 sm:px-8">
                    <div className="mb-8 flex items-center justify-between sm:mb-10">
                        <h2 className="font-display text-2xl font-bold text-primary">
                            {t('home.featuredTitle')}
                        </h2>
                        <Link
                            href="/universities"
                            className="text-sm font-semibold text-tertiary hover:underline"
                        >
                            {t('home.viewAll')}
                        </Link>
                    </div>
                    <div className="grid gap-8 sm:grid-cols-3">
                        {featured.map((u) => (
                            <article key={u.id} className="card overflow-hidden">
                                <div className="relative h-40 bg-gradient-to-br from-primary/20 to-secondary/20">
                                    <span className="badge-mint absolute right-3 top-3">
                                        {t('home.hanoi')}
                                    </span>
                                </div>
                                <div className="p-6">
                                    <h3 className="font-display font-bold text-primary">
                                        {u.short_name || u.name}
                                    </h3>
                                    <p className="mt-2 text-xs text-slate-500">
                                        {u.location ?? t('home.hanoiCountry')}
                                    </p>
                                    <p className="mt-3 text-xs text-slate-600">
                                        {formatTuitionVnd(
                                            u.tuition_fee_min,
                                            u.tuition_fee_max,
                                        )}
                                    </p>
                                    <Link
                                        href={`/universities/${u.id}`}
                                        className="btn-outline mt-5 w-full text-center"
                                    >
                                        {t('home.schoolDetail')}
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            <FeaturedMajorGroups />

            <section className="border-t border-slate-200 bg-white py-14 sm:py-16">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-5 px-6 text-center sm:flex-row sm:gap-8 sm:px-8">
                    <Sparkles className="size-6 shrink-0 text-secondary" />
                    <p className="max-w-xl text-sm leading-relaxed text-slate-600">
                        {t('home.chatbotTeaser')}
                    </p>
                    <Link href="/chatbot" className="btn-primary shrink-0">
                        {t('home.chatbotCta')}
                    </Link>
                </div>
            </section>
        </div>
    );
}
