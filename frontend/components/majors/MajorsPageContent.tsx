'use client';

import Link from 'next/link';
import type { Major, MajorGroupSummary, Paginated } from '@/types';
import MajorGroupGrid from '@/components/majors/MajorGroupGrid';
import MajorListGrid from '@/components/majors/MajorListGrid';
import { PageSearchBar } from '@/components/ui/PageLayout';
import { useLocale } from '@/lib/i18n/locale';

function buildMajorsPageHref(search: string | undefined, p: number) {
    const q = new URLSearchParams();
    if (search) q.set('search', search);
    if (p > 1) q.set('page', String(p));
    const qs = q.toString();
    return qs ? `/majors?${qs}` : '/majors';
}

type Props = {
    search?: string;
    page: number;
    errorMessage: string | null;
    groups: MajorGroupSummary[];
    totalMajors: number;
    searchResult: Paginated<Major> | null;
    searchMajors: Major[];
};

export function MajorsPageContent({
    search,
    page,
    errorMessage,
    groups,
    totalMajors,
    searchResult,
    searchMajors,
}: Props) {
    const { t } = useLocale();

    return (
        <div className="bg-neutral pb-16">
            <div className="mx-auto max-w-6xl px-6 py-10">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="font-display text-2xl font-bold text-primary">
                            Major Discovery
                        </h1>
                        <p className="mt-1 text-sm text-slate-600">
                            {t('majors.subtitle')}
                        </p>
                    </div>

                    <PageSearchBar
                        action="/majors"
                        placeholder={t('majors.searchPlaceholder')}
                        defaultValue={search}
                        className="sm:max-w-sm"
                    />
                </div>

                {errorMessage && (
                    <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {errorMessage}
                    </div>
                )}

                {!errorMessage && search && searchMajors.length === 0 && (
                    <div className="card mt-8 p-8 text-center text-sm text-slate-600">
                        {t('majors.noResults', { search })}
                    </div>
                )}

                {!errorMessage && search && searchResult && searchMajors.length > 0 && (
                    <>
                        <p className="mb-4 mt-6 text-xs text-slate-500">
                            {t('majors.resultCount', {
                                total: searchResult.total,
                                page: searchResult.page,
                                totalPages: searchResult.totalPages,
                            })}
                        </p>

                        <MajorListGrid majors={searchMajors} />

                        {searchResult.totalPages > 1 && (
                            <nav className="mt-8 flex justify-center gap-2">
                                {page > 1 && (
                                    <Link
                                        href={buildMajorsPageHref(search, page - 1)}
                                        className="btn-secondary"
                                    >
                                        {t('common.prev')}
                                    </Link>
                                )}
                                <span className="flex items-center text-sm text-slate-600">
                                    {page} / {searchResult.totalPages}
                                </span>
                                {page < searchResult.totalPages && (
                                    <Link
                                        href={buildMajorsPageHref(search, page + 1)}
                                        className="btn-secondary"
                                    >
                                        {t('common.next')}
                                    </Link>
                                )}
                            </nav>
                        )}
                    </>
                )}

                {!errorMessage && !search && groups.length > 0 && (
                    <MajorGroupGrid groups={groups} totalMajors={totalMajors} />
                )}
            </div>
        </div>
    );
}
