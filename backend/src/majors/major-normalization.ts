import { classifyMajor } from './major-classification';
import { KHAC_GROUP_NAME, MAJOR_GROUPS } from './major-groups-catalog';

export { MAJOR_GROUPS, MAJOR_GROUP_BY_ID } from './major-groups-catalog';
export {
  classifyMajor,
  majorBelongsToGroup,
  type MajorClassification,
} from './major-classification';

function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .replace(/đ/g, 'd')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const GROUP_SLUG_ALIASES: Record<string, string> = {
  'cong-nghe': 'cong-nghe-thong-tin',
  'kinh-te': 'kinh-te-kinh-doanh',
  'ky-thuat': 'ky-thuat-cong-nghiep',
  'y-duoc': 'y-duoc-suc-khoe',
  'y-te': 'y-duoc-suc-khoe',
};

export function normalizeGroupSlug(slug: string): string {
  const base = slug
    .toLowerCase()
    .trim()
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return GROUP_SLUG_ALIASES[base] ?? base;
}

export function groupToSlug(groupName: string): string {
  return normalizeGroupSlug(normalizeText(groupName).replace(/\s+/g, '-'));
}

export function resolveGroupSlug(slug: string): string | null {
  const normalizedSlug = normalizeGroupSlug(slug);
  for (const group of MAJOR_GROUPS) {
    if (group.group_id === normalizedSlug) return group.group_name;
    if (groupToSlug(group.group_name) === normalizedSlug)
      return group.group_name;
  }
  if (normalizedSlug === 'khac') return KHAC_GROUP_NAME;
  return null;
}

/** Nhóm chính — tương thích API cũ (field_group). */
export function canonicalFieldGroup(
  majorName: string,
  rawFieldGroup?: string | null,
): string {
  return classifyMajor(majorName, rawFieldGroup).primary_group_name;
}

export function majorMatchesGroupSlug(
  majorName: string,
  rawFieldGroup: string | null | undefined,
  slug: string,
  storedGroupIds?: string[] | null,
): boolean {
  const normalizedSlug = normalizeGroupSlug(slug);
  if (storedGroupIds?.length) {
    return storedGroupIds.includes(normalizedSlug);
  }
  const classification = classifyMajor(majorName, rawFieldGroup);
  if (classification.group_ids.includes(normalizedSlug)) return true;
  return classification.group_names.some(
    (name) => groupToSlug(name) === normalizedSlug,
  );
}

export function canonicalMajorName(name: string): string {
  return normalizeText(name);
}

export function resolveMajorGroups(
  majorName: string,
  rawFieldGroup?: string | null,
): string[] {
  return classifyMajor(majorName, rawFieldGroup).group_names;
}

export function resolveMajorTags(
  majorName: string,
  rawFieldGroup?: string | null,
): string[] {
  return classifyMajor(majorName, rawFieldGroup).tags;
}
