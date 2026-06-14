import { RecommendationsService } from './recommendations.service';
import { RecommendRequestDto } from './recommendation.dto';
import type { AuthenticatedRequest } from '../auth/jwt-user.types';
export declare class RecommendationsController {
    private readonly recommendationsService;
    constructor(recommendationsService: RecommendationsService);
    recommend(dto: RecommendRequestDto, req: AuthenticatedRequest): Promise<import("./recommendation.response").RecommendResponse>;
    getMyRecommendations(req: AuthenticatedRequest): Promise<import("./recommendation.entity").Recommendation[]>;
}
