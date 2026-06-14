import { Repository } from 'typeorm';
import { CutoffScore } from './cutoff-score.entity';
import { AdmissionMethodsService } from '../admission-methods/admission-methods.service';
import { QueryCutoffAdminDto } from './cutoff-admin.dto';
export declare class CreateCutoffScoreDto {
    university_major_id: number;
    year: number;
    score: number;
    admission_method?: string;
    subject_combination?: string;
    note?: string;
}
export declare class UpdateCutoffScoreDto {
    year?: number;
    score?: number;
    admission_method?: string;
    subject_combination?: string;
    note?: string;
}
export interface CutoffQueryFilters {
    year?: number;
    admission_method?: string;
    method_code?: string;
}
export declare class CutoffScoresService {
    private readonly cutoffRepo;
    private readonly admissionMethodsService;
    constructor(cutoffRepo: Repository<CutoffScore>, admissionMethodsService: AdmissionMethodsService);
    create(dto: CreateCutoffScoreDto): Promise<CutoffScore>;
    update(id: number, dto: UpdateCutoffScoreDto): Promise<CutoffScore>;
    remove(id: number): Promise<{
        message: string;
    }>;
    private applyMethodFilter;
    findByUniversity(universityId: number, filters?: CutoffQueryFilters): Promise<CutoffScore[]>;
    findByMajor(majorId: number, filters?: CutoffQueryFilters): Promise<CutoffScore[]>;
    findAllAdmin(query: QueryCutoffAdminDto): Promise<{
        data: CutoffScore[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    listSubjectCombinations(search?: string): Promise<Array<{
        code: string;
        count: number;
    }>>;
}
