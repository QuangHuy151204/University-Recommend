import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryCutoffAdminDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  university_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2015)
  year?: number;

  @IsOptional()
  @IsString()
  method_code?: string;

  @IsOptional()
  @IsString()
  admission_method?: string;

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
