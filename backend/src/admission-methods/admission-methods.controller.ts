import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdmissionMethodsService } from './admission-methods.service';
import {
  CreateAdmissionMethodDto,
  UpdateAdmissionMethodDto,
} from './admission-method.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('Phương thức xét tuyển')
@Controller('admission-methods')
export class AdmissionMethodsController {
  constructor(private readonly service: AdmissionMethodsService) {}

  @ApiOperation({
    summary:
      'Danh mục phương thức xét tuyển (THPT, Học bạ, ĐGNL…) — tra cứu công khai',
  })
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @ApiOperation({ summary: 'Thêm phương thức xét tuyển (Admin)' })
  @ApiBearerAuth('JWT')
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateAdmissionMethodDto) {
    return this.service.create(dto);
  }

  @ApiOperation({ summary: 'Cập nhật phương thức xét tuyển (Admin)' })
  @ApiBearerAuth('JWT')
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAdmissionMethodDto,
  ) {
    return this.service.update(id, dto);
  }

  @ApiOperation({ summary: 'Xóa phương thức xét tuyển (Admin)' })
  @ApiBearerAuth('JWT')
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
