// @file: Validated request/response DTOs for student favorite universities and programs.
import { IsInt, IsOptional, Min } from 'class-validator';

import { Type } from 'class-transformer';

export class AddFavoriteDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  university_id?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  university_major_id?: number;
}
