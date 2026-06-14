export const ADMIN_TABS = [
    { id: 'dashboard', label: 'Tổng quan', title: 'Tổng quan hệ thống' },
    { id: 'universities', label: 'Trường', title: 'Quản lý trường đại học' },
    { id: 'majors', label: 'Ngành', title: 'Quản lý ngành học' },
    { id: 'university-majors', label: 'Trường–ngành', title: 'Liên kết trường – ngành' },
    { id: 'cutoff-scores', label: 'Điểm chuẩn', title: 'Quản lý điểm chuẩn' },
    { id: 'admission-methods', label: 'PT xét tuyển', title: 'Phương thức xét tuyển' },
] as const;

export type AdminTabId = (typeof ADMIN_TABS)[number]['id'];

const LEGACY_PATH_TAB: Record<string, AdminTabId> = {
    '/admin/universities': 'universities',
    '/admin/majors': 'majors',
    '/admin/university-majors': 'university-majors',
    '/admin/cutoff-scores': 'cutoff-scores',
    '/admin/admission-methods': 'admission-methods',
};

export function adminTabHref(tab: AdminTabId): string {
    return tab === 'dashboard' ? '/admin' : `/admin?tab=${tab}`;
}

export function resolveAdminTab(
    pathname: string | null | undefined,
    tabParam: string | null | undefined,
): AdminTabId {
    if (pathname && LEGACY_PATH_TAB[pathname]) {
        return LEGACY_PATH_TAB[pathname];
    }
    const match = ADMIN_TABS.find((t) => t.id === tabParam);
    return match?.id ?? 'dashboard';
}

export function adminTabTitle(tab: AdminTabId): string {
    return ADMIN_TABS.find((t) => t.id === tab)?.title ?? 'Quản trị dữ liệu';
}
