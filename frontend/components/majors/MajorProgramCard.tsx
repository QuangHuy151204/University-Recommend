'use client';



import Link from 'next/link';

import { FavoriteProgramButton } from '@/components/universities/FavoriteProgramButton';

import { formatTuitionVnd } from '@/lib/utils';



interface Props {

    programId: number;

    universityId: number;

    universityName: string;

    universityShortName: string | null;

    universityLocation: string | null;

    trainingProgram: string | null;

    tuitionFee: number | null;

}



export function MajorProgramCard({

    programId,

    universityId,

    universityName,

    universityShortName,

    universityLocation,

    trainingProgram,

    tuitionFee,

}: Props) {

    return (

        <article className="card group p-5 transition-shadow hover:shadow-md">

            <div className="flex items-start justify-between gap-2">

                <Link

                    href={`/universities/${universityId}`}

                    className="min-w-0 flex-1"

                >

                    <h3 className="font-display text-sm font-bold leading-snug text-slate-900 group-hover:text-primary">

                        {universityName}

                    </h3>

                    {universityShortName && (

                        <span className="badge-mint mt-1 inline-block shrink-0">

                            {universityShortName}

                        </span>

                    )}

                </Link>

                <FavoriteProgramButton universityMajorId={programId} compact />

            </div>

            <Link href={`/universities/${universityId}`} className="mt-3 block">

                <dl className="space-y-1 text-xs text-slate-600">

                    {universityLocation && (

                        <div>

                            <dt className="inline font-medium text-slate-500">

                                Khu vực:{' '}

                            </dt>

                            <dd className="inline">{universityLocation}</dd>

                        </div>

                    )}

                    {trainingProgram && (

                        <div>

                            <dt className="inline font-medium text-slate-500">

                                Chương trình:{' '}

                            </dt>

                            <dd className="inline">{trainingProgram}</dd>

                        </div>

                    )}

                    {tuitionFee != null && (

                        <div>

                            <dt className="inline font-medium text-slate-500">

                                Học phí:{' '}

                            </dt>

                            <dd className="inline font-medium text-primary">

                                {formatTuitionVnd(tuitionFee, tuitionFee)}

                            </dd>

                        </div>

                    )}

                </dl>

            </Link>

        </article>

    );

}

