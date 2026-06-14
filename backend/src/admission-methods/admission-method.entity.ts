import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('admission_methods')
export class AdmissionMethod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  method_code: string;

  @Column({ length: 255 })
  method_name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;
}
