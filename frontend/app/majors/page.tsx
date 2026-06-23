import { listMajorGroups, listMajors } from '@/services/majors';
import { ApiClientError } from '@/lib/api';
import type { Major, MajorGroupSummary, Paginated } from '@/types';
import { MajorsPageContent } from '@/components/majors/MajorsPageContent';

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
            totalMajors = groupResponse.data.reduce((sum, g) => sum + g.count, 0);
        }
    } catch (err) {
        errorMessage =
            err instanceof ApiClientError
                ? `API (${err.status}): ${err.message}`
                : 'Không kết nối backend.';
    }

    const searchMajors = searchResult?.data ?? [];

    return (
        <MajorsPageContent
            search={search}
            page={page}
            errorMessage={errorMessage}
            groups={groups}
            totalMajors={totalMajors}
            searchResult={searchResult}
            searchMajors={searchMajors}
        />
    );
}
