import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { ChatMessage } from './chat-message.entity';

@Entity('chat_sessions')
export class ChatSession {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  /** ID phiên do frontend gửi (localStorage) — nhóm hội thoại ẩn danh. */
  @Column({ type: 'varchar', length: 64, nullable: true, unique: true })
  session_key: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string | null;

  /** last_university, last_major, last_intent… — carry-over follow-up trong chatbot. */
  @Column({ type: 'jsonb', nullable: true })
  session_context: Record<string, unknown> | null;

  @OneToMany(() => ChatMessage, (m) => m.chatSession)
  messages: ChatMessage[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
