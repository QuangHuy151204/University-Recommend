import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { University } from '../universities/university.entity';
import { UniversityMajor } from '../majors/university-major.entity';

@Entity('user_favorites')
export class UserFavorite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  university_id: number;

  @Column({ nullable: true })
  university_major_id: number | null;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => University, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'university_id' })
  university: University;

  @ManyToOne(() => UniversityMajor, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'university_major_id' })
  universityMajor: UniversityMajor | null;

  @CreateDateColumn()
  created_at: Date;
}
