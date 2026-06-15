import Link from 'next/link';
import type { Major } from '@/types';

interface MajorListGridProps {
    majors: Major[];
    /** Ẩn nhãn nhóm khi đang xem trong một nhóm cụ thể (vd. /majors/groups/cntt). */
    hideGroup?: boolean;
}

export default function MajorListGrid({ majors, hideGroup }: MajorListGridProps) {
    return (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {majors.map((major) => (
                <Link
                    key={major.id}
                    href={`/majors/${major.id}`}
                    className="card group p-4 transition-shadow hover:shadow-md"
                >
                    <h3 className="text-sm font-semibold text-primary group-hover:text-tertiary">
                        {major.name}
                    </h3>
                    {major.code && (
                        <span className="badge-mint mt-2 inline-block">
                            {major.code}
                        </span>
                    )}
                    {!hideGroup &&
                        (major.groups?.find((g) => g.is_primary)?.group_name ||
                            major.field_group) && (
                            <span className="mt-2 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                                {major.groups?.find((g) => g.is_primary)
                                    ?.group_name ?? major.field_group}
                            </span>
                        )}
                    {major.career_orientation && (
                        <p className="mt-2 line-clamp-2 text-xs text-slate-600">
                            {major.career_orientation}
                        </p>
                    )}
                </Link>
            ))}
        </div>
    );
}
