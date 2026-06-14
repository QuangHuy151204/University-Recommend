import { UniversityMajor } from './university-major.entity';
import { MajorGroupAssignment } from './major-group-assignment.entity';
export declare class Major {
    id: number;
    name: string;
    code: string;
    description: string;
    career_orientation: string;
    required_skills: string;
    field_group: string;
    tags: string[];
    universityMajors: UniversityMajor[];
    groupAssignments: MajorGroupAssignment[];
    created_at: Date;
    updated_at: Date;
}
