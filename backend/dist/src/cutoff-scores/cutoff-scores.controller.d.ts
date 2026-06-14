import { CutoffScoresService, CreateCutoffScoreDto, UpdateCutoffScoreDto } from './cutoff-scores.service';
import { QueryCutoffAdminDto } from './cutoff-admin.dto';
export declare class CutoffScoresController {
    private readonly service;
    constructor(service: CutoffScoresService);
    listSubjectCombinations(search?: string): Promise<{
        code: string;
        count: number;
    }[]>;
    findAllAdmin(query: QueryCutoffAdminDto): Promise<{
        data: import("./cutoff-score.entity").CutoffScore[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findByUniversity(id: number, year?: number, admission_method?: string, method_code?: string): Promise<import("./cutoff-score.entity").CutoffScore[]>;
    findByMajor(id: number, year?: number, admission_method?: string, method_code?: string): Promise<import("./cutoff-score.entity").CutoffScore[]>;
    create(dto: CreateCutoffScoreDto): Promise<import("./cutoff-score.entity").CutoffScore>;
    update(id: number, dto: UpdateCutoffScoreDto): Promise<import("./cutoff-score.entity").CutoffScore>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
