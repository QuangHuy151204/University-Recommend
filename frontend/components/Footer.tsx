import Link from 'next/link';

type FooterVariant = 'public' | 'app';

export function Footer({ variant = 'app' }: { variant?: FooterVariant }) {
    const isPublic = variant === 'public';

    return (
        <footer className="mt-auto bg-primary-dark text-white">
            <div className="mx-auto max-w-7xl px-6 py-12">
                <div className="grid gap-10 md:grid-cols-4">
                    <div>
                        <p className="font-display text-xl font-bold">UniGuide AI</p>
                        <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-300">
                            Giúp học sinh THPT tại Hà Nội tra cứu trường, ngành và điểm
                            chuẩn — nhận gợi ý phù hợp năng lực, sở thích và ngân sách học
                            phí.
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold tracking-wider text-secondary">
                            {isPublic ? 'BẮT ĐẦU' : 'KHÁM PHÁ'}
                        </p>
                        <ul className="mt-3 space-y-2 text-sm text-slate-300">
                            {isPublic ? (
                                <>
                                    <li>
                                        <Link href="/register" className="hover:text-white">
                                            Đăng ký tài khoản
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/login" className="hover:text-white">
                                            Đăng nhập
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link href="/universities" className="hover:text-white">
                                            Tra cứu trường
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/majors" className="hover:text-white">
                                            Khám phá ngành
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/cutoff-scores" className="hover:text-white">
                                            Điểm chuẩn 2023–2025
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                    <div>
                        <p className="text-xs font-semibold tracking-wider text-secondary">
                            HỖ TRỢ
                        </p>
                        <ul className="mt-3 space-y-2 text-sm text-slate-300">
                            <li>Phạm vi: Hà Nội</li>
                            <li>Điểm chuẩn 2023–2025</li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-xs font-semibold tracking-wider text-secondary">
                            TÍNH NĂNG
                        </p>
                        <ul className="mt-3 space-y-2 text-sm text-slate-300">
                            <li>Tra cứu trường & ngành</li>
                            <li>Tra điểm chuẩn theo trường</li>
                            <li>Chatbot tư vấn AI</li>
                            <li>So sánh trường</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-slate-400">
                    © {new Date().getFullYear()} UniGuide AI. Gợi ý đại học minh bạch cho Gen Z.
                </div>
            </div>
        </footer>
    );
}
