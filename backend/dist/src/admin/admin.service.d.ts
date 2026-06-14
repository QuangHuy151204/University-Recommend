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
export declare class AdminService {
    private readonly universityRepo;
    private readonly majorRepo;
    private readonly cutoffRepo;
    private readonly userRepo;
    constructor(universityRepo: Repository<University>, majorRepo: Repository<Major>, cutoffRepo: Repository<CutoffScore>, userRepo: Repository<User>);
    getStats(): Promise<AdminStats>;
}
