'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { login as loginRequest } from '@/services/auth';
import { ApiClientError } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { PasswordInput } from '@/components/ui/PasswordInput';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/home';
    const resetOk = searchParams.get('reset') === '1';
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (loading) return;
        setError(null);
        setLoading(true);
        try {
            const res = await loginRequest(email.trim(), password);
            login(res.access_token, res.user);
            router.push(res.user.role === 'admin' ? '/admin' : redirect);
        } catch (err) {
            if (
                err instanceof ApiClientError &&
                err.status === 403 &&
                err.body?.error === 'EMAIL_NOT_VERIFIED'
            ) {
                const targetEmail =
                    (typeof err.body.email === 'string' ? err.body.email : null) ||
                    email.trim();
                router.push(
                    `/verify-email?email=${encodeURIComponent(targetEmail)}`,
                );
                return;
            }
            setError(
                err instanceof ApiClientError
                    ? err.message
                    : 'Không kết nối được backend.',
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-[60vh] items-center justify-center bg-neutral px-6 py-12">
            <div className="w-full max-w-md">
                <h1 className="font-display text-center text-2xl font-bold text-primary">
                    Đăng nhập
                </h1>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Lưu hồ sơ và lịch sử gợi ý cá nhân hóa.
                </p>
                {resetOk && (
                    <p className="mt-4 text-center text-sm text-emerald-700">
                        Đặt lại mật khẩu thành công. Bạn có thể đăng nhập.
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
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="text-sm font-medium text-slate-700">
                                Mật khẩu
                            </label>
                            <Link
                                href="/forgot-password"
                                className="text-xs font-semibold text-tertiary hover:underline"
                            >
                                Quên mật khẩu?
                            </Link>
                        </div>
                        <PasswordInput
                            id="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            wrapperClassName="mt-1"
                        />
                    </div>
                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {error}
                        </div>
                    )}
                    <button type="submit" disabled={loading} className="btn-primary w-full">
                        {loading ? 'Đang đăng nhập…' : 'Đăng nhập'}
                    </button>
                    <p className="text-center text-sm text-slate-600">
                        Chưa có tài khoản?{' '}
                        <Link href="/register" className="font-semibold text-tertiary hover:underline">
                            Đăng ký
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginForm />
        </Suspense>
    );
}
