import Link from 'next/link';
import {
    BarChart3,
    GraduationCap,
    ListChecks,
    Search,
    Sparkles,
    MessageCircle,
} from 'lucide-react';
import { listUniversities } from '@/services/universities';
import { formatTuitionVnd } from '@/lib/utils';

export default async function HomeDashboardPage() {
    let featured: Awaited<ReturnType<typeof listUniversities>>['data'] = [];
    try {
        const res = await listUniversities({ page: 1, limit: 3 });
        featured = res.data;
    } catch {
        featured = [];
    }

    return (
        <div>
            <section className="relative overflow-hidden bg-primary">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-30"
                    style={{
                        backgroundImage:
                            'url(https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80)',
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />
                <div className="relative mx-auto max-w-4xl px-6 py-20 text-center sm:py-28">
                    <h1 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
                        Định hướng tương lai cùng trí tuệ nhân tạo.
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-base text-slate-200 sm:text-lg">
                        Khám phá trường đại học phù hợp năng lực và đam mê — xem điểm
                        chuẩn, học phí và ngành đào tạo tại Hà Nội (2023–2025).
                    </p>
                    <form
                        action="/universities"
                        className="mx-auto mt-8 flex max-w-xl overflow-hidden rounded-full bg-white p-1.5 shadow-xl"
                    >
                        <div className="relative flex flex-1 items-center">
                            <Search className="absolute left-4 size-5 text-slate-400" />
                            <input
                                name="search"
                                placeholder="Tên trường, ngành học..."
                                className="w-full rounded-full border-0 bg-transparent py-3 pl-12 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                            />
                        </div>
                        <button type="submit" className="btn-primary !rounded-full shrink-0">
                            Tìm ngay
                        </button>
                    </form>
                </div>
            </section>

            <section className="mx-auto grid max-w-6xl gap-4 px-6 py-12 sm:grid-cols-3">
                <Link
                    href="/cutoff-scores"
                    className="card group bg-secondary/15 p-6 transition-shadow hover:shadow-md"
                >
                    <BarChart3 className="size-8 text-secondary-dark" />
                    <h2 className="font-display mt-4 text-lg font-bold text-primary">
                        Điểm chuẩn 2023–2025
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Tìm tên trường, xem bảng điểm chuẩn theo ngành và phương thức
                        xét tuyển.
                    </p>
                    <span className="mt-4 inline-block text-sm font-semibold text-secondary-dark group-hover:underline">
                        Tra cứu điểm chuẩn →
                    </span>
                </Link>
                <Link
                    href="/universities"
                    className="card p-6 transition-shadow hover:shadow-md"
                >
                    <GraduationCap className="size-8 text-primary" />
                    <h2 className="font-display mt-4 text-lg font-bold text-primary">
                        Tra cứu trường
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Tra cứu trường đại học Hà Nội, học phí và điểm chuẩn theo năm.
                    </p>
                </Link>
                <Link
                    href="/majors"
                    className="card p-6 transition-shadow hover:shadow-md"
                >
                    <ListChecks className="size-8 text-tertiary" />
                    <h2 className="font-display mt-4 text-lg font-bold text-primary">
                        Khám phá ngành
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Khám phá ngành học, định hướng nghề nghiệp và trường đào tạo.
                    </p>
                </Link>
            </section>

            <section className="mx-auto max-w-6xl px-6 pb-12">
                <div className="relative overflow-hidden rounded-2xl bg-primary px-8 py-10 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <h2 className="font-display text-xl font-bold text-white sm:text-2xl">
                            Điểm chuẩn 2023–2025
                        </h2>
                        <p className="mt-2 max-w-md text-sm text-slate-300">
                            Xem điểm chuẩn theo trường, ngành và phương thức xét tuyển —
                            cập nhật các năm gần đây.
                        </p>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3 sm:mt-0">
                        <Link href="/recommend" className="btn-accent">
                            Gợi ý trường – ngành
                        </Link>
                        <Link href="/universities" className="btn-secondary">
                            Xem bảng điểm
                        </Link>
                    </div>
                    <Link
                        href="/chatbot"
                        className="absolute bottom-4 right-4 flex size-12 items-center justify-center rounded-full bg-secondary text-white shadow-lg hover:bg-secondary-dark sm:bottom-6 sm:right-6"
                        title="Tư vấn AI"
                    >
                        <MessageCircle className="size-6" />
                    </Link>
                </div>
            </section>

            {featured.length > 0 && (
                <section className="mx-auto max-w-6xl px-6 pb-16">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="font-display text-2xl font-bold text-primary">
                            Trường đại học tiêu biểu
                        </h2>
                        <Link
                            href="/universities"
                            className="text-sm font-semibold text-tertiary hover:underline"
                        >
                            Xem tất cả →
                        </Link>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-3">
                        {featured.map((u) => (
                            <article key={u.id} className="card overflow-hidden">
                                <div className="relative h-36 bg-gradient-to-br from-primary/20 to-secondary/20">
                                    <span className="badge-mint absolute right-3 top-3">
                                        Hà Nội
                                    </span>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-display font-bold text-primary">
                                        {u.short_name || u.name}
                                    </h3>
                                    <p className="mt-1 text-xs text-slate-500">
                                        {u.location ?? 'Hà Nội, Việt Nam'}
                                    </p>
                                    <p className="mt-2 text-xs text-slate-600">
                                        {formatTuitionVnd(
                                            u.tuition_fee_min,
                                            u.tuition_fee_max,
                                        )}
                                    </p>
                                    <Link
                                        href={`/universities/${u.id}`}
                                        className="btn-outline mt-4 w-full text-center"
                                    >
                                        Chi tiết trường
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            <section className="border-t border-slate-200 bg-white py-10">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-4 px-6 text-center">
                    <Sparkles className="size-6 text-secondary" />
                    <p className="text-sm text-slate-600">
                        Hỏi chatbot về trường, ngành, điểm chuẩn và học phí — trả lời
                        bằng tiếng Việt, dễ hiểu.
                    </p>
                    <Link href="/chatbot" className="btn-primary">
                        Bắt đầu tư vấn ngay
                    </Link>
                </div>
            </section>
        </div>
    );
}
