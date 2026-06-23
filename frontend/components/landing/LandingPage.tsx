'use client';

import Link from 'next/link';
import {
    BarChart3,
    Bot,
    GraduationCap,
    MapPin,
    ShieldCheck,
    Sparkles,
    Target,
    Wallet,
} from 'lucide-react';
import { useLocale } from '@/lib/i18n/locale';
import type { TranslationKey } from '@/lib/i18n/translations';

const FEATURE_KEYS: {
    icon: typeof GraduationCap;
    titleKey: TranslationKey;
    descKey: TranslationKey;
    accent: string;
    bg: string;
}[] = [
    {
        icon: GraduationCap,
        titleKey: 'landing.feature1Title',
        descKey: 'landing.feature1Desc',
        accent: 'text-primary',
        bg: 'bg-primary/8',
    },
    {
        icon: Target,
        titleKey: 'landing.feature2Title',
        descKey: 'landing.feature2Desc',
        accent: 'text-secondary-dark',
        bg: 'bg-secondary/15',
    },
    {
        icon: Bot,
        titleKey: 'landing.feature3Title',
        descKey: 'landing.feature3Desc',
        accent: 'text-tertiary',
        bg: 'bg-tertiary/10',
    },
    {
        icon: Wallet,
        titleKey: 'landing.feature4Title',
        descKey: 'landing.feature4Desc',
        accent: 'text-primary',
        bg: 'bg-primary/8',
    },
];

const STEP_KEYS: {
    step: string;
    titleKey: TranslationKey;
    textKey: TranslationKey;
}[] = [
    {
        step: '01',
        titleKey: 'landing.step1Title',
        textKey: 'landing.step1Text',
    },
    {
        step: '02',
        titleKey: 'landing.step2Title',
        textKey: 'landing.step2Text',
    },
    {
        step: '03',
        titleKey: 'landing.step3Title',
        textKey: 'landing.step3Text',
    },
];

