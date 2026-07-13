// @file: Resolves major names and interest phrases from free-text chat messages.
/** Viết tắt / tên rút gọn → chuỗi tra ILIKE majors.name */
export const MAJOR_SEARCH_ALIASES: Record<string, string> = {
  cntt: 'Công nghệ thông tin',
  it: 'Công nghệ thông tin',
  ai: 'Trí tuệ nhân tạo',
  'tri tue nhan tao': 'Trí tuệ nhân tạo',
  'vu tru': 'Khoa học Vũ trụ',
  'khoa hoc vu tru': 'Khoa học Vũ trụ',
  've tinh': 'Vệ tinh',
  marketing: 'Marketing',
  luat: 'Luật',
  'ke toan': 'Kế toán',
  'co khi': 'Cơ khí',
  'tai chinh ngan hang': 'Tài chính ngân hàng',
  'bao chi': 'Báo chí',
  'ngoai thuong': 'Ngoại thương',
  'quan tri kinh doanh': 'Quản trị kinh doanh',
  'an toan thong tin': 'An toàn thông tin',
  'du lich': 'Du lịch',
  logistics: 'Logistics',
  'hang khong': 'Hàng không',
  'hang khong vu tru': 'Hàng không',
  'y da khoa': 'Y đa khoa',
  'y khoa': 'Y đa khoa',
  y: 'Y đa khoa',
  'dien tu': 'Điện tử',
  'kien truc': 'Kiến trúc',
  'su pham toan': 'Sư phạm Toán học',
  'sư phạm toán': 'Sư phạm Toán học',
  duoc: 'Dược',
  'y duoc': 'Dược',
  'cong nghe thong tin': 'Công nghệ thông tin',
  'công nghệ thông tin': 'Công nghệ thông tin',
};

function normalizeMatchText(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Trích cụm sau "ngành …" — giữ dấu tiếng Việt để ILIKE khớp DB (PostgreSQL không bỏ dấu). */
export function extractMajorFragment(msg: string): string | null {
  const match = msg.match(
    /(?:ngành|nganh|chuyên ngành|chuyen nganh)\s+(.+?)(?:\s+(?:trường|truong|cua|cu|ủa|ở|o|tại|tai|năm|nam|lấy|lay|bao|theo|thì|thi|à|a|ạ|\?)|$)/iu,
  );
  if (!match) return null;
  const fragment = match[1]
    .replace(/\b(hà nội|ha noi|ở hà nội|o ha noi)\b/giu, '')
    .replace(/\s+(cua|cu|của)\s+.+$/iu, '')
    .trim();
  if (fragment.length >= 3) return fragment;
  return isKnownMajorAlias(fragment) ? fragment : null;
}

/** Chuẩn hoá cụm ngành tra DB: alias → giữ nguyên nếu đã có dấu. */
export function canonicalizeMajorSearchTerm(term: string): string {
  const fromAlias = resolveAliasFromNormalizedText(normalizeMatchText(term));
  return fromAlias ?? term.trim();
}

function isKnownMajorAlias(fragment: string): boolean {
  const norm = normalizeMatchText(fragment);
  return Object.keys(MAJOR_SEARCH_ALIASES).some(
    (alias) => normalizeMatchText(alias) === norm,
  );
}

/** Tránh alias ngắn (vd. "ai") khớp nhầm trong "đại học" → "dai hoc". */
function aliasMatchesInText(normAlias: string, normalized: string): boolean {
  if (normAlias.length <= 3) {
    const escaped = normAlias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(?:^|[\\s,.;:!?()])${escaped}(?:$|[\\s,.;:!?()])`).test(
      ` ${normalized} `,
    );
  }
  return normalized.includes(normAlias);
}

function resolveAliasFromNormalizedText(normalized: string): string | null {
  const entries = Object.entries(MAJOR_SEARCH_ALIASES).sort(
    ([a], [b]) => normalizeMatchText(b).length - normalizeMatchText(a).length,
  );
  for (const [alias, term] of entries) {
    const normAlias = normalizeMatchText(alias);
    if (normAlias.length >= 2 && aliasMatchesInText(normAlias, normalized)) {
      return term;
    }
  }
  return null;
}

function resolveFromMajorFragment(msg: string): string | null {
  const fragment = extractMajorFragment(msg);
  if (!fragment) return null;
  return canonicalizeMajorSearchTerm(fragment);
}

/** Chuỗi tra DB: cụm sau "ngành" → alias toàn câu → null. */
export function resolveMajorSearchTerm(msg: string): string | null {
  const fromFragment = resolveFromMajorFragment(msg);
  if (fromFragment) return fromFragment;

  const normalized = normalizeMatchText(msg);
  return resolveAliasFromNormalizedText(normalized);
}

/**
 * Lấy cụm ngành đầy đủ từ câu hỏi hoặc entity (Ollama).
 * Ưu tiên alias/fragment trong message — tránh entity LLM rút gọn (vd. "toán") ghi đè "sư phạm toán".
 */
export function pickMajorInterestPhrase(
  msg: string,
  entityMajor?: string | null,
): string {
  const fromMessage = resolveMajorSearchTerm(msg);
  if (fromMessage) return fromMessage;

  const fragment = extractMajorFragment(msg);
  if (fragment) {
    const fromFragmentAlias = resolveAliasFromNormalizedText(
      normalizeMatchText(fragment),
    );
    if (fromFragmentAlias) return fromFragmentAlias;
    return fragment;
  }

  const entity = entityMajor?.trim();
  if (entity) {
    const fromEntityAlias = resolveAliasFromNormalizedText(
      normalizeMatchText(entity),
    );
    if (fromEntityAlias) return fromEntityAlias;
    return entity;
  }
  return '';
}
