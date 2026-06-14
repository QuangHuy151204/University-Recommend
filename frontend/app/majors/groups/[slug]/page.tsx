import Link from 'next/link';

import { notFound, redirect } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

import { listMajors } from '@/services/majors';

import { ApiClientError } from '@/lib/api';

import { normalizeGroupSlug } from '@/lib/major-groups';

import MajorListGrid from '@/components/majors/MajorListGrid';



interface PageProps {

    params: Promise<{ slug: string }>;

    searchParams: Promise<{ page?: string }>;

}



export default async function MajorGroupPage({

    params,

    searchParams,

}: PageProps) {

    const { slug } = await params;

    const { page: pageParam } = await searchParams;

    const page = Math.max(1, Number(pageParam ?? 1));

    const normalizedSlug = normalizeGroupSlug(slug);



    let result = null;

    let errorMessage: string | null = null;



    try {

        result = await listMajors({

            group: normalizedSlug,

            page,

            limit: 48,

        });

    } catch (err) {

        errorMessage =

            err instanceof ApiClientError

                ? `API (${err.status}): ${err.message}`

                : 'Không kết nối backend.';

    }



    if (!errorMessage && result && result.total === 0) {

        notFound();

    }



    const canonicalSlug = result?.group?.slug;

    if (

        !errorMessage &&

        canonicalSlug &&

        normalizedSlug !== canonicalSlug &&

        slug !== canonicalSlug

    ) {

        const qs = page > 1 ? `?page=${page}` : '';

        redirect(`/majors/groups/${canonicalSlug}${qs}`);

    }



    const groupName = result?.group?.name ?? slug;

    const majors = result?.data ?? [];

    const linkSlug = canonicalSlug ?? normalizedSlug;



    const buildPageHref = (p: number) => {

        if (p <= 1) return `/majors/groups/${linkSlug}`;

        return `/majors/groups/${linkSlug}?page=${p}`;

    };



    return (

        <div className="bg-neutral pb-16">

            <div className="mx-auto max-w-6xl px-6 py-10">

                <Link

                    href="/majors"

                    className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-primary"

                >

                    <ArrowLeft className="size-4" />

                    Tất cả nhóm ngành

                </Link>



                <div className="mt-4">

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



                {!errorMessage && majors.length > 0 && (

                    <MajorListGrid majors={majors} />

                )}



                {!errorMessage && result && result.totalPages > 1 && (

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

                            {page} / {result.totalPages}

                        </span>

                        {page < result.totalPages && (

                            <Link

                                href={buildPageHref(page + 1)}

                                className="btn-secondary"

                            >

                                Sau →

                            </Link>

                        )}

                    </nav>

                )}

            </div>

        </div>

    );

}

