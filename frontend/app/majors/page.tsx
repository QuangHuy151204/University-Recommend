import Link from 'next/link';

import { listMajorGroups, listMajors } from '@/services/majors';

import { ApiClientError } from '@/lib/api';

import type { Major, MajorGroupSummary, Paginated } from '@/types';

import MajorGroupGrid from '@/components/majors/MajorGroupGrid';

import MajorListGrid from '@/components/majors/MajorListGrid';

import { PageSearchBar } from '@/components/ui/PageLayout';



interface PageProps {

    searchParams: Promise<{ search?: string; page?: string }>;

}



export default async function MajorsPage({ searchParams }: PageProps) {

    const params = await searchParams;

    const search = params.search?.trim() || undefined;

    const page = Math.max(1, Number(params.page ?? 1));



    let groups: MajorGroupSummary[] = [];

    let totalMajors = 0;

    let searchResult: Paginated<Major> | null = null;

    let errorMessage: string | null = null;



    try {

        if (search) {

            searchResult = await listMajors({ search, page, limit: 24 });

        } else {

            const groupResponse = await listMajorGroups();

            groups = groupResponse.data;

            totalMajors = groupResponse.data.reduce(

                (sum, g) => sum + g.count,

                0,

            );

        }

    } catch (err) {

        errorMessage =

            err instanceof ApiClientError

                ? `API (${err.status}): ${err.message}`

                : 'Không kết nối backend.';

    }



    const buildPageHref = (p: number) => {

        const q = new URLSearchParams();

        if (search) q.set('search', search);

        if (p > 1) q.set('page', String(p));

        const qs = q.toString();

        return qs ? `/majors?${qs}` : '/majors';

    };



    const searchMajors = searchResult?.data ?? [];



    return (

        <div className="bg-neutral pb-16">

            <div className="mx-auto max-w-6xl px-6 py-10">

                <div className="flex flex-wrap items-end justify-between gap-4">

                    <div>

                        <h1 className="font-display text-2xl font-bold text-primary">

                            Major Discovery

                        </h1>

                        <p className="mt-1 text-sm text-slate-600">
                            Ngành đào tạo tại các trường Hà Nội — xem theo nhóm, tìm
                            ngành phù hợp sở thích.
                        </p>

                    </div>

                    <PageSearchBar
                        action="/majors"
                        placeholder="Tìm ngành..."
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

                        Không tìm thấy ngành nào cho &ldquo;{search}&rdquo;.

                    </div>

                )}



                {!errorMessage && search && searchResult && searchMajors.length > 0 && (

                    <>

                        <p className="mb-4 mt-6 text-xs text-slate-500">

                            {searchResult.total} kết quả · trang{' '}

                            {searchResult.page}/{searchResult.totalPages}

                        </p>

                        <MajorListGrid majors={searchMajors} />

                        {searchResult.totalPages > 1 && (

                            <nav className="mt-8 flex justify-center gap-2">

                                {page > 1 && (

                                    <Link

                                        href={buildPageHref(page - 1)}

                                        className="btn-secondary"

                                    >

                                        ← Trước

                                    </Link>

                                )}

                                <span className="flex items-center text-sm text-slate-600">

                                    {page} / {searchResult.totalPages}

                                </span>

                                {page < searchResult.totalPages && (

                                    <Link

                                        href={buildPageHref(page + 1)}

                                        className="btn-secondary"

                                    >

                                        Sau →

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

