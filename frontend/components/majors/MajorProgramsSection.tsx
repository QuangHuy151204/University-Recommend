'use client';

import { useMemo, useState } from 'react';
import { SearchField } from '@/components/ui/SearchField';
import { MajorProgramCard } from '@/components/majors/MajorProgramCard';

interface ProgramRow {
    id: number;
    university: {
        id: number;
        name: string;
        short_name?: string | null;
        location?: string | null;
    };
    training_program?: string | null;
    tuition_fee?: number | null;
}

export function MajorProgramsSection({ programs }: { programs: ProgramRow[] }) {
    const [query, setQuery] = useState('');

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return programs;
        return programs.filter((p) => {
            const haystack = [
                p.university.name,
                p.university.short_name,
                p.university.location,
                p.training_program,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();
            return haystack.includes(q);
        });
    }, [programs, query]);

    if (programs.length === 0) {
        return (
            <div className="card mt-5 p-8 text-center text-sm text-slate-500">
                Chưa có trường nào liên kết với ngành này trong CSDL.
            </div>
        );
    }

    return (
        <>
            <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
                <SearchField
                    value={query}
                    onChange={setQuery}
                    placeholder="Tìm trường..."
                    className="sm:max-w-sm"
                />
            </div>

            {filtered.length === 0 ? (
                <div className="card mt-4 p-8 text-center text-sm text-slate-600">
                    Không tìm thấy trường nào cho &ldquo;{query.trim()}&rdquo;.
                </div>
            ) : (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {filtered.map((p) => (
                        <MajorProgramCard
                            key={p.id}
                            programId={p.id}
                            universityId={p.university.id}
                            universityName={p.university.name}
                            universityShortName={p.university.short_name ?? null}
                            universityLocation={p.university.location ?? null}
                            trainingProgram={p.training_program ?? null}
                            tuitionFee={p.tuition_fee ?? null}
                        />
                    ))}
                </div>
            )}
        </>
    );
}
