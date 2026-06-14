import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Major } from './major.entity';
import { MajorGroup } from './major-group.entity';

@Entity('major_group_assignments')
@Unique(['major_id', 'group_id'])
export class MajorGroupAssignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  major_id: number;

  @Column({ length: 64 })
  group_id: string;

  @Column({ default: false })
  is_primary: boolean;

  @ManyToOne(() => Major, (m) => m.groupAssignments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'major_id' })
  major: Major;

  @ManyToOne(() => MajorGroup, (g) => g.assignments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  group: MajorGroup;

  @CreateDateColumn()
  created_at: Date;
}
