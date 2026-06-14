import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { University } from '../universities/university.entity';
import { Major } from './major.entity';
import { CutoffScore } from '../cutoff-scores/cutoff-score.entity';

@Entity('university_majors')
export class UniversityMajor {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => University, (u) => u.universityMajors, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'university_id' })
  university: University;

  @ManyToOne(() => Major, (m) => m.universityMajors, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'major_id' })
  major: Major;

  @Column({ nullable: true })
  training_program: string; // Chương trình đào tạo

  @Column({ nullable: true })
  duration: number; // Số năm học

  @Column({ nullable: true })
  tuition_fee: number; // Học phí/năm

  @Column({ nullable: true })
  quota: number; // Chỉ tiêu

  @Column({ type: 'text', nullable: true })
  admission_methods: string; // Phương thức xét tuyển (JSON string)

  @OneToMany(() => CutoffScore, (cs: CutoffScore) => cs.universityMajor)
  cutoffScores: CutoffScore[];

  @CreateDateColumn()
  created_at: Date;
}
