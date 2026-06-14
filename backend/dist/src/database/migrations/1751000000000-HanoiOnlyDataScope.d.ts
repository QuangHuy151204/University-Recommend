import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class HanoiOnlyDataScope1751000000000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(): Promise<void>;
}
