import { Repository } from 'typeorm';
import { UniversityMajor } from '../majors/university-major.entity';
import { University } from '../universities/university.entity';
import { Major } from '../majors/major.entity';
import { CreateUniversityMajorDto, UpdateUniversityMajorDto, QueryUniversityMajorDto } from './university-major.dto';
export declare class UniversityMajorsService {
    private readonly repo;
    private readonly universityRepo;
    private readonly majorRepo;
    constructor(repo: Repository<UniversityMajor>, universityRepo: Repository<University>, majorRepo: Repository<Major>);
    create(dto: CreateUniversityMajorDto): Promise<UniversityMajor>;
    findAll(query: QueryUniversityMajorDto): Promise<{
        data: UniversityMajor[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<UniversityMajor>;
    update(id: number, dto: UpdateUniversityMajorDto): Promise<UniversityMajor>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
