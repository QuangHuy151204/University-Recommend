import { api } from '@/lib/api';
import type { RecommendRequest, RecommendResponse } from '@/types';

export function recommend(payload: RecommendRequest, token?: string) {
    return api.post<RecommendResponse>('/recommendations', payload, { token });
}

export function getMyRecommendations(token: string) {
    return api.get<unknown[]>('/recommendations/my', { token });
}
