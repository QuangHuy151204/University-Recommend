import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { UniversityMajor } from '../majors/university-major.entity';

@Entity('cutoff_scores')
export class CutoffScore {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UniversityMajor, (um) => um.cutoffScores, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'university_major_id' })
  universityMajor: UniversityMajor;

  @Column()
  year: number; // Năm tuyển sinh

  @Column({ type: 'float' })
  score: number; // Điểm chuẩn

  @Column({ nullable: true })
  admission_method: string; // THPT Quốc Gia, Học bạ, Đánh giá năng lực...

  @Column({ nullable: true })
  subject_combination: string; // A00, A01, D01...

  @Column({ type: 'text', nullable: true })
  note: string;

  @CreateDateColumn()
  created_at: Date;
}
