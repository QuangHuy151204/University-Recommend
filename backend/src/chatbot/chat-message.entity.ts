import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ChatSession } from './chat-session.entity';

export type ChatMessageSender = 'user' | 'assistant';

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ChatSession, (s) => s.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chat_session_id' })
  chatSession: ChatSession;

  @Column({ type: 'varchar', length: 20 })
  sender: ChatMessageSender;

  @Column({ type: 'text' })
  message: string;

  /** intent, engine, entities… (JSON) — tùy chọn cho debug/analytics. */
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown> | null;

  @CreateDateColumn()
  created_at: Date;
}
