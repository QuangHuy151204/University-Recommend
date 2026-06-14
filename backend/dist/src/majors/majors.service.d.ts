import { Repository } from 'typeorm';
import { Major } from './major.entity';
import { UniversityMajor } from './university-major.entity';
import { MajorGroup } from './major-group.entity';
import { MajorGroupAssignment } from './major-group-assignment.entity';
import { QueryMajorDto } from './major.dto';
export declare class CreateMajorDto {
    name: string;
    code?: string;
    description?: string;
    career_orientation?: string;
    required_skills?: string;
    field_group?: string;
}
export type MajorWithGroups = Major & {
    groups: Array<{
        group_id: string;
        group_name: string;
        is_primary: boolean;
    }>;
};
export declare class MajorsService {
    private readonly majorRepo;
    private readonly uniMajorRepo;
    private readonly groupRepo;
    private readonly assignmentRepo;
    constructor(majorRepo: Repository<Major>, uniMajorRepo: Repository<UniversityMajor>, groupRepo: Repository<MajorGroup>, assignmentRepo: Repository<MajorGroupAssignment>);
    private applyClassification;
    private enrichMajor;
    create(dto: CreateMajorDto): Promise<MajorWithGroups>;
    findGroups(): Promise<{
        data: {
            name: string;
            slug: string;
            count: number;
        }[];
        total: number;
    }>;
    findAll(query?: QueryMajorDto): Promise<{
        group?: {
            name: string;
            slug: string;
        } | undefined;
        data: MajorWithGroups[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<MajorWithGroups>;
    update(id: number, dto: Partial<CreateMajorDto>): Promise<MajorWithGroups>;
    remove(id: number): Promise<{
        message: string;
    }>;
    findByTagTerms(terms: string[], limit?: number): Promise<Major[]>;
}
