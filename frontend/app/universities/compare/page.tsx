import Link from 'next/link';
import { getUniversitiesByIds } from '@/services/universities';
import { UniversityCompareView } from '@/components/universities/UniversityCompareView';
import {
    AlertBox,
    BackLink,
    PageHeader,
    PageShell,
} from '@/components/ui/PageLayout';
import { CompareIdsFromStorage } from '@/components/universities/CompareIdsFromStorage';
import { parseCompareIds } from '@/lib/university-compare';
import { ApiClientError } from '@/lib/api';

interface PageProps {
    searchParams: Promise<{ ids?: string }>;
}

export default async function UniversityComparePage({ searchParams }: PageProps) {
    const params = await searchParams;
    const ids = parseCompareIds(params.ids);

    if (ids.length < 2) {
        return (
            <PageShell maxWidth="max-w-3xl">
                <div className="mb-5">
                    <BackLink href="/universities" label="Danh sách trường" />
                </div>
                <PageHeader
                    eyebrow="So sánh trường"
                    title="Chọn ít nhất 2 trường"
                    subtitle="Trên trang tra cứu, tick «So sánh» đúng 2 trường rồi bấm «So sánh ngay»."
                />
                <CompareIdsFromStorage />
                <Link href="/universities" className="btn-primary mt-6 inline-flex">
                    Đến tra cứu trường
                </Link>
            </PageShell>
        );
    }

    let errorMessage: string | null = null;
    let universities: Awaited<
        ReturnType<typeof getUniversitiesByIds>
    >['universities'] = [];
    let failedIds: number[] = [];

    try {
        const result = await getUniversitiesByIds(ids);
        universities = result.universities;
        failedIds = result.failedIds;
    } catch (err) {
        errorMessage =
            err instanceof ApiClientError
                ? `Không gọi được API (${err.status}): ${err.message}`
                : 'Không kết nối được backend. Chạy API tại http://localhost:3001/api.';
    }

    if (errorMessage) {
        return (
            <PageShell>
                <div className="mb-5">
                    <BackLink href="/universities" label="Danh sách trường" />
                </div>
                <AlertBox variant="error">{errorMessage}</AlertBox>
            </PageShell>
        );
    }

    if (universities.length < 2) {
        return (
            <PageShell maxWidth="max-w-3xl">
                <BackLink href="/universities" label="Danh sách trường" />
                <AlertBox variant="warning">
                    Không tải đủ trường để so sánh
                    {failedIds.length > 0
                        ? ` (id không hợp lệ: ${failedIds.join(', ')})`
                        : ''}
                    .
                </AlertBox>
                <Link href="/universities" className="btn-primary mt-4 inline-flex">
                    Chọn lại trường
                </Link>
            </PageShell>
        );
    }

    return (
        <PageShell maxWidth="max-w-6xl">
            <div className="mb-5">
                <BackLink href="/universities" label="Danh sách trường" />
            </div>
            <PageHeader
                eyebrow="So sánh trường"
                title={`Đang so sánh ${universities.length} trường`}
                subtitle="Học phí, khu vực, loại hình, phương thức xét tuyển và điểm chuẩn theo năm."
                action={
                    <Link href="/universities" className="btn-secondary shrink-0">
                        + Thêm trường
                    </Link>
                }
            />
            {failedIds.length > 0 && (
                <AlertBox variant="warning" className="mb-4">
                    Bỏ qua id không tìm thấy: {failedIds.join(', ')}.
                </AlertBox>
            )}
            <UniversityCompareView universities={universities} />
        </PageShell>
    );
}
