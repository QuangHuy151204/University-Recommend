import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookOpen, GraduationCap } from 'lucide-react';
import { getMajor } from '@/services/majors';
import {
    AlertBox,
    BackLink,
    PageHeader,
    PageShell,
} from '@/components/ui/PageLayout';
import { ApiClientError } from '@/lib/api';
import { MajorProgramsSection } from '@/components/majors/MajorProgramsSection';
import type { MajorDetail } from '@/types';

interface PageProps {
    params: Promise<{ id: string }>;
}

function InfoBlock({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="border-t border-slate-100 pt-5 first:border-0 first:pt-0">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {title}
            </h3>
            <div className="mt-2 text-sm leading-relaxed text-slate-700">
                {children}
            </div>
        </div>
    );
}

export default async function MajorDetailPage({ params }: PageProps) {
    const { id } = await params;
    const numId = Number(id);
    if (!Number.isFinite(numId)) notFound();

    let major: MajorDetail | null = null;
    let errorMessage: string | null = null;

    try {
        major = await getMajor(numId);
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
                    <BackLink href="/majors" label="Danh sách ngành" />
                </div>
                <AlertBox variant="error">{errorMessage}</AlertBox>
            </PageShell>
        );
    }
    if (!major) notFound();

    const programs = (major.universityMajors ?? [])
        .slice()
        .sort((a, b) =>
            (a.university?.name ?? '').localeCompare(b.university?.name ?? '', 'vi'),
        );

    return (
        <PageShell>
            <div className="mb-5">
                <BackLink href="/majors" label="Danh sách ngành" />
            </div>

            <PageHeader
                eyebrow="Chi tiết ngành"
                title={major.name}
                subtitle={
                    [major.code, major.field_group].filter(Boolean).join(' · ') ||
                    'Ngành đào tạo tại Hà Nội'
                }
            />

            <header className="card p-6 sm:p-8">
                <div className="flex items-start gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary/15 text-secondary-dark">
                        <BookOpen className="size-6" aria-hidden />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {major.code && (
                            <span className="badge-mint">Mã {major.code}</span>
                        )}
                        {(major.groups?.length
                            ? major.groups.map((g) => g.group_name)
                            : major.field_group
                              ? [major.field_group]
                              : []
                        ).map((groupName) => (
                            <span
                                key={groupName}
                                className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary"
                            >
                                {groupName}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mt-5 space-y-0">
                    {major.description && (
                        <InfoBlock title="Mô tả">
                            <p className="whitespace-pre-wrap">{major.description}</p>
                        </InfoBlock>
                    )}
                    {major.career_orientation && (
                        <InfoBlock title="Định hướng nghề nghiệp">
                            <p className="whitespace-pre-wrap">
                                {major.career_orientation}
                            </p>
                        </InfoBlock>
                    )}
                    {major.required_skills && (
                        <InfoBlock title="Kỹ năng cần thiết">
                            <p className="whitespace-pre-wrap">
                                {major.required_skills}
                            </p>
                        </InfoBlock>
                    )}
                    {major.tags && major.tags.length > 0 && (
                        <InfoBlock title="Tags tra cứu">
                            <div className="flex flex-wrap gap-1.5">
                                {major.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </InfoBlock>
                    )}
                </div>
            </header>

            <section className="mt-8">
                <h2 className="font-display text-lg font-bold text-primary">
                    Các trường đào tạo
                    <span className="ml-2 text-base font-normal text-slate-500">
                        ({programs.length})
                    </span>
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                    Chọn trường để xem điểm chuẩn và chương trình đào tạo chi tiết
                </p>

                <MajorProgramsSection programs={programs} />
            </section>

            <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
                <GraduationCap className="size-3.5" aria-hidden />
                Muốn gợi ý trường theo điểm của bạn?{' '}
                <Link
                    href="/chatbot"
                    className="font-medium text-tertiary hover:text-primary"
                >
                    Hỏi tư vấn AI
                </Link>
            </p>
        </PageShell>
    );
}
