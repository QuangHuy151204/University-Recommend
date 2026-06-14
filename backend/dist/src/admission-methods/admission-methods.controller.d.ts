import { AdmissionMethodsService } from './admission-methods.service';
import { CreateAdmissionMethodDto, UpdateAdmissionMethodDto } from './admission-method.dto';
export declare class AdmissionMethodsController {
    private readonly service;
    constructor(service: AdmissionMethodsService);
    findAll(): Promise<import("./admission-method.entity").AdmissionMethod[]>;
    create(dto: CreateAdmissionMethodDto): Promise<import("./admission-method.entity").AdmissionMethod>;
    update(id: number, dto: UpdateAdmissionMethodDto): Promise<import("./admission-method.entity").AdmissionMethod>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
