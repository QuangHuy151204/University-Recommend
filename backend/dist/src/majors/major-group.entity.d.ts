import { MajorGroupAssignment } from './major-group-assignment.entity';
export declare class MajorGroup {
    group_id: string;
    group_name: string;
    description: string;
    assignments: MajorGroupAssignment[];
    created_at: Date;
    updated_at: Date;
}
