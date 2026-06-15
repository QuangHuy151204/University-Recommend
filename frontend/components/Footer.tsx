'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/i18n/locale';

type FooterVariant = 'public' | 'app';

export function Footer({ variant = 'app' }: { variant?: FooterVariant }) {
    const { t } = useLocale();
    const isPublic = variant === 'public';

    return (
        <footer className="mt-auto bg-primary-dark text-white">
            <div className="mx-auto max-w-7xl px-6 py-12">
                <div className="grid gap-10 md:grid-cols-4">
                    <div>
                        <p className="font-display text-xl font-bold">UniGuide AI</p>
                        <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-300">
                            {t('footer.tagline')}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold tracking-wider text-secondary">
                            {isPublic ? t('footer.start') : t('footer.explore')}
                        </p>
                        <ul className="mt-3 space-y-2 text-sm text-slate-300">
                            {isPublic ? (
                                <>
                                    <li>
                                        <Link href="/register" className="hover:text-white">
                                            {t('footer.register')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/login" className="hover:text-white">
                                            {t('nav.login')}
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link href="/universities" className="hover:text-white">
                                            {t('footer.searchUnis')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/majors" className="hover:text-white">
                                            {t('footer.exploreMajors')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/cutoff-scores" className="hover:text-white">
                                            {t('footer.cutoff')}
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                    <div>
                        <p className="text-xs font-semibold tracking-wider text-secondary">
                            {t('footer.support')}
                        </p>
                        <ul className="mt-3 space-y-2 text-sm text-slate-300">
                            <li>{t('footer.scope')}</li>
                            <li>{t('footer.cutoffYears')}</li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-xs font-semibold tracking-wider text-secondary">
                            {t('footer.features')}
                        </p>
                        <ul className="mt-3 space-y-2 text-sm text-slate-300">
                            <li>{t('footer.featureSearch')}</li>
                            <li>{t('footer.featureCutoff')}</li>
                            <li>{t('footer.featureChatbot')}</li>
                            <li>{t('footer.featureCompare')}</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-slate-400">
                    {t('footer.copyright', { year: new Date().getFullYear() })}
                </div>
            </div>
        </footer>
    );
}
