import { Repository } from 'typeorm';
import { UserFavorite } from './user-favorite.entity';
import { University } from '../universities/university.entity';
import { UniversityMajor } from '../majors/university-major.entity';
import { AddFavoriteDto } from './favorites.dto';
export declare class FavoritesService {
    private readonly favoriteRepo;
    private readonly universityRepo;
    private readonly uniMajorRepo;
    constructor(favoriteRepo: Repository<UserFavorite>, universityRepo: Repository<University>, uniMajorRepo: Repository<UniversityMajor>);
    listForUser(userId: number): Promise<{
        id: number;
        university_id: number;
        university_major_id: number | null;
        favorite_type: string;
        created_at: Date;
        university: University;
        university_major: {
            id: number;
            training_program: string;
            duration: number;
            tuition_fee: number;
            major: import("../majors/major.entity").Major;
            university: University;
        } | null;
    }[]>;
    add(userId: number, dto: AddFavoriteDto): Promise<{
        id: number;
        university_id: number;
        university_major_id: number;
        favorite_type: "program";
        university: University;
        university_major: {
            id: number;
            training_program: string;
            duration: number;
            tuition_fee: number;
            major: import("../majors/major.entity").Major;
            university: University;
        };
    } | {
        id: number;
        university_id: number;
        university_major_id: null;
        favorite_type: "university";
        university: University;
        university_major: null;
    }>;
    private addUniversity;
    private addProgram;
    remove(userId: number, favoriteId: number): Promise<{
        message: string;
    }>;
    removeByUniversity(userId: number, universityId: number): Promise<{
        message: string;
    }>;
    removeByUniversityMajor(userId: number, universityMajorId: number): Promise<{
        message: string;
    }>;
}
