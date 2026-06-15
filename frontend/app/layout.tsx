import type { Metadata } from 'next';
import { Hanken_Grotesk, Inter } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/AppShell';
import { AuthProvider } from '@/lib/auth';
import { LocaleProvider } from '@/lib/i18n/locale';

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin', 'vietnamese'],
});

const hanken = Hanken_Grotesk({
    variable: '--font-hanken',
    subsets: ['latin', 'vietnamese'],
});

export const metadata: Metadata = {
    title: 'UniGuide AI — Gợi ý đại học thông minh',
    description:
        'Gợi ý trường đại học và ngành học phù hợp cho học sinh THPT tại Hà Nội — tra cứu, so sánh và chatbot tư vấn.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="vi"
            className={`${inter.variable} ${hanken.variable} h-full antialiased`}
        >
            <body className="flex min-h-full flex-col bg-background text-foreground">
                <AuthProvider>
                    <LocaleProvider>
                        <AppShell>{children}</AppShell>
                    </LocaleProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
