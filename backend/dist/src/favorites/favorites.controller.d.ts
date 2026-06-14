import type { AuthenticatedRequest } from '../auth/jwt-user.types';
import { FavoritesService } from './favorites.service';
import { AddFavoriteDto } from './favorites.dto';
export declare class FavoritesController {
    private readonly favoritesService;
    constructor(favoritesService: FavoritesService);
    list(req: AuthenticatedRequest): Promise<{
        id: number;
        university_id: number;
        university_major_id: number | null;
        favorite_type: string;
        created_at: Date;
        university: import("../universities/university.entity").University;
        university_major: {
            id: number;
            training_program: string;
            duration: number;
            tuition_fee: number;
            major: import("../majors/major.entity").Major;
            university: import("../universities/university.entity").University;
        } | null;
    }[]>;
    add(req: AuthenticatedRequest, dto: AddFavoriteDto): Promise<{
        id: number;
        university_id: number;
        university_major_id: number;
        favorite_type: "program";
        university: import("../universities/university.entity").University;
        university_major: {
            id: number;
            training_program: string;
            duration: number;
            tuition_fee: number;
            major: import("../majors/major.entity").Major;
            university: import("../universities/university.entity").University;
        };
    } | {
        id: number;
        university_id: number;
        university_major_id: null;
        favorite_type: "university";
        university: import("../universities/university.entity").University;
        university_major: null;
    }>;
    removeByUniversity(req: AuthenticatedRequest, universityId: number): Promise<{
        message: string;
    }>;
    removeByUniversityMajor(req: AuthenticatedRequest, universityMajorId: number): Promise<{
        message: string;
    }>;
    remove(req: AuthenticatedRequest, id: number): Promise<{
        message: string;
    }>;
}
