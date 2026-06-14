import * as fs from 'fs';
import * as path from 'path';
import { canonicalFieldGroup } from '../src/majors/major-normalization';

const csvPath = path.resolve(__dirname, '../../data/majors-khac-2026-06-08.csv');
const lines = fs
  .readFileSync(csvPath, 'utf8')
  .split(/\r?\n/)
  .slice(1)
  .filter(Boolean);

const stillKhac: string[] = [];
const fixed: Array<{ name: string; group: string }> = [];

for (const line of lines) {
  const match = line.match(/^(\d+),"((?:[^"]|"")*)",/);
  if (!match) continue;
  const name = match[2].replace(/""/g, '"');
  const group = canonicalFieldGroup(name, 'Khác');
  if (group === 'Khác') {
    stillKhac.push(name);
  } else {
    fixed.push({ name, group });
  }
}

console.log(`Fixed by current rules: ${fixed.length}/${lines.length}`);
for (const f of fixed) {
  console.log(`  ${f.name} -> ${f.group}`);
}
console.log(`\nStill Khác: ${stillKhac.length}/${lines.length}`);
for (const name of stillKhac) {
  console.log(`  - ${name}`);
}
