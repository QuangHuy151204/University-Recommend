import type { UniversityFilterQuery } from '../src/universities/university-filter-evaluator';
export type FilterScenario = {
    id: string;
    label: string;
    query: UniversityFilterQuery;
};
export declare const API_SPOT_CHECK_IDS: readonly ["combo-a01", "score-27", "major-cntt", "major-httt", "major-luat", "a01-cntt-27", "a01-cntt-24", "b01-cntt-25", "a00-cntt-26", "a01-httt-27", "d01-luat-24", "a01-ykhoa-28", "tuition-15m-a01-25", "tuition-25m-a01-cntt-26", "a01-26", "b01-27", "c00-marketing", "a01-cntt-22"];
export declare function resolveMajorIdFromCatalog(catalog: Array<{
    id: number;
    name: string;
}>, name: string): number | undefined;
export declare function buildUniversityFilterScenarios(catalog: Array<{
    id: number;
    name: string;
}>): FilterScenario[];
