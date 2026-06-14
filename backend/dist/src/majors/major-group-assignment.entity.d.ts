import { Major } from './major.entity';
import { MajorGroup } from './major-group.entity';
export declare class MajorGroupAssignment {
    id: number;
    major_id: number;
    group_id: string;
    is_primary: boolean;
    major: Major;
    group: MajorGroup;
    created_at: Date;
}
