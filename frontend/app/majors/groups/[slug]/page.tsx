import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { listMajors } from '@/services/majors';
import { ApiClientError } from '@/lib/api';
import { normalizeGroupSlug } from '@/lib/major-groups';
import MajorListGrid from '@/components/majors/MajorListGrid';
import { SubpageToolbar } from '@/components/ui/PageLayout';

interface PageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string; search?: string }>;
}

function buildQueryString(search?: string, page?: number) {
    const q = new URLSearchParams();
    if (search) q.set('search', search);
    if (page && page > 1) q.set('page', String(page));
    const qs = q.toString();
    return qs ? `?${qs}` : '';
}

export default async function MajorGroupPage({ params, searchParams }: PageProps) {
    const { slug } = await params;
    const { page: pageParam, search: searchParam } = await searchParams;
    const page = Math.max(1, Number(pageParam ?? 1));
    const search = searchParam?.trim() || undefined;
    const normalizedSlug = normalizeGroupSlug(slug);

    let result = null;
    let errorMessage: string | null = null;

    try {
        result = await listMajors({
            group: normalizedSlug,
            search,
            page,
            limit: 48,
        });
    } catch (err) {
        errorMessage =
            err instanceof ApiClientError
                ? `API (${err.status}): ${err.message}`
                : 'Không kết nối backend.';
    }

    if (!errorMessage && result && result.total === 0 && !search) {
        notFound();
    }

    const canonicalSlug = result?.group?.slug;
    if (
        !errorMessage &&
        canonicalSlug &&
        normalizedSlug !== canonicalSlug &&
        slug !== canonicalSlug
    ) {
        redirect(
            `/majors/groups/${canonicalSlug}${buildQueryString(search, page)}`,
        );
    }

    const groupName = result?.group?.name ?? slug;
    const majors = result?.data ?? [];
    const linkSlug = canonicalSlug ?? normalizedSlug;
    const groupPath = `/majors/groups/${linkSlug}`;

    const buildPageHref = (p: number) =>
        `${groupPath}${buildQueryString(search, p)}`;

    return (
        <div className="bg-neutral pb-16">
            <div className="mx-auto max-w-6xl px-6 py-10">
                <SubpageToolbar
                    backHref="/majors"
                    backLabel="Tất cả nhóm ngành"
                    search={{
                        action: groupPath,
                        placeholder: 'Tìm ngành...',
                        defaultValue: search,
                    }}
                />

                <div>
                    <h1 className="font-display text-2xl font-bold text-primary">
                        {groupName}
                    </h1>
                    {result && (
                        <p className="mt-1 text-sm text-slate-600">
                            {result.total} ngành · trang {result.page}/
                            {result.totalPages}
                        </p>
                    )}
                </div>

                {errorMessage && (
                    <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {errorMessage}
                    </div>
                )}

                {!errorMessage && search && majors.length === 0 && (
                    <div className="card mt-6 p-8 text-center text-sm text-slate-600">
                        Không tìm thấy ngành nào cho &ldquo;{search}&rdquo; trong
                        nhóm {groupName}.
                    </div>
                )}

                {!errorMessage && majors.length > 0 && (
                    <MajorListGrid majors={majors} hideGroup />
                )}

                {!errorMessage && result && result.totalPages > 1 && (
                    <nav className="mt-8 flex justify-center gap-2">
                        {page > 1 && (
                            <Link href={buildPageHref(page - 1)} className="btn-secondary">
                                ← Trước
                            </Link>
                        )}
                        <span className="flex items-center text-sm text-slate-600">
                            {page} / {result.totalPages}
                        </span>
                        {page < result.totalPages && (
                            <Link href={buildPageHref(page + 1)} className="btn-secondary">
                                Sau →
                            </Link>
                        )}
                    </nav>
                )}
            </div>
        </div>
    );
}
