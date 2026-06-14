import { University } from '../universities/university.entity';
import { Major } from './major.entity';
import { CutoffScore } from '../cutoff-scores/cutoff-score.entity';
export declare class UniversityMajor {
    id: number;
    university: University;
    major: Major;
    training_program: string;
    duration: number;
    tuition_fee: number;
    quota: number;
    admission_methods: string;
    cutoffScores: CutoffScore[];
    created_at: Date;
}
