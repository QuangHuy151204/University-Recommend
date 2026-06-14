'use client';

import { Suspense, type ComponentType } from 'react';
import { useSearchParams } from 'next/navigation';
import { resolveAdminTab, type AdminTabId } from '@/lib/admin-tabs';
import { DashboardPanel } from '@/components/admin/panels/DashboardPanel';
import { UniversitiesPanel } from '@/components/admin/panels/UniversitiesPanel';
import { MajorsPanel } from '@/components/admin/panels/MajorsPanel';
import { UniversityMajorsPanel } from '@/components/admin/panels/UniversityMajorsPanel';
import { CutoffScoresPanel } from '@/components/admin/panels/CutoffScoresPanel';
import { AdmissionMethodsPanel } from '@/components/admin/panels/AdmissionMethodsPanel';

const PANELS: Record<AdminTabId, ComponentType> = {
    dashboard: DashboardPanel,
    universities: UniversitiesPanel,
    majors: MajorsPanel,
    'university-majors': UniversityMajorsPanel,
    'cutoff-scores': CutoffScoresPanel,
    'admission-methods': AdmissionMethodsPanel,
};

function AdminTabContent() {
    const searchParams = useSearchParams();
    const tab = resolveAdminTab('/admin', searchParams.get('tab'));
    const Panel = PANELS[tab];

    return <Panel />;
}

export default function AdminDashboardPage() {
    return (
        <Suspense
            fallback={
                <p className="text-sm text-slate-500">Đang tải bảng điều khiển…</p>
            }
        >
            <AdminTabContent />
        </Suspense>
    );
}
