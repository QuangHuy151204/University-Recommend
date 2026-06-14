import { MajorsService, CreateMajorDto } from './majors.service';
import { QueryMajorDto } from './major.dto';
export declare class MajorsController {
    private readonly majorsService;
    constructor(majorsService: MajorsService);
    findAll(query: QueryMajorDto): Promise<{
        group?: {
            name: string;
            slug: string;
        } | undefined;
        data: import("./majors.service").MajorWithGroups[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findGroups(): Promise<{
        data: {
            name: string;
            slug: string;
            count: number;
        }[];
        total: number;
    }>;
    findOne(id: number): Promise<import("./majors.service").MajorWithGroups>;
    create(dto: CreateMajorDto): Promise<import("./majors.service").MajorWithGroups>;
    update(id: number, dto: Partial<CreateMajorDto>): Promise<import("./majors.service").MajorWithGroups>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
