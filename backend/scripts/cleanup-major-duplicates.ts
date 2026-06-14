/**
 * Cleanup canonical duplicate majors and downstream links.
 *
 * Run:
 *   npm run cleanup:majors             # preview only
 *   npm run cleanup:majors -- --apply  # apply changes
 */
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { canonicalMajorName } from '../src/majors/major-normalization';
import {
  cutoffDedupeKey,
  pickLongerText,
  pickMajorKeeper,
  pickUniversityMajorKeeper,
} from '../src/majors/duplicate-cleanup';

dotenv.config();

type MajorRow = {
  id: number;
  name: string;
  code: string | null;
  field_group: string | null;
};

type UniversityMajorRow = {
  id: number;
  university_id: number;
  major_id: number;
  training_program: string | null;
  duration: number | null;
  tuition_fee: number | null;
  quota: number | null;
  admission_methods: string | null;
};

const APPLY = process.argv.includes('--apply');

async function main(): Promise<void> {
  const ds = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'university_recommend',
  });
  await ds.initialize();
  const qr = ds.createQueryRunner();
  await qr.connect();
  await qr.startTransaction();

  try {
    const majors = (await qr.query(`
      SELECT id, name, code, field_group
      FROM majors
      ORDER BY id ASC
    `)) as MajorRow[];
    const linkCountsRows = (await qr.query(`
      SELECT major_id, COUNT(*)::text AS links
      FROM university_majors
      GROUP BY major_id
    `)) as Array<{ major_id: number; links: string }>;
    const linksByMajor = new Map<number, number>(
      linkCountsRows.map((r) => [r.major_id, Number(r.links)]),
    );

    const byCanonical = new Map<string, MajorRow[]>();
    for (const m of majors) {
      const key = canonicalMajorName(m.name);
      const bucket = byCanonical.get(key) ?? [];
      bucket.push(m);
      byCanonical.set(key, bucket);
    }

    const duplicateGroups = [...byCanonical.entries()].filter(([, arr]) => arr.length > 1);
    if (duplicateGroups.length === 0) {
      console.log('✅ Không phát hiện major canonical trùng.');
      await qr.rollbackTransaction();
      await qr.release();
      await ds.destroy();
      return;
    }

    let majorsMerged = 0;
    let universityMajorsMerged = 0;
    let cutoffDeduped = 0;

    for (const [canonical, group] of duplicateGroups) {
      const decorated = group.map((m) => ({
        ...m,
        links: linksByMajor.get(m.id) ?? 0,
      }));
      const keeper = pickMajorKeeper(decorated);
      const removeIds = group.filter((m) => m.id !== keeper.id).map((m) => m.id);

      console.log(
        `• Canonical "${canonical}" => keep major #${keeper.id}, merge [${removeIds.join(', ')}]`,
      );
      majorsMerged += removeIds.length;

      if (!APPLY) continue;

      const fallbackCode = decorated
        .map((m) => m.code)
        .find((code) => typeof code === 'string' && code.trim().length > 0);
      const fallbackFieldGroup = decorated
        .map((m) => m.field_group)
        .find((fg) => typeof fg === 'string' && fg.trim().length > 0);

      await qr.query(
        `UPDATE majors
         SET code = COALESCE(code, $1),
             field_group = COALESCE(field_group, $2),
             updated_at = NOW()
         WHERE id = $3`,
        [fallbackCode ?? null, fallbackFieldGroup ?? null, keeper.id],
      );

      await qr.query(`UPDATE university_majors SET major_id = $1 WHERE major_id = ANY($2::int[])`, [
        keeper.id,
        removeIds,
      ]);
      await qr.query(`DELETE FROM majors WHERE id = ANY($1::int[])`, [removeIds]);
    }

    const umRows = (await qr.query(`
      SELECT id, university_id, major_id, training_program, duration, tuition_fee, quota, admission_methods
      FROM university_majors
      ORDER BY id ASC
    `)) as UniversityMajorRow[];
    const umCutoffCountRows = (await qr.query(`
      SELECT university_major_id, COUNT(*)::text AS count
      FROM cutoff_scores
      GROUP BY university_major_id
    `)) as Array<{ university_major_id: number; count: string }>;
    const umCutoffCount = new Map<number, number>(
      umCutoffCountRows.map((r) => [r.university_major_id, Number(r.count)]),
    );

    const umByKey = new Map<string, UniversityMajorRow[]>();
    for (const um of umRows) {
      const key = `${um.university_id}|${um.major_id}`;
      const list = umByKey.get(key) ?? [];
      list.push(um);
      umByKey.set(key, list);
    }

    const umDuplicateGroups = [...umByKey.entries()].filter(([, rows]) => rows.length > 1);
    for (const [key, group] of umDuplicateGroups) {
      const decorated = group.map((um) => ({
        ...um,
        cutoff_count: umCutoffCount.get(um.id) ?? 0,
      }));
      const keeper = pickUniversityMajorKeeper(decorated);
      const dupes = group.filter((um) => um.id !== keeper.id);
      const dupeIds = dupes.map((um) => um.id);

      console.log(
        `• University-major "${key}" => keep #${keeper.id}, merge [${dupeIds.join(', ')}]`,
      );
      universityMajorsMerged += dupeIds.length;

      if (!APPLY) continue;

      let mergedProgram = keeper.training_program;
      let mergedDuration = keeper.duration;
      let mergedTuition = keeper.tuition_fee;
      let mergedQuota = keeper.quota;
      let mergedAdmissionMethods = keeper.admission_methods;
      for (const d of dupes) {
        mergedProgram = pickLongerText(mergedProgram, d.training_program);
        mergedDuration ??= d.duration;
        mergedTuition ??= d.tuition_fee;
        mergedQuota ??= d.quota;
        mergedAdmissionMethods = pickLongerText(mergedAdmissionMethods, d.admission_methods);
      }

      await qr.query(
        `UPDATE university_majors
         SET training_program = $1,
             duration = $2,
             tuition_fee = $3,
             quota = $4,
             admission_methods = $5
         WHERE id = $6`,
        [
          mergedProgram,
          mergedDuration,
          mergedTuition,
          mergedQuota,
          mergedAdmissionMethods,
          keeper.id,
        ],
      );

      await qr.query(
        `UPDATE cutoff_scores
         SET university_major_id = $1
         WHERE university_major_id = ANY($2::int[])`,
        [keeper.id, dupeIds],
      );

      const cutoffRows = (await qr.query(
        `SELECT id, year, score, admission_method, subject_combination, note
         FROM cutoff_scores
         WHERE university_major_id = $1
         ORDER BY id DESC`,
        [keeper.id],
      )) as Array<{
        id: number;
        year: number;
        score: number;
        admission_method: string | null;
        subject_combination: string | null;
        note: string | null;
      }>;

      const seen = new Set<string>();
      for (const c of cutoffRows) {
        const dedupeKey = cutoffDedupeKey(c);
        if (seen.has(dedupeKey)) {
          await qr.query(`DELETE FROM cutoff_scores WHERE id = $1`, [c.id]);
          cutoffDeduped++;
          continue;
        }
        seen.add(dedupeKey);
      }

      await qr.query(`DELETE FROM university_majors WHERE id = ANY($1::int[])`, [dupeIds]);
    }

    if (APPLY) {
      await qr.commitTransaction();
      console.log('\n✅ Cleanup applied.');
    } else {
      await qr.rollbackTransaction();
      console.log('\nℹ️ Preview only (không ghi DB). Chạy lại với --apply để áp dụng.');
    }

    console.log(`- Major merged: ${majorsMerged}`);
    console.log(`- University-major merged: ${universityMajorsMerged}`);
    console.log(`- Cutoff duplicate removed: ${cutoffDeduped}`);
  } catch (error) {
    await qr.rollbackTransaction();
    throw error;
  } finally {
    await qr.release();
    await ds.destroy();
  }
}

main().catch((err: unknown) => {
  console.error('❌ cleanup:majors failed', err);
  process.exit(1);
});
