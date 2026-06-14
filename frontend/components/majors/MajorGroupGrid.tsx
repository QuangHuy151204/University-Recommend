import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { MajorGroupSummary } from '@/types';

interface MajorGroupGridProps {
    groups: MajorGroupSummary[];
    totalMajors: number;
}

export default function MajorGroupGrid({
    groups,
    totalMajors,
}: MajorGroupGridProps) {
    return (
        <div className="mt-6 space-y-4">
            <p className="text-sm text-slate-600">
                {totalMajors} ngành đào tạo · {groups.length} nhóm ngành
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {groups.map((group) => (
                    <Link
                        key={group.slug}
                        href={`/majors/groups/${group.slug}`}
                        className="card group flex items-center justify-between p-5 transition-shadow hover:shadow-md"
                    >
                        <div>
                            <h2 className="text-sm font-semibold text-primary group-hover:text-tertiary">
                                {group.name}
                            </h2>
                            <p className="mt-1 text-xs text-slate-500">
                                {group.count} ngành
                            </p>
                        </div>
                        <ChevronRight className="size-5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                    </Link>
                ))}
            </div>
        </div>
    );
}
