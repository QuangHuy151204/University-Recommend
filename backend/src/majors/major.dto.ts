import { IsOptional, IsString, IsInt, Min, Max, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export const MAJOR_SORT_FIELDS = ['id', 'name', 'code', 'field_group'] as const;
export type MajorSortField = (typeof MAJOR_SORT_FIELDS)[number];

export const SORT_ORDERS = ['asc', 'desc'] as const;
export type SortOrder = (typeof SORT_ORDERS)[number];

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

  @IsOptional()
  @IsIn(MAJOR_SORT_FIELDS)
  sort_by?: MajorSortField;

  @IsOptional()
  @IsIn(SORT_ORDERS)
  sort_order?: SortOrder = 'asc';
}
