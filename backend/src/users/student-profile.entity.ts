import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('student_profiles')
export class StudentProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (u) => u.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'float', nullable: true })
  expected_score: number; // Điểm dự kiến

  @Column({ nullable: true })
  subject_combination: string; // A00, A01, D01...

  @Column({ type: 'text', nullable: true })
  interests: string; // Sở thích ngành nghề (JSON)

  @Column({ nullable: true })
  preferred_location: string; // Khu vực muốn học

  @Column({ nullable: true })
  budget_range: string; // low | medium | high

  @Column({ type: 'int', nullable: true })
  budget_max_yearly: number | null; // VND/năm

  @Column({ type: 'text', nullable: true })
  career_goal: string; // Mục tiêu nghề nghiệp

  /** PT xét tuyển ưu tiên khi gợi ý / tra cứu (THPT, HOC_BA, …) */
  @Column({ type: 'varchar', nullable: true, default: 'THPT' })
  preferred_method_code: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
