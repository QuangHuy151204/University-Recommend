import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { UniversityMajor } from '../majors/university-major.entity';

@Entity('recommendations')
export class Recommendation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => UniversityMajor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'university_major_id' })
  universityMajor: UniversityMajor;

  @Column({ type: 'float' })
  match_score: number; // Điểm phù hợp 0-100

  @Column({ type: 'text', nullable: true })
  reason: string; // Giải thích lý do gợi ý

  @CreateDateColumn()
  created_at: Date;
}
