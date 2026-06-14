import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { University } from '../universities/university.entity';
import { Major } from '../majors/major.entity';
import { CutoffScore } from '../cutoff-scores/cutoff-score.entity';
import { User } from '../users/user.entity';

export interface AdminStats {
  universities: number;
  majors: number;
  cutoff_scores: number;
  users: number;
}

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(University)
    private readonly universityRepo: Repository<University>,
    @InjectRepository(Major)
    private readonly majorRepo: Repository<Major>,
    @InjectRepository(CutoffScore)
    private readonly cutoffRepo: Repository<CutoffScore>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getStats(): Promise<AdminStats> {
    const [universities, majors, cutoff_scores, users] = await Promise.all([
      this.universityRepo.count(),
      this.majorRepo.count(),
      this.cutoffRepo.count(),
      this.userRepo.count(),
    ]);
    return { universities, majors, cutoff_scores, users };
  }
}
