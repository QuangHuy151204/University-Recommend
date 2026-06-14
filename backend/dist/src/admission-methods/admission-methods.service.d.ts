import { Repository } from 'typeorm';
import { AdmissionMethod } from './admission-method.entity';
import { CreateAdmissionMethodDto, UpdateAdmissionMethodDto } from './admission-method.dto';
export declare class AdmissionMethodsService {
    private readonly repo;
    constructor(repo: Repository<AdmissionMethod>);
    findAll(): Promise<AdmissionMethod[]>;
    create(dto: CreateAdmissionMethodDto): Promise<AdmissionMethod>;
    update(id: number, dto: UpdateAdmissionMethodDto): Promise<AdmissionMethod>;
    remove(id: number): Promise<{
        message: string;
    }>;
    resolveLabel(methodCode?: string, admissionMethod?: string): Promise<string | null>;
}
