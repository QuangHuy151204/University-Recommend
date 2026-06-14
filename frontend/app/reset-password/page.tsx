'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { resetPassword } from '@/services/auth';
import { ApiClientError } from '@/lib/api';
import { PasswordInput } from '@/components/ui/PasswordInput';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialEmail = searchParams.get('email') ?? '';

    const [email, setEmail] = useState(initialEmail);
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (loading) return;
        setError(null);
        if (password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }
        if (password !== confirm) {
            setError('Mật khẩu nhập lại không khớp.');
            return;
        }
        setLoading(true);
        try {
            await resetPassword(email.trim(), code.trim(), password);
            router.push('/login?reset=1');
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

    return (
        <div className="flex min-h-[60vh] items-center justify-center bg-neutral px-6 py-12">
            <div className="w-full max-w-md">
                <h1 className="font-display text-center text-2xl font-bold text-primary">
                    Đặt lại mật khẩu
                </h1>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Nhập mã từ email và mật khẩu mới.
                </p>
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
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                            className="input-field mt-1 tracking-widest"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-medium text-slate-700">
                            Mật khẩu mới
                        </label>
                        <PasswordInput
                            id="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            wrapperClassName="mt-1"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirm" className="text-sm font-medium text-slate-700">
                            Nhập lại mật khẩu
                        </label>
                        <PasswordInput
                            id="confirm"
                            required
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            wrapperClassName="mt-1"
                        />
                    </div>
                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {error}
                        </div>
                    )}
                    <button type="submit" disabled={loading} className="btn-primary w-full">
                        {loading ? 'Đang lưu…' : 'Đặt lại mật khẩu'}
                    </button>
                    <p className="text-center text-sm text-slate-600">
                        <Link href="/login" className="font-semibold text-tertiary hover:underline">
                            Đăng nhập
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={null}>
            <ResetPasswordForm />
        </Suspense>
    );
}
