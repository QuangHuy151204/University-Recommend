import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UniversitiesService } from './universities.service';
import {
  CreateUniversityDto,
  UpdateUniversityDto,
  QueryUniversityDto,
} from './university.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('Trường Đại học')
@Controller('universities')
export class UniversitiesController {
  constructor(private readonly universitiesService: UniversitiesService) {}

  // Public: Ai cũng xem được danh sách + tìm kiếm
  @ApiOperation({ summary: 'Lấy danh sách trường' })
  @Get()
  findAll(@Query() query: QueryUniversityDto) {
    return this.universitiesService.findAll(query);
  }

  @ApiOperation({ summary: 'Danh sách phường có trường (dropdown)' })
  @Get('wards')
  listWards() {
    return this.universitiesService.listWards();
  }

  // Public: Xem chi tiết 1 trường
  @ApiOperation({ summary: 'Lấy chi tiết 1 trường theo ID' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.universitiesService.findOne(id);
  }

  // Admin only: Thêm trường mới
  @ApiOperation({ summary: 'Thêm trường mới (Admin)' })
  @ApiBearerAuth('JWT')
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateUniversityDto) {
    return this.universitiesService.create(dto);
  }

  // Admin only: Cập nhật thông tin trường
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUniversityDto,
  ) {
    return this.universitiesService.update(id, dto);
  }

  // Admin only: Xóa trường
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.universitiesService.remove(id);
  }
}
