import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/jwt-user.types';
import { FavoritesService } from './favorites.service';
import { AddFavoriteDto } from './favorites.dto';

@ApiTags('favorites')
@ApiBearerAuth('JWT')
@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  list(@Req() req: AuthenticatedRequest) {
    return this.favoritesService.listForUser(req.user!.userId);
  }

  @Post()
  add(@Req() req: AuthenticatedRequest, @Body() dto: AddFavoriteDto) {
    return this.favoritesService.add(req.user!.userId, dto);
  }

  @Delete('university/:universityId')
  removeByUniversity(
    @Req() req: AuthenticatedRequest,
    @Param('universityId', ParseIntPipe) universityId: number,
  ) {
    return this.favoritesService.removeByUniversity(
      req.user!.userId,
      universityId,
    );
  }

  @Delete('university-major/:universityMajorId')
  removeByUniversityMajor(
    @Req() req: AuthenticatedRequest,
    @Param('universityMajorId', ParseIntPipe) universityMajorId: number,
  ) {
    return this.favoritesService.removeByUniversityMajor(
      req.user!.userId,
      universityMajorId,
    );
  }

  @Delete(':id')
  remove(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.favoritesService.remove(req.user!.userId, id);
  }
}
