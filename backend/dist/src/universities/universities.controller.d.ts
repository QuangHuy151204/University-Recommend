import { UniversitiesService } from './universities.service';
import { CreateUniversityDto, UpdateUniversityDto, QueryUniversityDto } from './university.dto';
export declare class UniversitiesController {
    private readonly universitiesService;
    constructor(universitiesService: UniversitiesService);
    findAll(query: QueryUniversityDto): Promise<{
        data: import("./university.entity").University[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<import("./university.entity").University>;
    create(dto: CreateUniversityDto): Promise<import("./university.entity").University>;
    update(id: number, dto: UpdateUniversityDto): Promise<import("./university.entity").University>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
