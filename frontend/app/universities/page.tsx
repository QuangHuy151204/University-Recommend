import { listUniversities } from '@/services/universities';
import { getMajor } from '@/services/majors';
import { ApiClientError } from '@/lib/api';
import { UniversitiesExplorer } from '@/components/universities/UniversitiesExplorer';

interface PageProps {
    searchParams: Promise<{
        search?: string;
        page?: string;
        subject_combination?: string;
        min_score?: string;
        major_id?: string;
        max_tuition?: string;
        ward?: string;
    }>;
}

function parseOptionalNumber(raw: string | undefined): number | undefined {
    if (!raw?.trim()) return undefined;
    const n = Number(raw);
    return Number.isFinite(n) ? n : undefined;
}

export default async function UniversitiesPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const page = Math.max(1, Number(params.page ?? 1));
    const search = params.search?.trim() || undefined;
    const subject_combination = params.subject_combination?.trim() || undefined;
    const min_score = parseOptionalNumber(params.min_score);
    const major_id = parseOptionalNumber(params.major_id);
    const max_tuition = parseOptionalNumber(params.max_tuition);
    const ward = params.ward?.trim() || undefined;

    let majorName: string | undefined;
    if (major_id != null) {
        try {
            majorName = (await getMajor(major_id)).name;
        } catch {
            majorName = undefined;
        }
    }

    let errorMessage: string | null = null;
    let result = {
        data: [] as Awaited<ReturnType<typeof listUniversities>>['data'],
        total: 0,
        page: 1,
        limit: 12,
        totalPages: 0,
    };

    try {
        result = await listUniversities({
            search,
            page,
            limit: 12,
            subject_combination,
            min_score,
            major_id,
            max_tuition,
            ward,
        });
    } catch (err) {
        if (err instanceof ApiClientError) {
            errorMessage = `Không gọi được API (${err.status}): ${err.message}`;
        } else {
            errorMessage =
                'Không kết nối được backend. Chạy API tại http://localhost:3001/api.';
        }
    }

    return (
        <>
            <div className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-6 py-2">
                    <p className="text-xs text-slate-500">
                        Tra cứu trường đại học tại Hà Nội — lọc theo khối thi,
                        điểm dự kiến, ngành mong muốn và học phí.
                    </p>
                </div>
            </div>
            {errorMessage ? (
                <div className="mx-auto max-w-7xl px-6 py-10">
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {errorMessage}
                    </div>
                </div>
            ) : (
                <UniversitiesExplorer
                    key={`${subject_combination ?? ''}|${min_score ?? ''}|${major_id ?? ''}|${max_tuition ?? ''}|${ward ?? ''}|${search ?? ''}|${page}`}
                    initial={result}
                    search={search}
                    page={page}
                    subjectCombination={subject_combination}
                    minScore={min_score}
                    majorId={major_id}
                    majorName={majorName}
                    maxTuition={max_tuition}
                    ward={ward}
                />
            )}
        </>
    );
}
