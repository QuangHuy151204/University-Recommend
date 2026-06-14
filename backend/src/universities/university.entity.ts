import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UniversityMajor } from '../majors/university-major.entity';

@Entity('universities')
export class University {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 50, nullable: true })
  short_name: string;

  @Column({ length: 50, default: 'public' }) // public | private
  type: string;

  @Column({ length: 100, nullable: true })
  location: string; // Hà Nội, TP.HCM, Đà Nẵng...

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  website: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  tuition_fee_min: number; // VND/năm

  @Column({ nullable: true })
  tuition_fee_max: number;

  /** Mô tả học phí/tín chỉ (text từ nguồn trường); hiển thị trang chi tiết trường. */
  @Column({ type: 'text', nullable: true })
  tuition_per_credit_note: string;

  @Column({ nullable: true })
  logo_url: string;

  @Column({ nullable: true })
  established_year: number;

  @Column({ nullable: true })
  source_url: string;

  @OneToMany(() => UniversityMajor, (um) => um.university)
  universityMajors: UniversityMajor[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
