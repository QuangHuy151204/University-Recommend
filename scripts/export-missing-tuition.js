/**
 * Xuất danh sách trường thiếu học phí từ Excel master.
 * Chạy: node scripts/export-missing-tuition.js
 */

const fs = require('fs');
const path = require('path');
const XLSX = require(path.join(__dirname, '..', 'backend', 'node_modules', 'xlsx'));

const root = path.resolve(__dirname, '..');
const excelPath = path.join(root, 'mau_du_lieu_truong_dai_hoc_5_sheets.xlsx');
const wb = XLSX.readFile(excelPath);

const uniRows = XLSX.utils.sheet_to_json(wb.Sheets['universities_hanoi'], {
  defval: null,
});
const umRows = XLSX.utils.sheet_to_json(wb.Sheets['university_majors'], {
  defval: null,
});

const feeByShort = new Map();
for (const r of umRows) {
  const short = String(r.university_short_name || '').trim();
  const fee = Number(r.tuition_fee);
  if (!short || !Number.isFinite(fee) || fee <= 0) continue;
  const cur = feeByShort.get(short) || { min: fee, max: fee, count: 0 };
  cur.min = Math.min(cur.min, fee);
  cur.max = Math.max(cur.max, fee);
  cur.count++;
  feeByShort.set(short, cur);
}

function hasUniSheetFee(r) {
  const min = Number(r.tuition_fee_min);
  const max = Number(r.tuition_fee_max);
  return (Number.isFinite(min) && min > 0) || (Number.isFinite(max) && max > 0);
}

const missing = [];
const hasFee = [];
const uniShorts = new Set();

for (const r of uniRows) {
  const short = String(r.short_name || '').trim();
  if (!short) continue;
  uniShorts.add(short);

  const fromUni = hasUniSheetFee(r);
  const fromUm = feeByShort.get(short);
  const row = {
    short_name: short,
    name: r.name || '',
    type: r.type || '',
    location: r.location || '',
    tuition_fee_min_vnd: fromUm ? fromUm.min : fromUni ? r.tuition_fee_min : '',
    tuition_fee_max_vnd: fromUm ? fromUm.max : fromUni ? r.tuition_fee_max : '',
    majors_with_fee_in_excel: fromUm ? fromUm.count : 0,
    status: fromUm || fromUni ? 'co_du_lieu' : 'thieu_hoc_phi',
    ghi_chu_dien_hoc_phi:
      fromUm || fromUni
        ? ''
        : 'Dien hoc phi uoc tinh/nam (VND) vao 2 cot min/max',
  };

  if (fromUm || fromUni) hasFee.push(row);
  else missing.push(row);
}

missing.sort((a, b) => a.short_name.localeCompare(b.short_name));
hasFee.sort((a, b) => a.short_name.localeCompare(b.short_name));

const onlyUmNotInList = [];
for (const [short, info] of feeByShort) {
  if (!uniShorts.has(short)) {
    onlyUmNotInList.push({
      short_name: short,
      tuition_fee_min_vnd: info.min,
      tuition_fee_max_vnd: info.max,
      majors_with_fee_in_excel: info.count,
      ghi_chu:
        'Co trong university_majors nhung khong co trong universities_hanoi',
    });
  }
}
onlyUmNotInList.sort((a, b) => a.short_name.localeCompare(b.short_name));

const total = uniShorts.size;
const summary = [
  {
    tong_truong_hanoi: total,
    co_hoc_phi: hasFee.length,
    thieu_hoc_phi: missing.length,
    ty_le_thieu_percent: Number(((missing.length / total) * 100).toFixed(1)),
    truong_co_phi_trong_um_nhung_khong_trong_danh_sach_hn:
      onlyUmNotInList.length,
    ngay_xuat: new Date().toISOString().slice(0, 10),
  },
];

const xlsxOut = path.join(root, 'danh_sach_truong_thieu_hoc_phi.xlsx');
const wbOut = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wbOut, XLSX.utils.json_to_sheet(summary), 'tong_hop');
XLSX.utils.book_append_sheet(
  wbOut,
  XLSX.utils.json_to_sheet(missing),
  'thieu_hoc_phi',
);
XLSX.utils.book_append_sheet(
  wbOut,
  XLSX.utils.json_to_sheet(hasFee),
  'da_co_hoc_phi',
);
XLSX.utils.book_append_sheet(
  wbOut,
  XLSX.utils.json_to_sheet(onlyUmNotInList),
  'phi_ngoai_danh_sach_hn',
);
XLSX.writeFile(wbOut, xlsxOut);

const csvOut = path.join(root, 'danh_sach_truong_thieu_hoc_phi.csv');
const csvLines = [
  Object.keys(missing[0] || {}).join(','),
  ...missing.map((r) =>
    Object.values(r)
      .map((v) => {
        const s = String(v ?? '');
        return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
      })
      .join(','),
  ),
];
fs.writeFileSync(csvOut, '\uFEFF' + csvLines.join('\n'), 'utf8');

console.log('Da xuat:');
console.log(' -', xlsxOut);
console.log(' -', csvOut);
console.log('Thieu hoc phi:', missing.length, '/', total);
