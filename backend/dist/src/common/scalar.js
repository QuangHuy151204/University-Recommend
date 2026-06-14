"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scalarToString = scalarToString;
exports.parseFloatFromUnknown = parseFloatFromUnknown;
exports.parseIntFromUnknown = parseIntFromUnknown;
function scalarToString(v) {
    if (typeof v === 'string')
        return v.trim();
    if (typeof v === 'number' || typeof v === 'boolean')
        return String(v);
    return '';
}
function parseFloatFromUnknown(v) {
    if (typeof v === 'number')
        return v;
    return parseFloat(scalarToString(v));
}
function parseIntFromUnknown(v) {
    if (typeof v === 'number')
        return v;
    return parseInt(scalarToString(v), 10);
}
//# sourceMappingURL=scalar.js.map