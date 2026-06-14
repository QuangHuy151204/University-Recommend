'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { register as registerRequest } from '@/services/auth';
import { ApiClientError } from '@/lib/api';
import { PasswordInput } from '@/components/ui/PasswordInput';
export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
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
            const res = await registerRequest(name.trim(), email.trim(), password);
            router.push(
                `/verify-email?email=${encodeURIComponent(res.email)}&registered=1`,
            );
        } catch (err) {
            setError(
                err instanceof ApiClientError
                    ? err.message
                    : 'Không kết nối backend.',
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-[60vh] items-center justify-center bg-neutral px-6 py-12">
            <div className="w-full max-w-md">
                <h1 className="font-display text-center text-2xl font-bold text-primary">
                    Get Started
                </h1>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Tạo tài khoản học sinh để lưu hồ sơ và gợi ý.
                </p>
                <form onSubmit={handleSubmit} className="card mt-8 space-y-4 p-6">
                    <div>
                        <label htmlFor="name" className="text-sm font-medium text-slate-700">
                            Họ và tên
                        </label>
                        <input
                            id="name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-field mt-1"
                        />
                    </div>
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
                        <label htmlFor="password" className="text-sm font-medium text-slate-700">
                            Mật khẩu
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
                        {loading ? 'Đang tạo…' : 'Đăng ký'}
                    </button>
                    <p className="text-center text-sm text-slate-600">
                        Đã có tài khoản?{' '}
                        <Link href="/login" className="font-semibold text-tertiary hover:underline">
                            Đăng nhập
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
