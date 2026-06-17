import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsUrl,
  Min,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum UniversityType {
  PUBLIC = 'public',
  PRIVATE = 'private',
  INTERNATIONAL = 'international',
}

export class CreateUniversityDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  short_name?: string;

  @IsOptional()
  @IsEnum(UniversityType)
  type?: UniversityType;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  ward?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tuition_fee_min?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tuition_fee_max?: number;

  @IsOptional()
  @IsString()
  logo_url?: string;

  @IsOptional()
  @IsInt()
  established_year?: number;
}

export class UpdateUniversityDto extends CreateUniversityDto {}

export class QueryUniversityDto {
  @IsOptional()
  @IsString()
  search?: string; // Tìm theo tên

  @IsOptional()
  @IsString()
  location?: string; // Lọc theo thành phố (mặc định Hà Nội)

  @IsOptional()
  @IsString()
  ward?: string; // Lọc theo phường

  @IsOptional()
  @IsEnum(UniversityType)
  type?: UniversityType; // Lọc theo công lập/tư thục

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  max_tuition?: number; // Lọc theo học phí tối đa

  /** Tổ hợp môn (A00, B01…) — lọc trường có điểm chuẩn tương ứng */
  @IsOptional()
  @IsString()
  subject_combination?: string;

  /** Điểm dự kiến — chỉ hiện trường có ít nhất 1 ngành với điểm chuẩn ≤ giá trị này */
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  min_score?: number;

  /** Ngành mong muốn — lọc trường có ngành đó thỏa các điều kiện điểm chuẩn khác */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  major_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  /** Viết tắt trường ưu tiên lên đầu danh sách (vd. USTH cho admin). */
  @IsOptional()
  @IsString()
  prefer_short_name?: string;
}
