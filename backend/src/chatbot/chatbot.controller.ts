import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatMessageDto } from './chatbot.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/jwt-user.types';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  /**
   * POST /api/chatbot/chat
   * Gửi tin nhắn → nhận phản hồi từ chatbot
   * Không bắt buộc đăng nhập; JWT (cookie) tùy chọn để gắn user_id.
   */
  @Post('chat')
  @UseGuards(OptionalJwtAuthGuard)
  async chat(
    @Body() dto: ChatMessageDto,
    @Req() req: AuthenticatedRequest,
    @Query('session_id') sessionIdQuery?: string,
  ) {
    const userId = req.user?.userId;
    const sessionId = dto.session_id ?? sessionIdQuery;
    return this.chatbotService.chat(dto.message, userId, sessionId);
  }

  /**
   * GET /api/chatbot/sessions
   * Tối đa 5 cuộc hội thoại gần nhất của user đăng nhập.
   */
  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  listSessions(@Req() req: AuthenticatedRequest) {
    return this.chatbotService.listUserSessions(req.user!.userId);
  }

  /**
   * GET /api/chatbot/history?session_id=...
   * Lịch sử một cuộc hội thoại — chỉ session thuộc user hiện tại.
   */
  @Get('history')
  @UseGuards(JwtAuthGuard)
  getHistory(
    @Req() req: AuthenticatedRequest,
    @Query('session_id') sessionId?: string,
  ) {
    if (!sessionId?.trim()) {
      throw new BadRequestException('Thiếu tham số session_id.');
    }
    return this.chatbotService.getChatHistory(
      req.user!.userId,
      sessionId.trim(),
    );
  }
}
