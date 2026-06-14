"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentProfileBudgetMaxYearly1759400000000 = void 0;
class StudentProfileBudgetMaxYearly1759400000000 {
    name = 'StudentProfileBudgetMaxYearly1759400000000';
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE student_profiles
      ADD COLUMN IF NOT EXISTS budget_max_yearly integer NULL
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE student_profiles
      DROP COLUMN IF EXISTS budget_max_yearly
    `);
    }
}
exports.StudentProfileBudgetMaxYearly1759400000000 = StudentProfileBudgetMaxYearly1759400000000;
//# sourceMappingURL=1759400000000-StudentProfileBudgetMaxYearly.js.map