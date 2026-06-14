"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentProfilePreferredMethod1760000000001 = void 0;
class StudentProfilePreferredMethod1760000000001 {
    name = 'StudentProfilePreferredMethod1760000000001';
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "student_profiles"
      ADD COLUMN IF NOT EXISTS "preferred_method_code" varchar DEFAULT 'THPT'
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "student_profiles"
      DROP COLUMN IF EXISTS "preferred_method_code"
    `);
    }
}
exports.StudentProfilePreferredMethod1760000000001 = StudentProfilePreferredMethod1760000000001;
//# sourceMappingURL=1760000000001-StudentProfilePreferredMethod.js.map