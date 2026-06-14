export declare class CreateUniversityMajorDto {
    university_id: number;
    major_id: number;
    training_program?: string;
    duration?: number;
    tuition_fee?: number;
    quota?: number;
    admission_methods?: string;
}
export declare class UpdateUniversityMajorDto {
    university_id?: number;
    major_id?: number;
    training_program?: string;
    duration?: number;
    tuition_fee?: number;
    quota?: number;
    admission_methods?: string;
}
export declare class QueryUniversityMajorDto {
    university_id?: number;
    major_id?: number;
    training_program?: string;
    page?: number;
    limit?: number;
}