export function LandingPage() {
    const { t } = useLocale();

    return (
        <div className="overflow-hidden">
            <section className="relative min-h-[88vh] bg-primary">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-25"
                    style={{
                        backgroundImage:
                            'url(https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80)',
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/92 to-[#0d1547]" />
                <div
                    className="pointer-events-none absolute -left-32 top-20 size-96 rounded-full bg-secondary/20 blur-3xl"
                    aria-hidden
                />
                <div
                    className="pointer-events-none absolute -right-24 bottom-10 size-80 rounded-full bg-tertiary/25 blur-3xl"
                    aria-hidden
                />

                <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 pb-24 pt-16 text-center sm:pt-24">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-slate-100 backdrop-blur">
                        <MapPin className="size-3.5 text-secondary" />
                        {t('landing.badge')}
                    </span>
                    <h1 className="font-display mt-8 max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl">
                        {t('landing.heroTitle')}{' '}
                        <span className="text-secondary">{t('landing.heroHighlight')}</span>
                    </h1>
                    <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
                        {t('landing.heroSubtitle')}
                    </p>
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                        <Link
                            href="/register"
                            className="btn-accent px-8 py-3 text-base shadow-lg shadow-secondary/30"
                        >
                            {t('landing.ctaRegister')}
                        </Link>
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-8 py-3 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
                        >
                            {t('landing.ctaLogin')}
                        </Link>
                    </div>
                    <ul className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-slate-300">
                        <li className="flex items-center gap-2">
                            <ShieldCheck className="size-4 text-secondary" />
                            {t('landing.trustCutoff')}
                        </li>
                        <li className="flex items-center gap-2">
                            <BarChart3 className="size-4 text-secondary" />
                            {t('landing.trustSchools')}
                        </li>
                        <li className="flex items-center gap-2">
                            <Sparkles className="size-4 text-secondary" />
                            {t('landing.trustChatbot')}
                        </li>
                    </ul>
                </div>
            </section>

            <section className="border-b border-slate-200/80 bg-white py-20">
                <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-secondary-dark">
                            {t('landing.aboutEyebrow')}
                        </p>
                        <h2 className="font-display mt-3 text-3xl font-bold text-primary sm:text-4xl">
                            {t('landing.aboutTitle')}
                        </h2>
                        <p className="mt-4 text-base leading-relaxed text-slate-600">
                            {t('landing.aboutP1')}
                        </p>
                        <p className="mt-4 text-base leading-relaxed text-slate-600">
                            {t('landing.aboutP2')}
                        </p>
                    </div>
                    <div className="relative">
                        <div className="card relative z-10 overflow-hidden p-8">
                            <div className="absolute -right-6 -top-6 size-32 rounded-full bg-secondary/20 blur-2xl" />
                            <h3 className="font-display relative text-xl font-bold text-primary">
                                {t('landing.aboutCardTitle')}
                            </h3>
                            <ul className="relative mt-6 space-y-4 text-sm text-slate-700">
                                {(
                                    [
                                        'landing.aboutBullet1',
                                        'landing.aboutBullet2',
                                        'landing.aboutBullet3',
                                        'landing.aboutBullet4',
                                    ] as const
                                ).map((key) => (
                                    <li key={key} className="flex gap-3">
                                        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                                            ✓
                                        </span>
                                        {t(key)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div
                            className="absolute -bottom-4 -left-4 -z-0 h-full w-full rounded-2xl bg-gradient-to-br from-secondary/30 to-tertiary/20"
                            aria-hidden
                        />
                    </div>
                </div>
            </section>

            <section className="bg-neutral py-20">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="text-center">
                        <p className="text-xs font-bold uppercase tracking-widest text-tertiary">
                            {t('landing.featuresEyebrow')}
                        </p>
                        <h2 className="font-display mt-3 text-3xl font-bold text-primary">
                            {t('landing.featuresTitle')}
                        </h2>
                    </div>
                    <div className="mt-12 grid gap-6 sm:grid-cols-2">
                        {FEATURE_KEYS.map((f) => (
                            <article
                                key={f.titleKey}
                                className="card flex gap-5 p-6 transition-shadow hover:shadow-md"
                            >
                                <div
                                    className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${f.bg}`}
                                >
                                    <f.icon className={`size-6 ${f.accent}`} />
                                </div>
                                <div>
                                    <h3 className="font-display font-bold text-primary">
                                        {t(f.titleKey)}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                        {t(f.descKey)}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="border-t border-slate-200 bg-white py-20">
                <div className="mx-auto max-w-6xl px-6">
                    <h2 className="font-display text-center text-3xl font-bold text-primary">
                        {t('landing.stepsTitle')}
                    </h2>
                    <div className="mt-14 grid gap-8 md:grid-cols-3">
                        {STEP_KEYS.map((s) => (
                            <div key={s.step} className="relative text-center">
                                <span className="font-display text-5xl font-bold text-primary/10">
                                    {s.step}
                                </span>
                                <h3 className="font-display -mt-6 text-lg font-bold text-primary">
                                    {t(s.titleKey)}
                                </h3>
                                <p className="mx-auto mt-3 max-w-xs text-sm text-slate-600">
                                    {t(s.textKey)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative overflow-hidden bg-primary py-20">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-light opacity-90" />
                <div className="relative mx-auto max-w-3xl px-6 text-center">
                    <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
                        {t('landing.ctaTitle')}
                    </h2>
                    <p className="mt-4 text-slate-200">{t('landing.ctaSubtitle')}</p>
                    <div className="mt-10 flex flex-wrap justify-center gap-4">
                        <Link href="/register" className="btn-accent px-8 py-3 text-base">
                            {t('landing.ctaCreate')}
                        </Link>
                        <Link href="/login" className="btn-secondary px-8 py-3 text-base">
                            {t('landing.ctaHaveAccount')}
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
