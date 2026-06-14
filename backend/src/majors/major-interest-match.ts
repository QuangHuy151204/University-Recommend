/** SQL fragment — tra cứu ngành theo tên hoặc tags (không dùng field_group). */

export function majorTagSearchWhere(alias = 'm'): string {
  return `(${alias}.name ILIKE :mq OR EXISTS (SELECT 1 FROM unnest(${alias}.tags) t WHERE t ILIKE :mq))`;
}

/** Chuẩn hoá để so khớp cụm từ ngành (bỏ dấu, lowercase). */

export function normalizeMajorMatchText(input: string): string {
  return input

    .toLowerCase()

    .normalize('NFD')

    .replace(/\p{M}/gu, '')

    .replace(/\s+/g, ' ')

    .trim();
}

/** Từ đơn dễ gây khớp nhầm khi tách rời (vd. "toán" trong "kế toán"). */

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

function significantWords(phrase: string): string[] {
  return normalizeMajorMatchText(phrase)
    .split(/\s+/)

    .filter((w) => w.length >= 2);
}

/**

 * Khớp cụm nhiều từ — yêu cầu chuỗi liên tiếp trong tên ngành, không tách từ rời trong tags.

 */

function matchesMultiWordPhrase(
  normName: string,

  normTags: string,

  phrase: string,
): boolean {
  const normPhrase = normalizeMajorMatchText(phrase);

  if (normName.includes(normPhrase)) {
    return true;
  }

  const words = significantWords(phrase);

  if (words.length < 2) return false;

  const hasPedagogy = words.some((w) => w === 'pham' || w === 'su');

  const hasMath = words.some((w) => w === 'toan');

  if (hasPedagogy && hasMath) {
    return (
      normName.includes('pham toan') ||
      normName.includes('su pham toan') ||
      /\b(sp|su pham)\s+toan\b/.test(normName) ||
      normTags.includes('su pham toan') ||
      normTags.includes('pham toan')
    );
  }

  const consecutive =
    words.length >= 3 ? words.slice(-2).join(' ') : words.join(' ');

  return normName.includes(consecutive);
}

/** Khớp từ/cụm đơn (CNTT, marketing, kế toán) — không dùng tags rời rạc. */

function matchesSingleWordPhrase(
  normName: string,
  normPhrase: string,
): boolean {
  if (normPhrase.includes(' ') || normPhrase.length < 2) return false;

  if (AMBIGUOUS_SINGLE_TOKENS.has(normPhrase)) return false;

  return normName === normPhrase || normName.includes(normPhrase);
}

/**

 * So khớp sở thích với tên ngành theo **cụm từ đầy đủ** (và alias đồng nghĩa đã mở rộng trước đó).

 * Không tách từ rời; không khớp qua career_orientation.

 */

export function majorMatchesInterestTerms(
  majorName: string,

  tags: string[] | null | undefined,

  _careerOrientation: string | null | undefined,

  terms: string[],
): { matched: boolean; score: number; reason?: string } {
  const normName = normalizeMajorMatchText(majorName);

  const normTags = normalizeMajorMatchText((tags || []).join(' '));

  for (const phrase of terms) {
    const normPhrase = normalizeMajorMatchText(phrase);

    if (normPhrase.length < 2) continue;

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
