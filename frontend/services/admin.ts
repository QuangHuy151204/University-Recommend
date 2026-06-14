import { api } from '@/lib/api';
import type {
    AdmissionMethod,
    CutoffScore,
    Major,
    MessageResponse,
    Paginated,
    University,
    UniversityMajor,
    UniversityType,
} from '@/types';

export interface AdminStats {
    universities: number;
    majors: number;
    cutoff_scores: number;
    users: number;
}

export interface AdminUserRow {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

export function getAdminStats() {
    return api.get<AdminStats>('/admin/stats');
}

export function listUsersAdmin() {
    return api.get<AdminUserRow[]>('/users');
}

export function deleteUserAdmin(id: number) {
    return api.delete<MessageResponse>(`/users/${id}`);
}

export function createUniversity(payload: Partial<University>) {
    return api.post<University>('/universities', payload);
}

export function updateUniversity(id: number, payload: Partial<University>) {
    return api.put<University>(`/universities/${id}`, payload);
}

export function deleteUniversity(id: number) {
    return api.delete<MessageResponse>(`/universities/${id}`);
}

export function createMajor(payload: Partial<Major>) {
    return api.post<Major>('/majors', payload);
}

export function updateMajor(id: number, payload: Partial<Major>) {
    return api.put<Major>(`/majors/${id}`, payload);
}

export function deleteMajor(id: number) {
    return api.delete<MessageResponse>(`/majors/${id}`);
}

export interface UniversityMajorPayload {
    university_id: number;
    major_id: number;
    training_program?: string;
    duration?: number;
    tuition_fee?: number;
    quota?: number;
    admission_methods?: string;
}

export function listUniversityMajors(query?: {
    university_id?: number;
    major_id?: number;
    page?: number;
    limit?: number;
}) {
    return api.get<Paginated<UniversityMajor>>('/university-majors', { query });
}

export function createUniversityMajor(payload: UniversityMajorPayload) {
    return api.post<UniversityMajor>('/university-majors', payload);
}

export function updateUniversityMajor(
    id: number,
    payload: Partial<UniversityMajorPayload>,
) {
    return api.patch<UniversityMajor>(`/university-majors/${id}`, payload);
}

export function deleteUniversityMajor(id: number) {
    return api.delete<MessageResponse>(`/university-majors/${id}`);
}

export interface CutoffAdminQuery {
    university_id?: number;
    year?: number;
    method_code?: string;
    admission_method?: string;
    page?: number;
    limit?: number;
}

export function listCutoffsAdmin(query: CutoffAdminQuery = {}) {
    return api.get<Paginated<CutoffScore>>('/cutoff-scores/admin-list', {
        query,
    });
}

export interface CutoffPayload {
    university_major_id: number;
    year: number;
    score: number;
    admission_method?: string;
    subject_combination?: string;
    note?: string;
}

export function createCutoff(payload: CutoffPayload) {
    return api.post<CutoffScore>('/cutoff-scores', payload);
}

export function updateCutoff(
    id: number,
    payload: Partial<Omit<CutoffPayload, 'university_major_id'>>,
) {
    return api.patch<CutoffScore>(`/cutoff-scores/${id}`, payload);
}

export function deleteCutoff(id: number) {
    return api.delete<MessageResponse>(`/cutoff-scores/${id}`);
}

export function createAdmissionMethod(payload: {
    method_code: string;
    method_name: string;
    description?: string;
}) {
    return api.post<AdmissionMethod>('/admission-methods', payload);
}

export function updateAdmissionMethod(
    id: number,
    payload: Partial<{
        method_code: string;
        method_name: string;
        description: string;
    }>,
) {
    return api.patch<AdmissionMethod>(`/admission-methods/${id}`, payload);
}

export function deleteAdmissionMethod(id: number) {
    return api.delete<MessageResponse>(`/admission-methods/${id}`);
}

export type { UniversityType };
