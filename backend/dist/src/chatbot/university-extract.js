"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUniversityNameList = parseUniversityNameList;
exports.extractUniversitiesFromMessage = extractUniversitiesFromMessage;
exports.collectUniversityNames = collectUniversityNames;
const chatbot_intent_rules_1 = require("./chatbot-intent-rules");
function normalizeMatchText(input) {
    return input
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{M}/gu, '')
        .replace(/\s+/g, ' ')
        .trim();
}
const MESSAGE_UNIVERSITY_ACRONYMS = [
    'USTH',
    'HUST',
    'NEU',
    'FTU',
    'PTIT',
    'HAUI',
    'FPT',
    'HNUE',
    'VNU',
    'HMU',
    'HUSTECH',
    'UET',
];
const MESSAGE_UNIVERSITY_NICKNAMES = [
    'Bách Khoa Hà Nội',
    'Bách Khoa',
    'Kinh tế Quốc dân',
    'Ngoại thương',
    'Học viện Bưu chính',
    'Học viện Ngân hàng',
    'Thương mại',
    'Thăng Long',
    'Phenikaa',
    'Ngân hàng',
    'Luật Hà Nội',
    'Y Hà Nội',
    'Y dược',
];
function parseUniversityNameList(value) {
    if (!value?.trim())
        return [];
    return value
        .split(/[,;]|(?:\s+và\s+)|(?:\s+với\s+)/i)
        .map((s) => s.trim())
        .filter((s) => s.length >= 2);
}
function extractUniversitiesFromMessage(msg) {
    const found = [];
    const push = (name) => {
        const key = normalizeMatchText(name);
        if (!found.some((f) => normalizeMatchText(f) === key)) {
            found.push(name);
        }
    };
    const paren = (0, chatbot_intent_rules_1.extractParentheticalAcronym)(msg);
    if (paren)
        push(paren);
    const upper = msg.toUpperCase();
    for (const code of MESSAGE_UNIVERSITY_ACRONYMS) {
        const re = new RegExp(`\\b${code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (re.test(upper))
            push(code);
    }
    const normalized = normalizeMatchText(msg);
    const nickSorted = [...MESSAGE_UNIVERSITY_NICKNAMES].sort((a, b) => b.length - a.length);
    for (const nick of nickSorted) {
        if (normalized.includes(normalizeMatchText(nick)))
            push(nick);
    }
    const explicit = (0, chatbot_intent_rules_1.extractExplicitUniversityFromMessage)(msg);
    if (explicit)
        push(explicit);
    return found;
}
function collectUniversityNames(msg, universityNameEntity) {
    const names = [];
    const push = (name) => {
        const key = normalizeMatchText(name);
        if (!names.some((n) => normalizeMatchText(n) === key))
            names.push(name);
    };
    for (const n of extractUniversitiesFromMessage(msg))
        push(n);
    for (const n of parseUniversityNameList(universityNameEntity))
        push(n);
    return names;
}
//# sourceMappingURL=university-extract.js.map