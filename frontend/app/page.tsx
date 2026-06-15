import Link from 'next/link';
import {
    BarChart3,
    Bot,
    GraduationCap,
    MapPin,
    ShieldCheck,
    Sparkles,
    Target,
    Wallet,
} from 'lucide-react';

const features = [
    {
        icon: GraduationCap,
        title: 'Tra cứu trường & ngành',
        description:
            'Hơn 100 trường đại học Hà Nội, điểm chuẩn 2023–2025, học phí và tổ hợp xét tuyển — tìm và so sánh trong một nơi.',
        accent: 'text-primary',
        bg: 'bg-primary/8',
    },
    {
        icon: Target,
        title: 'Điểm chuẩn 2023–2025',
        description:
            'Tìm tên trường, xem bảng điểm chuẩn theo ngành, năm và phương thức xét tuyển — dữ liệu tập trung, dễ so sánh.',
        accent: 'text-secondary-dark',
        bg: 'bg-secondary/15',
    },
    {
        icon: Bot,
        title: 'Chatbot',
        description:
            'Hỏi đáp tự nhiên bằng tiếng Việt: tra điểm chuẩn, học phí, danh sách ngành — chatbot giải thích rõ ràng, dễ hiểu.',
        accent: 'text-tertiary',
        bg: 'bg-tertiary/10',
    },
    {
        icon: Wallet,
        title: 'Lọc theo ngân sách',
        description:
            'So sánh học phí theo năm, lọc trường phù hợp khả năng tài chính gia đình trước khi nộp hồ sơ.',
        accent: 'text-primary',
        bg: 'bg-primary/8',
    },
];

const steps = [
    {
        step: '01',
        title: 'Đăng ký miễn phí',
        text: 'Tạo tài khoản, xác minh email và thiết lập hồ sơ học sinh THPT.',
    },
    {
        step: '02',
        title: 'Nhập mục tiêu',
        text: 'Điểm dự kiến, tổ hợp môn, ngành quan tâm, khu vực và ngân sách học phí.',
    },
    {
        step: '03',
        title: 'Khám phá & chatbot',
        text: 'Tra điểm chuẩn, so sánh trường và trò chuyện với chatbot.',
    },
];

