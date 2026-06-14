import { UniversityMajor } from '../majors/university-major.entity';
export declare class University {
    id: number;
    name: string;
    short_name: string;
    type: string;
    location: string;
    address: string;
    website: string;
    description: string;
    tuition_fee_min: number;
    tuition_fee_max: number;
    tuition_per_credit_note: string;
    logo_url: string;
    established_year: number;
    source_url: string;
    universityMajors: UniversityMajor[];
    created_at: Date;
    updated_at: Date;
}
