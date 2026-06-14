export declare enum UniversityType {
    PUBLIC = "public",
    PRIVATE = "private",
    INTERNATIONAL = "international"
}
export declare class CreateUniversityDto {
    name: string;
    short_name?: string;
    type?: UniversityType;
    location?: string;
    address?: string;
    website?: string;
    description?: string;
    tuition_fee_min?: number;
    tuition_fee_max?: number;
    logo_url?: string;
    established_year?: number;
}
export declare class UpdateUniversityDto extends CreateUniversityDto {
}
export declare class QueryUniversityDto {
    search?: string;
    location?: string;
    type?: UniversityType;
    max_tuition?: number;
    subject_combination?: string;
    min_score?: number;
    major_id?: number;
    page?: number;
    limit?: number;
}
