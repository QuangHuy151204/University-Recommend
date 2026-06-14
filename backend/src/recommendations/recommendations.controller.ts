import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { RecommendRequestDto } from './recommendation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/jwt-user.types';

@Controller('recommendations')
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  /**
   * POST /api/recommendations
   * Gửi thông tin học sinh → nhận danh sách trường/ngành gợi ý
   * Không cần đăng nhập cũng dùng được (nhưng nếu đăng nhập thì lưu lịch sử)
   */
  @Post()
  recommend(
    @Body() dto: RecommendRequestDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.userId;
    return this.recommendationsService.recommend(dto, userId);
  }

  /**
   * GET /api/recommendations/my
   * Lấy danh sách gợi ý đã lưu (cần đăng nhập)
   */
  @Get('my')
  @UseGuards(JwtAuthGuard)
  getMyRecommendations(@Req() req: AuthenticatedRequest) {
    return this.recommendationsService.getMyRecommendations(req.user!.userId);
  }
}
