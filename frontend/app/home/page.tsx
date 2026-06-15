import { listUniversities } from '@/services/universities';
import { HomeDashboard } from '@/components/home/HomeDashboard';

export default async function HomeDashboardPage() {
    let featured: Awaited<ReturnType<typeof listUniversities>>['data'] = [];
    try {
        const res = await listUniversities({ page: 1, limit: 3 });
        featured = res.data;
    } catch {
        featured = [];
    }

    return <HomeDashboard featured={featured} />;
}
