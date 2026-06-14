'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { forgotPassword } from '@/services/auth';
import { ApiClientError } from '@/lib/api';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (loading) return;
        setError(null);
        setLoading(true);
        try {
            await forgotPassword(email.trim());
            router.push(`/reset-password?email=${encodeURIComponent(email.trim())}`);
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
                    Quên mật khẩu
                </h1>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Nhập email đăng ký — chúng tôi sẽ gửi mã 6 chữ số để đặt lại mật khẩu.
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
                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {error}
                        </div>
                    )}
                    <button type="submit" disabled={loading} className="btn-primary w-full">
                        {loading ? 'Đang gửi…' : 'Gửi mã xác nhận'}
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
