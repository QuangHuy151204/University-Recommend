"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.majorTagSearchWhere = majorTagSearchWhere;
exports.normalizeMajorMatchText = normalizeMajorMatchText;
exports.majorMatchesInterestTerms = majorMatchesInterestTerms;
function majorTagSearchWhere(alias = 'm') {
    return `(${alias}.name ILIKE :mq OR EXISTS (SELECT 1 FROM unnest(${alias}.tags) t WHERE t ILIKE :mq))`;
}
function normalizeMajorMatchText(input) {
    return input
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{M}/gu, '')
        .replace(/\s+/g, ' ')
        .trim();
}
const AMBIGUOUS_SINGLE_TOKENS = new Set([
    'toan',
    'pham',
    'su',
    'ke',
    'an',
    'bo',
    'dai',
    'tin',
    'hoc',
    'cong',
    'nghe',
    'thuc',
    'lam',
    'vat',
    'ly',
]);
function significantWords(phrase) {
    return normalizeMajorMatchText(phrase)
        .split(/\s+/)
        .filter((w) => w.length >= 2);
}
function matchesMultiWordPhrase(normName, normTags, phrase) {
    const normPhrase = normalizeMajorMatchText(phrase);
    if (normName.includes(normPhrase)) {
        return true;
    }
    const words = significantWords(phrase);
    if (words.length < 2)
        return false;
    const hasPedagogy = words.some((w) => w === 'pham' || w === 'su');
    const hasMath = words.some((w) => w === 'toan');
    if (hasPedagogy && hasMath) {
        return (normName.includes('pham toan') ||
            normName.includes('su pham toan') ||
            /\b(sp|su pham)\s+toan\b/.test(normName) ||
            normTags.includes('su pham toan') ||
            normTags.includes('pham toan'));
    }
    const consecutive = words.length >= 3 ? words.slice(-2).join(' ') : words.join(' ');
    return normName.includes(consecutive);
}
function matchesSingleWordPhrase(normName, normPhrase) {
    if (normPhrase.includes(' ') || normPhrase.length < 2)
        return false;
    if (AMBIGUOUS_SINGLE_TOKENS.has(normPhrase))
        return false;
    return normName === normPhrase || normName.includes(normPhrase);
}
function majorMatchesInterestTerms(majorName, tags, _careerOrientation, terms) {
    const normName = normalizeMajorMatchText(majorName);
    const normTags = normalizeMajorMatchText((tags || []).join(' '));
    for (const phrase of terms) {
        const normPhrase = normalizeMajorMatchText(phrase);
        if (normPhrase.length < 2)
            continue;
        if (normName.includes(normPhrase)) {
            return {
                matched: true,
                score: 30,
                reason: `Ngành ${majorName} phù hợp với sở thích "${phrase}"`,
            };
        }
        if (significantWords(normPhrase).length >= 2) {
            if (matchesMultiWordPhrase(normName, normTags, phrase)) {
                return {
                    matched: true,
                    score: 20,
                    reason: `Ngành ${majorName} liên quan đến "${phrase}"`,
                };
            }
            continue;
        }
        if (matchesSingleWordPhrase(normName, normPhrase)) {
            return {
                matched: true,
                score: 20,
                reason: `Ngành ${majorName} phù hợp với sở thích "${phrase}"`,
            };
        }
        if (normPhrase.length >= 5 && normTags.includes(normPhrase)) {
            return {
                matched: true,
                score: 25,
                reason: `Ngành ${majorName} phù hợp với sở thích "${phrase}"`,
            };
        }
    }
    return { matched: false, score: 0 };
}
//# sourceMappingURL=major-interest-match.js.map