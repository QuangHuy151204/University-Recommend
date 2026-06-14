"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniversityTuitionPerCreditNote1750000000000 = void 0;
class UniversityTuitionPerCreditNote1750000000000 {
    name = 'UniversityTuitionPerCreditNote1750000000000';
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "universities"
      ADD COLUMN IF NOT EXISTS "tuition_per_credit_note" text
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "universities"
      DROP COLUMN IF EXISTS "tuition_per_credit_note"
    `);
    }
}
exports.UniversityTuitionPerCreditNote1750000000000 = UniversityTuitionPerCreditNote1750000000000;
//# sourceMappingURL=1750000000000-UniversityTuitionPerCreditNote.js.map