export default function LandingPage() {
    return (
        <div className="overflow-hidden">
            {/* Hero */}
            <section className="relative min-h-[88vh] bg-primary">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-25"
                    style={{
                        backgroundImage:
                            'url(https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80)',
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/92 to-[#0d1547]" />
                <div
                    className="pointer-events-none absolute -left-32 top-20 size-96 rounded-full bg-secondary/20 blur-3xl"
                    aria-hidden
                />
                <div
                    className="pointer-events-none absolute -right-24 bottom-10 size-80 rounded-full bg-tertiary/25 blur-3xl"
                    aria-hidden
                />

                <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 pb-24 pt-16 text-center sm:pt-24">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-slate-100 backdrop-blur">
                        <MapPin className="size-3.5 text-secondary" />
                        Phạm vi Hà Nội · Dữ liệu 2023–2025
                    </span>
                    <h1 className="font-display mt-8 max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl">
                        Tư vấn tuyển sinh đại học{' '}
                        <span className="text-secondary">thông minh</span>, minh bạch
                    </h1>
                    <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
                        <strong className="font-semibold text-white">UniGuide AI</strong>{' '}
                        giúp học sinh THPT tra cứu trường–ngành, điểm chuẩn và nhận gợi
                        ý phù hợp năng lực, sở thích và ngân sách học phí.
                    </p>
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                        <Link href="/register" className="btn-accent px-8 py-3 text-base shadow-lg shadow-secondary/30">
                            Đăng ký miễn phí
                        </Link>
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-8 py-3 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
                        >
                            Đăng nhập
                        </Link>
                    </div>
                    <ul className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-slate-300">
                        <li className="flex items-center gap-2">
                            <ShieldCheck className="size-4 text-secondary" />
                            Điểm chuẩn tra cứu được
                        </li>
                        <li className="flex items-center gap-2">
                            <BarChart3 className="size-4 text-secondary" />
                            ~100+ trường Hà Nội
                        </li>
                        <li className="flex items-center gap-2">
                            <Sparkles className="size-4 text-secondary" />
                            Chatbot
                        </li>
                    </ul>
                </div>
            </section>

            {/* About */}
            <section className="border-b border-slate-200/80 bg-white py-20">
                <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-secondary-dark">
                            UniGuide AI là gì?
                        </p>
                        <h2 className="font-display mt-3 text-3xl font-bold text-primary sm:text-4xl">
                            Người bạn đồng hành trên hành trình chọn trường
                        </h2>
                        <p className="mt-4 text-base leading-relaxed text-slate-600">
                            Thay vì lục tìm từng bảng điểm rời rạc, bạn có một nền tảng tập
                            trung: tra cứu trường đại học Hà Nội, so sánh điểm chuẩn theo năm
                            và phương thức xét tuyển, nhận gợi ý ngành theo điểm số và sở thích,
                            cùng chatbot trả lời bằng tiếng Việt khi bạn cần giải thích thêm.
                        </p>
                        <p className="mt-4 text-base leading-relaxed text-slate-600">
                            Dành cho học sinh lớp 12, phụ huynh và giáo viên hướng nghiệp —
                            miễn phí sau khi đăng ký tài khoản.
                        </p>
                    </div>
                    <div className="relative">
                        <div className="card relative z-10 overflow-hidden p-8">
                            <div className="absolute -right-6 -top-6 size-32 rounded-full bg-secondary/20 blur-2xl" />
                            <h3 className="font-display relative text-xl font-bold text-primary">
                                Bạn có thể làm gì?
                            </h3>
                            <ul className="relative mt-6 space-y-4 text-sm text-slate-700">
                                <li className="flex gap-3">
                                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                                        ✓
                                    </span>
                                    Tìm trường theo tên, loại hình, học phí và điểm chuẩn
                                </li>
                                <li className="flex gap-3">
                                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                                        ✓
                                    </span>
                                    Xem chi tiết ngành, tổ hợp và lịch sử điểm 2023–2025
                                </li>
                                <li className="flex gap-3">
                                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                                        ✓
                                    </span>
                                    Tra điểm chuẩn theo trường, ngành và phương thức xét tuyển
                                </li>
                                <li className="flex gap-3">
                                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                                        ✓
                                    </span>
                                    Hỏi chatbot: &quot;Đủ điểm vào X không?&quot;, so sánh trường…
                                </li>
                            </ul>
                        </div>
                        <div
                            className="absolute -bottom-4 -left-4 -z-0 h-full w-full rounded-2xl bg-gradient-to-br from-secondary/30 to-tertiary/20"
                            aria-hidden
                        />
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="bg-neutral py-20">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="text-center">
                        <p className="text-xs font-bold uppercase tracking-widest text-tertiary">
                            Tính năng
                        </p>
                        <h2 className="font-display mt-3 text-3xl font-bold text-primary">
                            Mọi thứ cần cho mùa tuyển sinh
                        </h2>
                    </div>
                    <div className="mt-12 grid gap-6 sm:grid-cols-2">
                        {features.map((f) => (
                            <article
                                key={f.title}
                                className="card flex gap-5 p-6 transition-shadow hover:shadow-md"
                            >
                                <div
                                    className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${f.bg}`}
                                >
                                    <f.icon className={`size-6 ${f.accent}`} />
                                </div>
                                <div>
                                    <h3 className="font-display font-bold text-primary">
                                        {f.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                        {f.description}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Steps */}
            <section className="border-t border-slate-200 bg-white py-20">
                <div className="mx-auto max-w-6xl px-6">
                    <h2 className="font-display text-center text-3xl font-bold text-primary">
                        Bắt đầu trong 3 bước
                    </h2>
                    <div className="mt-14 grid gap-8 md:grid-cols-3">
                        {steps.map((s) => (
                            <div key={s.step} className="relative text-center">
                                <span className="font-display text-5xl font-bold text-primary/10">
                                    {s.step}
                                </span>
                                <h3 className="font-display -mt-6 text-lg font-bold text-primary">
                                    {s.title}
                                </h3>
                                <p className="mx-auto mt-3 max-w-xs text-sm text-slate-600">
                                    {s.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="relative overflow-hidden bg-primary py-20">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-light opacity-90" />
                <div className="relative mx-auto max-w-3xl px-6 text-center">
                    <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
                        Sẵn sàng chọn hướng đi đại học?
                    </h2>
                    <p className="mt-4 text-slate-200">
                        Đăng ký để mở tra cứu, gợi ý cá nhân hóa và lưu lịch sử chatbot.
                    </p>
                    <div className="mt-10 flex flex-wrap justify-center gap-4">
                        <Link href="/register" className="btn-accent px-8 py-3 text-base">
                            Tạo tài khoản
                        </Link>
                        <Link href="/login" className="btn-secondary px-8 py-3 text-base">
                            Đã có tài khoản
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
