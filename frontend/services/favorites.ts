import { api } from '@/lib/api';

import type { Major, University } from '@/types';



export type FavoriteType = 'university' | 'program';



export interface FavoriteProgramSummary {

    id: number;

    training_program: string | null;

    duration: number | null;

    tuition_fee: number | null;

    major: Major;

    university: University;

}



export interface FavoriteItem {

    id: number;

    university_id: number;

    university_major_id: number | null;

    favorite_type: FavoriteType;

    created_at: string;

    university: University;

    university_major: FavoriteProgramSummary | null;

}



export function listFavorites(token: string) {

    return api.get<FavoriteItem[]>('/favorites', { token });

}



export function addFavoriteUniversity(universityId: number, token: string) {

    return api.post<FavoriteItem>(

        '/favorites',

        { university_id: universityId },

        { token },

    );

}



export function addFavoriteProgram(universityMajorId: number, token: string) {

    return api.post<FavoriteItem>(

        '/favorites',

        { university_major_id: universityMajorId },

        { token },

    );

}



/** @deprecated use addFavoriteUniversity */

export function addFavorite(universityId: number, token: string) {

    return addFavoriteUniversity(universityId, token);

}



export function removeFavorite(favoriteId: number, token: string) {

    return api.delete<{ message: string }>(`/favorites/${favoriteId}`, { token });

}



export function removeFavoriteByUniversity(universityId: number, token: string) {

    return api.delete<{ message: string }>(

        `/favorites/university/${universityId}`,

        { token },

    );

}



export function removeFavoriteByProgram(universityMajorId: number, token: string) {

    return api.delete<{ message: string }>(

        `/favorites/university-major/${universityMajorId}`,

        { token },

    );

}

