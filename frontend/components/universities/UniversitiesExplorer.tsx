'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import {
    Filter,
    MapPin,
    Banknote,
    Bot,
    Search,
    X,
    Plus,
} from 'lucide-react';
import type { Paginated, University } from '@/types';
import { useLocale } from '@/lib/i18n/locale';
import { formatTuitionVnd } from '@/lib/utils';
import {
    buildComparePath,
    COMPARE_MAX,
    toggleStoredUniversity,
    writeStoredCompareEntries,
} from '@/lib/university-compare';
import { useCompareEntries } from '@/hooks/useCompareEntries';
import {
    MajorSearchPicker,
    type MajorSearchPickerHandle,
} from '@/components/ui/MajorSearchPicker';
import { SubjectCombinationPicker } from '@/components/ui/SubjectCombinationPicker';
import { WardPicker } from '@/components/ui/WardPicker';

const TUITION_MIN = 5_000_000;
const TUITION_MAX = 80_000_000;
const TUITION_STEP = 1_000_000;

interface Props {
    initial: Paginated<University>;
    search?: string;
    page: number;
    subjectCombination?: string;
    minScore?: number;
    majorId?: number;
    majorName?: string;
    maxTuition?: number;
    ward?: string;
}

export function UniversitiesExplorer({
    initial,
    search,
    page,
    subjectCombination,
    minScore,
    majorId,
    majorName,
    maxTuition,
    ward,
}: Props) {
    const { t } = useLocale();
    const router = useRouter();
    const compare = useCompareEntries();
    const majorPickerRef = useRef<MajorSearchPickerHandle>(null);
    const [subjectCombo, setSubjectCombo] = useState(
        subjectCombination ?? '',
    );
    const [scoreInput, setScoreInput] = useState(
        minScore != null ? String(minScore) : '',
    );
    const [selectedMajorId, setSelectedMajorId] = useState<number | null>(
        majorId ?? null,
    );
    const [tuitionEnabled, setTuitionEnabled] = useState(maxTuition != null);
    const [tuitionMax, setTuitionMax] = useState(
        maxTuition ?? 30_000_000,
    );
    const [selectedWard, setSelectedWard] = useState(ward ?? '');
    const [applyingFilters, setApplyingFilters] = useState(false);

    const data = initial.data;

    const hasActiveCutoffFilters =
        Boolean(subjectCombination) ||
        minScore != null ||
        majorId != null ||
        maxTuition != null ||
        Boolean(ward);

    const filterFields = (
        <div className="space-y-3">
            <SubjectCombinationPicker
                id="filter-subject"
                label={t('universities.subjectLabel')}
                value={subjectCombo}
                onChange={setSubjectCombo}
            />
            <MajorSearchPicker
                ref={majorPickerRef}
                id="filter-major"
                label={t('universities.majorLabel')}
                hint=""
                value={selectedMajorId}
                onChange={setSelectedMajorId}
            />
            <div>
                <label
                    htmlFor="filter-score"
                    className="text-xs font-semibold uppercase text-slate-500"
                >
                    {t('universities.scoreLabel')}
                </label>
                <input
                    id="filter-score"
                    type="number"
                    min={0}
                    max={30}
                    step={0.05}
                    placeholder={t('universities.scorePlaceholder')}
                    value={scoreInput}
                    onChange={(e) => setScoreInput(e.target.value)}
                    className="input-field mt-2"
                />
            </div>
            <div>
                <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                    <input
                        type="checkbox"
                        checked={tuitionEnabled}
                        onChange={(e) => setTuitionEnabled(e.target.checked)}
                        className="rounded text-primary"
                    />
                    {t('universities.tuitionOptional')}
                </label>
                {tuitionEnabled && (
                    <>
                        <input
                            type="range"
                            min={TUITION_MIN}
                            max={TUITION_MAX}
                            step={TUITION_STEP}
                            value={tuitionMax}
                            onChange={(e) =>
                                setTuitionMax(Number(e.target.value))
                            }
                            className="mt-3 w-full accent-primary"
                        />
                        <div className="mt-1 flex justify-between text-xs text-slate-500">
                            <span>{t('universities.tuitionMin')}</span>
                            <span className="font-semibold text-primary">
                                {t('universities.tuitionMaxLabel', {
                                    value: formatTuitionSlider(tuitionMax),
                                })}
                            </span>
                            <span>{t('universities.tuitionMax')}</span>
                        </div>
                    </>
                )}
            </div>
            <WardPicker
                id="filter-ward"
                variant="filter"
                label={t('universities.wardLabel')}
                anyLabel={t('universities.wardAny')}
                value={selectedWard}
                onChange={setSelectedWard}
            />
        </div>
    );
    const toggleCompare = (u: University) => {
        toggleStoredUniversity({
            id: u.id,
            name: u.name,
            short_name: u.short_name,
        });
    };

    const clearCompare = () => {
        writeStoredCompareEntries([]);
    };

    const goCompare = () => {
        if (compare.length < 2) return;
        router.push(buildComparePath(compare.map((e) => e.id)));
    };

    async function applyFilters(e?: React.FormEvent) {
        e?.preventDefault();
        setApplyingFilters(true);
        try {
            const resolved =
                (await majorPickerRef.current?.resolveValue()) ?? {
                    majorId: selectedMajorId,
                    blocked: false,
                };
            if (resolved.blocked) return;
            const resolvedMajorId = resolved.majorId;

            const q = new URLSearchParams();
            if (search) q.set('search', search);
            if (subjectCombo) q.set('subject_combination', subjectCombo);
            const score = scoreInput.trim() ? Number(scoreInput) : NaN;
            if (Number.isFinite(score) && score >= 0) {
                q.set('min_score', String(score));
            }
            if (resolvedMajorId != null) {
                q.set('major_id', String(resolvedMajorId));
            }
            if (tuitionEnabled) {
                q.set('max_tuition', String(tuitionMax));
            }
            if (selectedWard.trim()) {
                q.set('ward', selectedWard.trim());
            }
            const qs = q.toString();
            router.push(qs ? `/universities?${qs}` : '/universities');
        } finally {
            setApplyingFilters(false);
        }
    }

    const buildPageHref = (p: number) => {
        const q = new URLSearchParams();
        if (search) q.set('search', search);
        if (subjectCombination) q.set('subject_combination', subjectCombination);
        if (minScore != null) q.set('min_score', String(minScore));
        if (majorId != null) q.set('major_id', String(majorId));
        if (maxTuition != null) q.set('max_tuition', String(maxTuition));
        if (ward) q.set('ward', ward);
        if (p > 1) q.set('page', String(p));
        const qs = q.toString();
        return qs ? `/universities?${qs}` : '/universities';
    };

    function formatTuitionSlider(value: number): string {
        return t('universities.tuitionPerYear', {
            value: Math.round(value / 1_000_000),
        });
    }

    return (
        <div className="bg-neutral pb-28">
            <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 lg:flex-row">
                {/* Sidebar filters */}
                <aside className="w-full shrink-0 lg:w-64">
                    <div className="card lg:sticky lg:top-24 p-5">
                        <div className="flex items-center gap-2 font-semibold text-primary">
                            <Filter className="size-4" />
                            {t('universities.filtersTitle')}
                        </div>
                        <form onSubmit={applyFilters} className="mt-4 space-y-4">
                            {filterFields}
                            <button
                                type="submit"
                                className="btn-accent w-full"
                                disabled={applyingFilters}
                            >
                                <Search className="size-4" />
                                {applyingFilters
                                    ? t('universities.applying')
                                    : t('universities.applyFilters')}
                            </button>
                        </form>
                    </div>
                </aside>

                {/* Results */}
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div className="min-w-0 flex-1">
                            <h1 className="font-display text-2xl font-bold text-primary">
                                {t('universities.resultsTitle')}
                            </h1>
                            <p className="mt-1 text-sm text-slate-600">
                                {t('universities.found', {
                                    total: initial.total,
                                    searchPart: search
                                        ? t('universities.foundSearchPart', {
                                              search,
                                          })
                                        : '',
                                    page: initial.page,
                                    totalPages: initial.totalPages,
                                })}
                            </p>
                            {hasActiveCutoffFilters && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {subjectCombination && (
                                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                            {t('universities.filterCombo', {
                                                combo: subjectCombination,
                                            })}
                                        </span>
                                    )}
                                    {minScore != null && (
                                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                            {t('universities.filterScore', {
                                                score: minScore,
                                            })}
                                        </span>
                                    )}
                                    {majorId != null && (
                                        <span className="rounded-full bg-secondary/15 px-2.5 py-0.5 text-xs font-medium text-primary">
                                            {t('universities.filterMajor', {
                                                name: majorName ?? `#${majorId}`,
                                            })}
                                        </span>
                                    )}
                                    {maxTuition != null && (
                                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                                            {t('universities.filterTuition', {
                                                value: formatTuitionSlider(maxTuition),
                                            })}
                                        </span>
                                    )}
                                    {ward && (
                                        <span className="rounded-full bg-secondary/15 px-2.5 py-0.5 text-xs font-medium text-primary">
                                            {t('universities.filterWard', {
                                                name: ward,
                                            })}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
                            <select className="input-field !w-auto flex-1 text-sm sm:flex-none">
                                <option>{t('universities.sortBest')}</option>
                                <option>{t('universities.sortAz')}</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4">
                        {data.map((u) => {
                            const inCompare = compare.some((c) => c.id === u.id);
                            return (
                                <article key={u.id} className="card p-5">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div className="flex gap-4">
                                            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                                                {(u.short_name || u.name)
                                                    .slice(0, 2)
                                                    .toUpperCase()}
                                            </div>
                                            <div>
                                                <h2 className="font-display font-bold text-primary">
                                                    {u.name}
                                                </h2>
                                                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                                    <MapPin className="size-3.5" />
                                                    {u.ward
                                                        ? `${u.ward}, ${u.location ?? t('universities.hanoi')}`
                                                        : (u.location ?? t('universities.hanoi'))}
                                                </p>
                                                <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-600">
                                                    <Banknote className="size-3.5" />
                                                    {formatTuitionVnd(
                                                        u.tuition_fee_min,
                                                        u.tuition_fee_max,
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <label className="flex cursor-pointer items-center gap-1.5 text-xs text-slate-600">
                                                <input
                                                    type="checkbox"
                                                    checked={inCompare}
                                                    onChange={() => toggleCompare(u)}
                                                    className="rounded text-primary"
                                                />
                                                {t('universities.compare')}
                                            </label>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                                            {u.type}
                                        </span>
                                        <Link
                                            href={`/cutoff-scores?university=${u.id}`}
                                            className="badge-score transition-colors hover:bg-primary/15"
                                        >
                                            {t('universities.viewCutoff')}
                                        </Link>
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <Link
                                            href={`/universities/${u.id}`}
                                            className="btn-secondary flex-1 text-center sm:flex-none"
                                        >
                                            {t('universities.details')}
                                        </Link>
                                        <Link
                                            href={`/chatbot?uni=${encodeURIComponent(u.short_name || u.name)}`}
                                            className="btn-primary flex-1 sm:flex-none"
                                        >
                                            <Bot className="size-4" />
                                            {t('universities.askAi')}
                                        </Link>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    {initial.totalPages > 1 && (
                        <nav className="mt-8 flex justify-center gap-2">
                            {page > 1 && (
                                <Link href={buildPageHref(page - 1)} className="btn-secondary">
                                    {t('universities.prev')}
                                </Link>
                            )}
                            <span className="flex items-center px-3 text-sm text-slate-600">
                                {page} / {initial.totalPages}
                            </span>
                            {page < initial.totalPages && (
                                <Link href={buildPageHref(page + 1)} className="btn-secondary">
                                    {t('universities.next')}
                                </Link>
                            )}
                        </nav>
                    )}

                    {/* AI banner */}
                    <div className="card relative mt-8 overflow-hidden !border-primary/20 !bg-primary p-6 text-white sm:p-8">
                        <div className="relative z-10 w-full sm:w-1/2">
                            <span className="badge-mint !bg-secondary !text-white">
                                {t('universities.aiBadge')}
                            </span>
                            <p className="mt-3 text-sm leading-relaxed text-white/90">
                                {t('universities.aiBanner')}
                            </p>
                            <Link
                                href="/chatbot"
                                className="btn-secondary mt-4 inline-flex !border-0"
                            >
                                {t('universities.aiCta')}
                            </Link>
                        </div>
                        <img
                            src="/character.png"
                            alt=""
                            aria-hidden
                            className="pointer-events-none absolute bottom-0 right-3 hidden h-36 w-auto object-contain object-bottom sm:block lg:right-6 lg:h-44"
                        />
                    </div>
                </div>
            </div>

            {/* Compare bar */}
            {compare.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white px-6 py-4 shadow-lg">
                    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
                        <span className="text-sm font-semibold text-primary">
                            {t('universities.comparing', { count: compare.length })}
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                            {compare.map((e) => (
                                <span
                                    key={e.id}
                                    className="flex items-center gap-2 rounded-full bg-neutral px-3 py-1.5 text-sm"
                                >
                                    {e.short_name || e.name}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            toggleStoredUniversity(e)
                                        }
                                        className="text-slate-400 hover:text-danger"
                                    >
                                        <X className="size-4" />
                                    </button>
                                </span>
                            ))}
                            {compare.length < COMPARE_MAX && (
                                <span className="flex size-9 items-center justify-center rounded-full border border-dashed border-slate-300 text-slate-400">
                                    <Plus className="size-4" />
                                </span>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={clearCompare}
                                className="text-sm text-slate-500 hover:text-primary"
                            >
                                {t('universities.clearAll')}
                            </button>
                            <button
                                type="button"
                                onClick={goCompare}
                                disabled={compare.length < 2}
                                className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {t('universities.compareNow')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
