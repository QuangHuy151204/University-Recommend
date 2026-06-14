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
const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../data/majors-full-export.json'), 'utf8'));
const fg = {};
const codes = {};
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
console.log('top codes', Object.entries(codes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30));
//# sourceMappingURL=analyze-major-export.js.map