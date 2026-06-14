import { Repository } from 'typeorm';
import { University } from './university.entity';
import { Major } from '../majors/major.entity';
import { CreateUniversityDto, UpdateUniversityDto, QueryUniversityDto } from './university.dto';
export declare class UniversitiesService {
    private readonly universityRepo;
    private readonly majorRepo;
    constructor(universityRepo: Repository<University>, majorRepo: Repository<Major>);
    create(dto: CreateUniversityDto): Promise<University>;
    findAll(query: QueryUniversityDto): Promise<{
        data: University[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<University>;
    update(id: number, dto: UpdateUniversityDto): Promise<University>;
    remove(id: number): Promise<{
        message: string;
    }>;
    private resolveMajorIdsForFilter;
    private applyCutoffFilters;
}
