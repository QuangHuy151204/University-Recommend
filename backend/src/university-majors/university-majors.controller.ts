import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UniversityMajorsService } from './university-majors.service';
import {
  CreateUniversityMajorDto,
  UpdateUniversityMajorDto,
  QueryUniversityMajorDto,
} from './university-major.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('Ngành tại trường (university-majors)')
@Controller('university-majors')
export class UniversityMajorsController {
  constructor(private readonly service: UniversityMajorsService) {}

  @ApiOperation({
    summary:
      'Danh sách ngành theo trường (filter university_id / major_id / training_program)',
  })
  @Get()
  findAll(@Query() query: QueryUniversityMajorDto) {
    return this.service.findAll(query);
  }

  @ApiOperation({
    summary: 'Chi tiết 1 university-major theo id (kèm điểm chuẩn)',
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @ApiOperation({ summary: 'Tạo liên kết ngành-trường mới (Admin)' })
  @ApiBearerAuth('JWT')
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateUniversityMajorDto) {
    return this.service.create(dto);
  }

  @ApiOperation({ summary: 'Cập nhật một university-major (Admin)' })
  @ApiBearerAuth('JWT')
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUniversityMajorDto,
  ) {
    return this.service.update(id, dto);
  }

  @ApiOperation({
    summary: 'Xóa một university-major (Admin) — chặn nếu còn cutoff_scores',
  })
  @ApiBearerAuth('JWT')
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
