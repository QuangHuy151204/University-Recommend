import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryMajorDto {
  @IsOptional()
  @IsString()
  search?: string;

  /** Slug nhóm ngành, vd. `an-toan-thong-tin` */
  @IsOptional()
  @IsString()
  group?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
