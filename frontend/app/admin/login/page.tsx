'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { adminLogin } from '@/services/auth';
import { ApiClientError } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { PasswordInput } from '@/components/ui/PasswordInput';

function AdminLoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/admin';
    const { login } = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (loading) return;
        setError(null);
        setLoading(true);
        try {
            const res = await adminLogin(username.trim(), password);
            if (res.user.role !== 'admin') {
                setError('Tài khoản không có quyền admin.');
                return;
            }
            login(res.access_token, res.user);
            router.push(redirect);
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
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-12">
            <div className="w-full max-w-md">
                <h1 className="font-display text-center text-2xl font-bold text-primary">
                    Đăng nhập Admin
                </h1>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Quản lý trường, ngành, điểm chuẩn và phương thức xét tuyển.
                </p>
                <form onSubmit={handleSubmit} className="card mt-8 space-y-4 p-6">
                    <div>
                        <label
                            htmlFor="username"
                            className="text-sm font-medium text-slate-700"
                        >
                            Tên đăng nhập
                        </label>
                        <input
                            id="username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="input-field mt-1"
                            autoComplete="username"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="text-sm font-medium text-slate-700"
                        >
                            Mật khẩu
                        </label>
                        <PasswordInput
                            id="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            wrapperClassName="mt-1"
                            autoComplete="current-password"
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
                </form>
            </div>
        </div>
    );
}

export default function AdminLoginPage() {
    return (
        <Suspense fallback={null}>
            <AdminLoginForm />
        </Suspense>
    );
}
