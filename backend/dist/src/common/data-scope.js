"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATA_SCOPE_LOCATION = void 0;
exports.isHanoiLocation = isHanoiLocation;
exports.DATA_SCOPE_LOCATION = 'Hà Nội';
function isHanoiLocation(location) {
    if (!location?.trim())
        return false;
    const lower = location.toLowerCase();
    return (lower.includes('hà nội') ||
        lower.includes('ha noi') ||
        lower.includes('hanoi'));
}
//# sourceMappingURL=data-scope.js.map