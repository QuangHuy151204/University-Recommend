import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Query,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import {
  CutoffScoresService,
  CreateCutoffScoreDto,
  UpdateCutoffScoreDto,
} from './cutoff-scores.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';
import { QueryCutoffAdminDto } from './cutoff-admin.dto';

@ApiTags('Điểm chuẩn')
@Controller('cutoff-scores')
export class CutoffScoresController {
  constructor(private readonly service: CutoffScoresService) {}

  @ApiOperation({
    summary: 'Danh sách tổ hợp môn có trong điểm chuẩn (2023–2025)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Lọc theo mã (A, B, 01, C02, …)',
  })
  @Get('subject-combinations')
  listSubjectCombinations(@Query('search') search?: string) {
    return this.service.listSubjectCombinations(search);
  }

  @ApiOperation({
    summary: 'Danh sách điểm chuẩn có phân trang (Admin)',
  })
  @ApiBearerAuth('JWT')
  @Get('admin-list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAllAdmin(@Query() query: QueryCutoffAdminDto) {
    return this.service.findAllAdmin(query);
  }

  @ApiOperation({ summary: 'Lấy điểm chuẩn theo trường' })
  @ApiQuery({
    name: 'year',
    required: false,
    description: 'Năm tuyển sinh (VD: 2024)',
  })
  @ApiQuery({
    name: 'admission_method',
    required: false,
    description: 'Lọc theo nhãn phương thức (chuỗi lưu trong DB)',
  })
  @ApiQuery({
    name: 'method_code',
    required: false,
    description:
      'Lọc theo mã PT (THPT, HOC_BA, DGNL…) — resolve qua admission_methods',
  })
  @Get('university/:id')
  findByUniversity(
    @Param('id', ParseIntPipe) id: number,
    @Query('year') year?: number,
    @Query('admission_method') admission_method?: string,
    @Query('method_code') method_code?: string,
  ) {
    return this.service.findByUniversity(id, {
      year: year ? Number(year) : undefined,
      admission_method,
      method_code,
    });
  }

  @ApiOperation({ summary: 'Lấy điểm chuẩn theo ngành' })
  @ApiQuery({ name: 'year', required: false })
  @ApiQuery({ name: 'admission_method', required: false })
  @ApiQuery({ name: 'method_code', required: false })
  @Get('major/:id')
  findByMajor(
    @Param('id', ParseIntPipe) id: number,
    @Query('year') year?: number,
    @Query('admission_method') admission_method?: string,
    @Query('method_code') method_code?: string,
  ) {
    return this.service.findByMajor(id, {
      year: year ? Number(year) : undefined,
      admission_method,
      method_code,
    });
  }

  @ApiOperation({ summary: 'Thêm điểm chuẩn mới (Admin)' })
  @ApiBearerAuth('JWT')
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateCutoffScoreDto) {
    return this.service.create(dto);
  }

  @ApiOperation({ summary: 'Cập nhật điểm chuẩn (Admin)' })
  @ApiBearerAuth('JWT')
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCutoffScoreDto,
  ) {
    return this.service.update(id, dto);
  }

  @ApiOperation({ summary: 'Xóa điểm chuẩn (Admin)' })
  @ApiBearerAuth('JWT')
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
