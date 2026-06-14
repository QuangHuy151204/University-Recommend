import { IsOptional, IsString } from 'class-validator';

export class CreateAdmissionMethodDto {
  @IsString()
  method_code: string;

  @IsString()
  method_name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateAdmissionMethodDto {
  @IsOptional()
  @IsString()
  method_code?: string;

  @IsOptional()
  @IsString()
  method_name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
