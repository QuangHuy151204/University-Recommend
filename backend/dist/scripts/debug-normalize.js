"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const major_normalization_1 = require("../src/majors/major-normalization");
function normalizeText(input) {
    return input
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{M}/gu, '')
        .replace(/\s+/g, ' ')
        .trim();
}
const samples = [
    'An toàn, Vệ sinh lao động',
    'Công nghệ Dệt - May',
    'Điều dưỡng chương trình tiên tiến',
    'Địa chất học',
    'Quản trị doanh nghiệp',
];
for (const name of samples) {
    const normalized = normalizeText(['Khác', name].join(' '));
    console.log('\n---', name);
    console.log('normalized:', normalized);
    console.log('canonical:', (0, major_normalization_1.canonicalFieldGroup)(name, 'Khác'));
    for (const rule of major_normalization_1.FIELD_GROUP_RULES) {
        for (const kw of rule.keywords) {
            if (normalized.includes(kw)) {
                console.log('  MATCH', rule.group, '<-', kw);
            }
        }
    }
}
//# sourceMappingURL=debug-normalize.js.map