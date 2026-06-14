import * as fs from 'fs';
import * as path from 'path';

type MajorRow = { id: number; name: string; code: string | null; field_group: string | null };

const data = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../../data/majors-full-export.json'), 'utf8'),
) as MajorRow[];

const fg: Record<string, number> = {};
const codes: Record<string, number> = {};
let withCode = 0;

for (const m of data) {
  const key = m.field_group || 'null';
  fg[key] = (fg[key] ?? 0) + 1;
  if (m.code) {
    withCode++;
    const p = m.code.slice(0, 3);
    codes[p] = (codes[p] ?? 0) + 1;
  }
}

console.log('withCode', withCode);
console.log('field_groups', JSON.stringify(fg, null, 2));
console.log(
  'top codes',
  Object.entries(codes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30),
);
