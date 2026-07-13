// @file: API client for cutoff score queries and subject-combination options.
import { api } from '@/lib/api';

export interface SubjectCombinationOption {
    code: string;
    count: number;
}

export function listSubjectCombinations(search?: string) {
    return api.get<SubjectCombinationOption[]>('/cutoff-scores/subject-combinations', {
        query: search ? { search } : undefined,
    });
}
