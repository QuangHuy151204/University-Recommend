import {
  IsOptional,
  IsNumber,
  IsString,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProfileDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(30)
  @Type(() => Number)
  expected_score?: number;

  @IsOptional()
  @IsString()
  subject_combination?: string; // A00, A01, B00, D01...

  @IsOptional()
  @IsString()
  interests?: string; // JSON string: ["CNTT", "Kinh tế"]

  @IsOptional()
  @IsString()
  preferred_location?: string; // Phường muốn học gần (Hà Nội)

  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  budget_range?: 'low' | 'medium' | 'high';

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  budget_max_yearly?: number;

  @IsOptional()
  @IsString()
  career_goal?: string;

  @IsOptional()
  @IsString()
  preferred_method_code?: string;
}
