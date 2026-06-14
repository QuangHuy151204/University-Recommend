import { IsInt, IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUniversityMajorDto {
  @IsInt()
  @Min(1)
  university_id: number;

  @IsInt()
  @Min(1)
  major_id: number;

  @IsOptional()
  @IsString()
  training_program?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  duration?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tuition_fee?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  quota?: number;

  @IsOptional()
  @IsString()
  admission_methods?: string;
}

export class UpdateUniversityMajorDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  university_id?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  major_id?: number;

  @IsOptional()
  @IsString()
  training_program?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  duration?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tuition_fee?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  quota?: number;

  @IsOptional()
  @IsString()
  admission_methods?: string;
}

export class QueryUniversityMajorDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  university_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  major_id?: number;

  @IsOptional()
  @IsString()
  training_program?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
