import { listAdmissionMethods } from '@/services/admission-methods';
import { getUniversity, listUniversities } from '@/services/universities';
import { CutoffScoresExplorer } from '@/components/cutoff-scores/CutoffScoresExplorer';
import { ApiClientError } from '@/lib/api';
import type { Paginated, University, UniversityDetail } from '@/types';

interface PageProps {
    searchParams: Promise<{ search?: string; university?: string }>;
}

export default async function CutoffScoresPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const search = params.search?.trim() || undefined;
    const universityId = params.university
        ? Number(params.university)
        : undefined;

    let loadError: string | null = null;
    let searchResults: Paginated<University> | null = null;
    let university: UniversityDetail | null = null;
    let methods: Awaited<ReturnType<typeof listAdmissionMethods>> = [];

    try {
        methods = await listAdmissionMethods().catch(() => []);

        if (search) {
            searchResults = await listUniversities({
                search,
                page: 1,
                limit: 20,
            });
        }

        if (universityId != null && Number.isFinite(universityId)) {
            university = await getUniversity(universityId);
        }
    } catch (err) {
        if (
            err instanceof ApiClientError &&
            err.status === 404 &&
            universityId != null
        ) {
            loadError = 'Không tìm thấy trường đã chọn.';
        } else if (err instanceof ApiClientError) {
            loadError = `Không gọi được API (${err.status}): ${err.message}`;
        } else {
            loadError =
                'Không kết nối được backend. Chạy API tại http://localhost:3001/api.';
        }
    }

    return (
        <CutoffScoresExplorer
            search={search}
            university={university}
            searchResults={searchResults}
            methods={methods}
            loadError={loadError}
        />
    );
}
