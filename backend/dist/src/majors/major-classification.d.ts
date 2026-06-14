export type MajorClassification = {
    group_ids: string[];
    group_names: string[];
    primary_group_id: string;
    primary_group_name: string;
    tags: string[];
};
export declare function classifyMajor(majorName: string, rawFieldGroup?: string | null): MajorClassification;
export declare function majorBelongsToGroup(majorName: string, rawFieldGroup: string | null | undefined, groupIdOrSlug: string, storedGroupIds?: string[] | null): boolean;
