import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UniversityMajor } from './university-major.entity';
import { MajorGroupAssignment } from './major-group-assignment.entity';

@Entity('majors')
export class Major {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 20, nullable: true })
  code: string; // Mã ngành

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  career_orientation: string; // Cơ hội nghề nghiệp

  @Column({ type: 'text', nullable: true })
  required_skills: string; // Kỹ năng cần có

  @Column({ length: 100, nullable: true })
  field_group: string; // Nhóm ngành chính (hiển thị / tương thích cũ)

  /** Tags tra cứu chatbot / recommendation — không dùng tên nhóm. */
  @Column('text', { array: true, default: '{}' })
  tags: string[];

  @OneToMany(() => UniversityMajor, (um: UniversityMajor) => um.major)
  universityMajors: UniversityMajor[];

  @OneToMany(() => MajorGroupAssignment, (a) => a.major)
  groupAssignments: MajorGroupAssignment[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
