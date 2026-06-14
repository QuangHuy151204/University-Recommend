import { UniversityMajor } from '../majors/university-major.entity';
export declare class CutoffScore {
    id: number;
    universityMajor: UniversityMajor;
    year: number;
    score: number;
    admission_method: string;
    subject_combination: string;
    note: string;
    created_at: Date;
}
