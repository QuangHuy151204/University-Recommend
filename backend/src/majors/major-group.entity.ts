import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { MajorGroupAssignment } from './major-group-assignment.entity';

@Entity('major_groups')
export class MajorGroup {
  @PrimaryColumn({ length: 64 })
  group_id: string;

  @Column({ length: 128 })
  group_name: string;

  @Column({ type: 'text' })
  description: string;

  @OneToMany(() => MajorGroupAssignment, (a) => a.group)
  assignments: MajorGroupAssignment[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
