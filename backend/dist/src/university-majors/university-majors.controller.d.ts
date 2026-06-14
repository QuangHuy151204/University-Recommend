import { UniversityMajorsService } from './university-majors.service';
import { CreateUniversityMajorDto, UpdateUniversityMajorDto, QueryUniversityMajorDto } from './university-major.dto';
export declare class UniversityMajorsController {
    private readonly service;
    constructor(service: UniversityMajorsService);
    findAll(query: QueryUniversityMajorDto): Promise<{
        data: import("../majors/university-major.entity").UniversityMajor[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<import("../majors/university-major.entity").UniversityMajor>;
    create(dto: CreateUniversityMajorDto): Promise<import("../majors/university-major.entity").UniversityMajor>;
    update(id: number, dto: UpdateUniversityMajorDto): Promise<import("../majors/university-major.entity").UniversityMajor>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
