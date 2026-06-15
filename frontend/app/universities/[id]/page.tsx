import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Building2, ExternalLink, MapPin } from 'lucide-react';
import { getUniversity } from '@/services/universities';
import { listAdmissionMethods } from '@/services/admission-methods';
import { CutoffMethodFilter } from '@/components/CutoffMethodFilter';
import { CompareUniversityButton } from '@/components/universities/CompareUniversityButton';
import { FavoriteButton } from '@/components/universities/FavoriteButton';
import {
    AlertBox,
    BackLink,
    PageHeader,
    PageShell,
} from '@/components/ui/PageLayout';
import { ApiClientError } from '@/lib/api';
import { formatTuitionVnd, translateUniversityType } from '@/lib/utils';
import type { AdmissionMethod, CutoffScore, UniversityDetail } from '@/types';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function UniversityDetailPage({ params }: PageProps) {
    const { id } = await params;
    const numId = Number(id);
    if (!Number.isFinite(numId)) notFound();

    let uni: UniversityDetail | null = null;
    let methods: AdmissionMethod[] = [];
    let methodsLoadFailed = false;
    let errorMessage: string | null = null;

    try {
        uni = await getUniversity(numId);
        try {
            methods = await listAdmissionMethods();
        } catch {
            methodsLoadFailed = true;
        }
    } catch (err) {
        if (err instanceof ApiClientError && err.status === 404) {
            notFound();
        }
        errorMessage =
            err instanceof ApiClientError
                ? `Lỗi API (${err.status}): ${err.message}`
                : 'Không kết nối được tới backend (http://localhost:3001/api).';
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

    if (!uni) notFound();

    const programs = (uni.universityMajors ?? []).map((p) => ({
        programId: p.id,
        majorName: p.major.name,
        majorLinkId: p.major.id,
        majorCode: p.major.code,
        fieldGroup: p.major.field_group,
        trainingProgram: p.training_program,
        duration: p.duration,
        tuitionFee: p.tuition_fee,
        cutoffs: (p.cutoffScores ?? []) as CutoffScore[],
    }));

    return (
        <PageShell>
            <div className="mb-5">
                <BackLink href="/universities" label="Danh sách trường" />
            </div>

            <PageHeader
                eyebrow="Chi tiết trường"
                title={uni.name}
                subtitle={
                    uni.short_name
                        ? `${uni.short_name} · ${uni.location ?? 'Hà Nội'}`
                        : uni.location ?? 'Hà Nội'
                }
                action={
                    <div className="flex flex-wrap items-center gap-2">
                        <FavoriteButton universityId={uni.id} />
                        <CompareUniversityButton
                            universityId={uni.id}
                            universityName={uni.name}
                            universityShortName={uni.short_name}
                        />
                        {uni.website ? (
                            <a
                                href={uni.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-outline shrink-0"
                            >
                                Website
                                <ExternalLink className="size-4" aria-hidden />
                            </a>
                        ) : null}
                    </div>
                }
            />

            <header className="card p-6 sm:p-8">
                <div className="flex items-start gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Building2 className="size-6" aria-hidden />
                    </div>
                    <dl className="grid flex-1 gap-3 text-sm sm:grid-cols-2">
                        {uni.location && (
                            <div className="flex gap-2 sm:col-span-2">
                                <MapPin
                                    className="mt-0.5 size-4 shrink-0 text-secondary-dark"
                                    aria-hidden
                                />
                                <div>
                                    <dt className="font-medium text-slate-500">
                                        Khu vực
                                    </dt>
                                    <dd>{uni.location}</dd>
                                    {uni.address && (
                                        <dd className="mt-0.5 text-slate-600">
                                            {uni.address}
                                        </dd>
                                    )}
                                </div>
                            </div>
                        )}
                        <div>
                            <dt className="font-medium text-slate-500">Loại trường</dt>
                            <dd>{translateUniversityType(uni.type)}</dd>
                        </div>
                        <div>
                            <dt className="font-medium text-slate-500">
                                Học phí tham khảo (ước tính/năm)
                            </dt>
                            <dd className="font-medium text-primary">
                                {formatTuitionVnd(
                                    uni.tuition_fee_min,
                                    uni.tuition_fee_max,
                                )}
                            </dd>
                            {uni.tuition_per_credit_note ? (
                                <dd className="mt-1.5 text-slate-600">
                                    <span className="font-medium text-slate-500">
                                        Theo tín chỉ:{' '}
                                    </span>
                                    {uni.tuition_per_credit_note}
                                </dd>
                            ) : null}
                            {uni.source_url ? (
                                <dd className="mt-1">
                                    <a
                                        href={uni.source_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-secondary-dark underline-offset-2 hover:underline"
                                    >
                                        Nguồn học phí
                                        <ExternalLink
                                            className="ml-0.5 inline size-3.5"
                                            aria-hidden
                                        />
                                    </a>
                                </dd>
                            ) : null}
                        </div>
                    </dl>
                </div>

                {uni.description && (
                    <p className="mt-5 border-t border-slate-100 pt-5 text-sm leading-relaxed text-slate-700">
                        {uni.description}
                    </p>
                )}
            </header>

            <section className="mt-8">
                <h2 className="font-display text-lg font-bold text-primary">
                    Ngành đào tạo & điểm chuẩn
                    <span className="ml-2 text-base font-normal text-slate-500">
                        ({programs.length})
                    </span>
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                    Điểm chuẩn 2023–2025 theo phương thức xét tuyển — lọc theo năm,
                    ngành và tổ hợp môn.
                </p>

                {methodsLoadFailed && (
                    <AlertBox variant="warning" className="mt-4">
                        Không tải được danh mục phương thức xét tuyển — hiển thị
                        tất cả điểm chuẩn.
                    </AlertBox>
                )}

                <div className="mt-5">
                    {programs.length === 0 ? (
                        <div className="card p-8 text-center text-sm text-slate-500">
                            Chưa có dữ liệu ngành cho trường này.
                        </div>
                    ) : (
                        <CutoffMethodFilter methods={methods} programs={programs} />
                    )}
                </div>
            </section>

            <p className="mt-8 text-center text-xs text-slate-500">
                Cần gợi ý theo điểm của bạn?{' '}
                <Link
                    href="/chatbot"
                    className="font-medium text-tertiary hover:text-primary"
                >
                    Hỏi tư vấn AI
                </Link>
                {' · '}
                <Link
                    href={`/cutoff-scores?university=${uni.id}`}
                    className="font-medium text-tertiary hover:text-primary"
                >
                    Xem điểm chuẩn riêng
                </Link>
            </p>
        </PageShell>
    );
}
