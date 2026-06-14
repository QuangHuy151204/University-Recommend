"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HanoiOnlyDataScope1751000000000 = void 0;
class HanoiOnlyDataScope1751000000000 {
    name = 'HanoiOnlyDataScope1751000000000';
    async up(queryRunner) {
        await queryRunner.query(`
      UPDATE universities
      SET location = 'Hà Nội'
      WHERE location IS NULL OR TRIM(location) = ''
    `);
        await queryRunner.query(`
      DELETE FROM universities
      WHERE location NOT ILIKE '%Hà Nội%'
        AND location NOT ILIKE '%Ha Noi%'
        AND location NOT ILIKE '%hanoi%'
    `);
        await queryRunner.query(`
      UPDATE student_profiles
      SET preferred_location = 'Hà Nội'
      WHERE preferred_location IS NULL
         OR TRIM(preferred_location) = ''
         OR (
           preferred_location NOT ILIKE '%Hà Nội%'
           AND preferred_location NOT ILIKE '%Ha Noi%'
           AND preferred_location NOT ILIKE '%hanoi%'
         )
    `);
    }
    async down() {
    }
}
exports.HanoiOnlyDataScope1751000000000 = HanoiOnlyDataScope1751000000000;
//# sourceMappingURL=1751000000000-HanoiOnlyDataScope.js.map