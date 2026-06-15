import {
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RecommendRequestDto {
  @IsNumber()
  @Min(0)
  @Max(30)
  @Type(() => Number)
  expected_score: number;

  @IsString()
  subject_combination: string; // A00, A01, B00, D01...

  @IsString()
  interests: string; // Tên ngành hoặc field_group: "CNTT", "Kinh tế"

  @IsOptional()
  @IsString()
  preferred_location?: string; // Phường muốn học gần (Hà Nội); để trống hoặc "Bất kỳ" = không lọc phường

  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  budget_range?: 'low' | 'medium' | 'high';

  /** Ngân sách học phí tối đa (VND / năm), ưu tiên hơn budget_range nếu có */
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  budget_max_yearly?: number;

  @IsOptional()
  @IsString()
  career_goal?: string;

  /** Mã PT từ bảng admission_methods (THPT, HOC_BA, DGNL…) */
  @IsOptional()
  @IsString()
  method_code?: string;
}
