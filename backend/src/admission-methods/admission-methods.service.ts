import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdmissionMethod } from './admission-method.entity';
import {
  CreateAdmissionMethodDto,
  UpdateAdmissionMethodDto,
} from './admission-method.dto';

@Injectable()
export class AdmissionMethodsService {
  constructor(
    @InjectRepository(AdmissionMethod)
    private readonly repo: Repository<AdmissionMethod>,
  ) {}

  async findAll(): Promise<AdmissionMethod[]> {
    return this.repo.find({ order: { method_name: 'ASC' } });
  }

  async create(dto: CreateAdmissionMethodDto): Promise<AdmissionMethod> {
    const code = dto.method_code.trim();
    const existed = await this.repo.findOne({ where: { method_code: code } });
    if (existed) {
      throw new ConflictException(`Mã phương thức "${code}" đã tồn tại`);
    }
    const row = this.repo.create({
      method_code: code,
      method_name: dto.method_name.trim(),
      description: dto.description?.trim() || undefined,
    });
    return this.repo.save(row);
  }

  async update(
    id: number,
    dto: UpdateAdmissionMethodDto,
  ): Promise<AdmissionMethod> {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) {
      throw new NotFoundException(`Không tìm thấy phương thức id ${id}`);
    }
    if (dto.method_code !== undefined) {
      const code = dto.method_code.trim();
      const dup = await this.repo.findOne({ where: { method_code: code } });
      if (dup && dup.id !== id) {
        throw new ConflictException(`Mã phương thức "${code}" đã tồn tại`);
      }
      row.method_code = code;
    }
    if (dto.method_name !== undefined) row.method_name = dto.method_name.trim();
    if (dto.description !== undefined) {
      row.description = dto.description?.trim() || '';
    }
    return this.repo.save(row);
  }

  async remove(id: number): Promise<{ message: string }> {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) {
      throw new NotFoundException(`Không tìm thấy phương thức id ${id}`);
    }
    await this.repo.delete(id);
    return { message: `Đã xóa phương thức id ${id}` };
  }

  /** Resolve method_code → display label stored in cutoff_scores.admission_method */
  async resolveLabel(
    methodCode?: string,
    admissionMethod?: string,
  ): Promise<string | null> {
    if (methodCode?.trim()) {
      const row = await this.repo.findOne({
        where: { method_code: methodCode.trim() },
      });
      if (row) return row.method_name;
      return methodCode.trim();
    }
    if (admissionMethod?.trim()) return admissionMethod.trim();
    return null;
  }
}
