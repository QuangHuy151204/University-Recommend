"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const major_normalization_1 = require("../src/majors/major-normalization");
const csvPath = path.resolve(__dirname, '../../data/majors-khac-2026-06-08.csv');
const lines = fs
    .readFileSync(csvPath, 'utf8')
    .split(/\r?\n/)
    .slice(1)
    .filter(Boolean);
const stillKhac = [];
const fixed = [];
for (const line of lines) {
    const match = line.match(/^(\d+),"((?:[^"]|"")*)",/);
    if (!match)
        continue;
    const name = match[2].replace(/""/g, '"');
    const group = (0, major_normalization_1.canonicalFieldGroup)(name, 'Khác');
    if (group === 'Khác') {
        stillKhac.push(name);
    }
    else {
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
//# sourceMappingURL=analyze-khac-majors.js.map