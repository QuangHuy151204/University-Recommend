import { api } from '@/lib/api';

import type {

    Major,

    MajorDetail,

    MajorGroupListResponse,

    Paginated,

} from '@/types';



export function listMajors(params?: {
    search?: string;
    group?: string;
    page?: number;
    limit?: number;
    sort_by?: 'id' | 'name' | 'code' | 'field_group';
    sort_order?: 'asc' | 'desc';
}) {

    return api.get<Paginated<Major>>('/majors', {

        query: params,

    });

}

/** Tải toàn bộ ngành (phân trang nội bộ) — dùng cho combobox tra cứu. */
export async function listAllMajors(): Promise<Major[]> {
    const limit = 100;
    let page = 1;
    const all: Major[] = [];

    while (true) {
        const res = await listMajors({ page, limit });
        all.push(...res.data);
        if (page >= res.totalPages) break;
        page += 1;
    }

    return all;
}



export function listMajorGroups() {

    return api.get<MajorGroupListResponse>('/majors/groups');

}



export function getMajor(id: number) {

    return api.get<MajorDetail>(`/majors/${id}`);

}

