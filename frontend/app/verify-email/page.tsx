'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { resendVerification, verifyEmail } from '@/services/auth';
import { ApiClientError } from '@/lib/api';
import { useAuth } from '@/lib/auth';

function VerifyEmailForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialEmail = searchParams.get('email') ?? '';
    const justRegistered = searchParams.get('registered') === '1';
    const { login } = useAuth();

    const [email, setEmail] = useState(initialEmail);
    const [code, setCode] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (loading) return;
        setError(null);
        setInfo(null);
        setLoading(true);
        try {
            const res = await verifyEmail(email.trim(), code.trim());
            login(res.access_token, res.user);
            router.push('/profile');
        } catch (err) {
            setError(
                err instanceof ApiClientError
                    ? err.message
                    : 'Không kết nối được backend.',
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleResend() {
        if (resending || !email.trim()) return;
        setError(null);
        setInfo(null);
        setResending(true);
        try {
            const res = await resendVerification(email.trim());
            setInfo(res.message);
        } catch (err) {
            setError(
                err instanceof ApiClientError
                    ? err.message
                    : 'Không gửi lại được mã.',
            );
        } finally {
            setResending(false);
        }
    }

    return (
        <div className="flex min-h-[60vh] items-center justify-center bg-neutral px-6 py-12">
            <div className="w-full max-w-md">
                <h1 className="font-display text-center text-2xl font-bold text-primary">
                    Xác nhận email
                </h1>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Nhập mã 6 chữ số đã gửi tới email của bạn (hiệu lực 15 phút).
                </p>
                {justRegistered && (
                    <p className="mt-4 text-center text-sm text-emerald-700">
                        Đăng ký thành công. Kiểm tra hộp thư (và thư rác) để lấy mã.
                    </p>
                )}
                <form onSubmit={handleSubmit} className="card mt-8 space-y-4 p-6">
                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-slate-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field mt-1"
                        />
                    </div>
                    <div>
                        <label htmlFor="code" className="text-sm font-medium text-slate-700">
                            Mã xác nhận
                        </label>
                        <input
                            id="code"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]{6}"
                            maxLength={6}
                            required
                            placeholder="123456"
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                            className="input-field mt-1 tracking-widest"
                        />
                    </div>
                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {error}
                        </div>
                    )}
                    {info && (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                            {info}
                        </div>
                    )}
                    <button type="submit" disabled={loading} className="btn-primary w-full">
                        {loading ? 'Đang xác nhận…' : 'Xác nhận'}
                    </button>
                    <button
                        type="button"
                        disabled={resending}
                        onClick={handleResend}
                        className="btn-secondary w-full"
                    >
                        {resending ? 'Đang gửi…' : 'Gửi lại mã'}
                    </button>
                    <p className="text-center text-sm text-slate-600">
                        <Link href="/login" className="font-semibold text-tertiary hover:underline">
                            Quay lại đăng nhập
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={null}>
            <VerifyEmailForm />
        </Suspense>
    );
}
