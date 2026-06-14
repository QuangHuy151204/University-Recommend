import { api } from '@/lib/api';
import { COMPARE_MAX } from '@/lib/university-compare';
import type { Paginated, University, UniversityDetail } from '@/types';

export interface UniversityQuery {
    search?: string;
    location?: string;
    type?: string;
    max_tuition?: number;
    subject_combination?: string;
    min_score?: number;
    major_id?: number;
    page?: number;
    limit?: number;
}

export function listUniversities(query: UniversityQuery = {}) {
    return api.get<Paginated<University>>('/universities', { query });
}

export function getUniversity(id: number) {
    return api.get<UniversityDetail>(`/universities/${id}`);
}

/** Fetch nhiều trường song song (dùng cho trang so sánh). */
export async function getUniversitiesByIds(ids: number[]): Promise<{
    universities: UniversityDetail[];
    failedIds: number[];
}> {
    const unique = [...new Set(ids)].slice(0, COMPARE_MAX);
    const results = await Promise.allSettled(
        unique.map((id) => getUniversity(id)),
    );

    const universities: UniversityDetail[] = [];
    const failedIds: number[] = [];

    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            universities.push(result.value);
        } else {
            failedIds.push(unique[index]);
        }
    });

    return { universities, failedIds };
}
