import { IsOptional, IsString, MinLength } from 'class-validator';

export class ChatMessageDto {
  @IsString()
  @MinLength(2)
  message: string;

  /** Định danh hội thoại (nhóm các câu hỏi vào 1 session để bot có conversation memory). */
  @IsOptional()
  @IsString()
  session_id?: string;
}
