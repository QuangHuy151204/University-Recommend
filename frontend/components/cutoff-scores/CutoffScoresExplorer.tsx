'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Building2, Search, BarChart3 } from 'lucide-react';
import { BackButton } from '@/components/ui/PageLayout';
import { CutoffMethodFilter } from '@/components/CutoffMethodFilter';
import type {
    AdmissionMethod,
    CutoffScore,
    Paginated,
    University,
    UniversityDetail,
} from '@/types';
import { useLocale } from '@/lib/i18n/locale';

const CUTOFF_YEARS = [2023, 2024, 2025] as const;

interface Props {
    search?: string;
    university: UniversityDetail | null;
    searchResults: Paginated<University> | null;
    methods: AdmissionMethod[];
    loadError: string | null;
}

function filterCutoffsByYear(cutoffs: CutoffScore[]): CutoffScore[] {
    return cutoffs.filter((c) =>
        (CUTOFF_YEARS as readonly number[]).includes(c.year),
    );
}

export function CutoffScoresExplorer({
    search,
    university,
    searchResults,
    methods,
    loadError,
}: Props) {
    const router = useRouter();
    const { t } = useLocale();
    const [query, setQuery] = useState(search ?? '');

    function buildHref(next: { search?: string; university?: number }) {
        const q = new URLSearchParams();
        if (next.search?.trim()) q.set('search', next.search.trim());
        if (next.university != null) q.set('university', String(next.university));
        const qs = q.toString();
        return qs ? `/cutoff-scores?${qs}` : '/cutoff-scores';
    }

    function submitSearch(e: React.FormEvent) {
        e.preventDefault();
        router.push(buildHref({ search: query }));
    }

    function selectUniversity(id: number) {
        router.push(buildHref({ university: id }));
    }

    function clearUniversity() {
        router.push(buildHref({ search: query || search }));
    }

    const programs =
        university?.universityMajors?.map((p) => ({
            programId: p.id,
            majorName: p.major.name,
            majorLinkId: p.major.id,
            majorCode: p.major.code,
            fieldGroup: p.major.field_group,
            trainingProgram: p.training_program,
            duration: p.duration,
            tuitionFee: p.tuition_fee,
            cutoffs: filterCutoffsByYear((p.cutoffScores ?? []) as CutoffScore[]),
        })) ?? [];

    const hasCutoffData = programs.some((p) => p.cutoffs.length > 0);

    return (
        <div className="bg-neutral pb-16">
            <div className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-4xl px-6 py-10 text-center">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <BarChart3 className="size-6" aria-hidden />
                    </div>
                    <h1 className="font-display mt-4 text-2xl font-bold text-primary sm:text-3xl">
                        {t('cutoff.title')}
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">
                        {t('cutoff.subtitle')}
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-6 py-8">
                <form onSubmit={submitSearch} className="card p-5 sm:p-6">
                    <label
                        htmlFor="cutoff-university-search"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        {t('cutoff.schoolLabel')}
                    </label>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="relative flex-1">
                            <Search
                                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                                aria-hidden
                            />
                            <input
                                id="cutoff-university-search"
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={t('cutoff.searchPlaceholder')}
                                autoComplete="off"
                                className="input-field !pl-10"
                            />
                        </div>
                        <button type="submit" className="btn-primary shrink-0">
                            {t('cutoff.searchButton')}
                        </button>
                    </div>
                    <p className="mt-3 text-xs text-slate-500">
                        {t('cutoff.dataNote', {
                            years: CUTOFF_YEARS.join(', '),
                        })}
                    </p>
                </form>

                {loadError && (
                    <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {loadError}
                    </div>
                )}

                {!university && searchResults && searchResults.data.length > 0 && (
                    <section className="mt-6">
                        <h2 className="text-sm font-semibold text-slate-700">
                            {t('cutoff.resultsTitle', {
                                count: searchResults.total,
                            })}
                        </h2>
                        <ul className="mt-3 space-y-2">
                            {searchResults.data.map((u) => (
                                <li key={u.id}>
                                    <button
                                        type="button"
                                        onClick={() => selectUniversity(u.id)}
                                        className="card flex w-full items-center gap-3 p-4 text-left transition-shadow hover:shadow-md"
                                    >
                                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                            {(u.short_name ?? u.name)
                                                .slice(0, 2)
                                                .toUpperCase()}
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block font-display font-bold text-primary">
                                                {u.name}
                                            </span>
                                            {u.short_name && (
                                                <span className="text-xs text-slate-500">
                                                    {u.short_name} · {u.location ?? t('common.hanoi')}
                                                </span>
                                            )}
                                        </span>
                                        <span className="text-xs font-medium text-tertiary">
                                            {t('cutoff.viewCutoff')}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {!university && search && searchResults?.data.length === 0 && !loadError && (
                    <div className="card mt-6 p-8 text-center text-sm text-slate-600">
                        {t('cutoff.noResults', { search })}{' '}
                        <Link href="/universities" className="font-medium text-tertiary">
                            {t('cutoff.browseList')}
                        </Link>
                        .
                    </div>
                )}

                {university && (
                    <section className="mt-8">
                        <div className="mb-4">
                            <BackButton
                                onClick={clearUniversity}
                                label={t('cutoff.pickOther')}
                            />
                        </div>

                        <header className="card p-5 sm:p-6">
                            <div className="flex items-start gap-3">
                                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Building2 className="size-6" aria-hidden />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h2 className="font-display text-xl font-bold text-primary">
                                        {university.name}
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-600">
                                        {university.short_name
                                            ? `${university.short_name} · `
                                            : ''}
                                        {university.location ?? t('common.hanoi')}
                                    </p>
                                    <Link
                                        href={`/universities/${university.id}`}
                                        className="mt-2 inline-block text-sm font-medium text-tertiary hover:text-primary"
                                    >
                                        {t('cutoff.viewSchoolInfo')}
                                    </Link>
                                </div>
                            </div>
                        </header>

                        <div className="mt-6">
                            <h3 className="font-display text-lg font-bold text-primary">
                                {t('cutoff.tableTitle')}
                            </h3>
                            <p className="mt-1 text-sm text-slate-600">
                                {t('cutoff.tableSubtitle', {
                                    years: CUTOFF_YEARS.join(', '),
                                })}
                            </p>

                            {programs.length === 0 ? (
                                <div className="card mt-4 p-8 text-center text-sm text-slate-500">
                                    {t('cutoff.noPrograms')}
                                </div>
                            ) : !hasCutoffData ? (
                                <div className="card mt-4 p-8 text-center text-sm text-slate-500">
                                    {t('cutoff.noCutoffData')}
                                </div>
                            ) : (
                                <div className="mt-5">
                                    <CutoffMethodFilter
                                        methods={methods}
                                        programs={programs}
                                    />
                                </div>
                            )}
                        </div>

                        <p className="mt-8 text-center text-xs text-slate-500">
                            {t('cutoff.needSuggest')}{' '}
                            <Link
                                href="/chatbot"
                                className="font-medium text-tertiary hover:text-primary"
                            >
                                Chatbot
                            </Link>
                        </p>
                    </section>
                )}
            </div>
        </div>
    );
}
