'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BookOpen, Heart, MapPin, School } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useFavorites } from '@/lib/favorites';
import { ApiClientError } from '@/lib/api';
import { removeFavorite } from '@/services/favorites';
import { AlertBox } from '@/components/ui/PageLayout';
import { formatTuitionVnd } from '@/lib/utils';

export function FavoritesSection() {
    const { token } = useAuth();
    const { items, loading, error, removeItemById } = useFavorites();
    const [actionError, setActionError] = useState<string | null>(null);

    async function handleRemove(id: number) {
        if (!token) return;
        setActionError(null);
        try {
            await removeFavorite(id, token);
            removeItemById(id);
        } catch (err) {
            setActionError(
                err instanceof ApiClientError
                    ? err.message
                    : 'Không xóa được mục yêu thích.',
            );
        }
    }

    const universities = items.filter((i) => i.favorite_type === 'university');
    const programs = items.filter((i) => i.favorite_type === 'program');
    const displayError = actionError ?? error;

    if (!token) {
        return (
            <section id="favorites" className="card scroll-mt-24 space-y-4 p-6 sm:p-8">
                <h2 className="font-display font-bold text-primary">Yêu thích</h2>
                <p className="text-sm text-slate-600">
                    Đăng nhập để lưu và xem trường, ngành yêu thích.
                </p>
                <Link href="/login?redirect=/profile#favorites" className="btn-primary inline-flex text-sm">
                    Đăng nhập
                </Link>
            </section>
        );
    }

    if (loading) {
        return (
            <p className="text-sm text-slate-500">Đang tải yêu thích…</p>
        );
    }

    return (
        <section id="favorites" className="card scroll-mt-24 space-y-5 p-6 sm:p-8">
            <div className="flex items-center gap-2 text-primary">
                <Heart className="size-5" aria-hidden />
                <h2 className="font-display font-bold">Yêu thích</h2>
            </div>
            <p className="text-sm text-slate-600">
                Trường và ngành bạn đã lưu — bấm Yêu thích ở trang trường hoặc
                ngành để thêm.
            </p>

            {displayError && <AlertBox variant="error">{displayError}</AlertBox>}

            {items.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-6 text-center">
                    <Heart className="mx-auto size-8 text-slate-300" aria-hidden />
                    <p className="mt-3 text-sm text-slate-600">
                        Chưa có mục yêu thích nào.
                    </p>
                    <Link href="/universities" className="btn-primary mt-4 inline-flex text-sm">
                        Tra cứu trường
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {universities.length > 0 && (
                        <div>
                            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <School className="size-4" aria-hidden />
                                Trường ({universities.length})
                            </h3>
                            <ul className="grid gap-3 sm:grid-cols-2">
                                {universities.map((item) => {
                                    const u = item.university;
                                    return (
                                        <li
                                            key={item.id}
                                            className="rounded-xl border border-slate-100 bg-white p-4"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <Link
                                                        href={`/universities/${u.id}`}
                                                        className="font-display text-sm font-bold text-primary hover:underline"
                                                    >
                                                        {u.name}
                                                    </Link>
                                                    {u.short_name && (
                                                        <p className="text-xs text-slate-500">
                                                            {u.short_name}
                                                        </p>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemove(item.id)}
                                                    className="shrink-0 text-xs text-rose-600 hover:underline"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                            <p className="mt-2 flex items-center gap-1 text-xs text-slate-600">
                                                <MapPin className="size-3.5" aria-hidden />
                                                {u.location ?? 'Hà Nội'}
                                            </p>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}

                    {programs.length > 0 && (
                        <div>
                            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <BookOpen className="size-4" aria-hidden />
                                Ngành tại trường ({programs.length})
                            </h3>
                            <ul className="grid gap-3 sm:grid-cols-2">
                                {programs.map((item) => {
                                    const prog = item.university_major;
                                    if (!prog) return null;
                                    const u = prog.university ?? item.university;
                                    return (
                                        <li
                                            key={item.id}
                                            className="rounded-xl border border-slate-100 bg-white p-4"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <Link
                                                        href={`/majors/${prog.major.id}`}
                                                        className="font-display text-sm font-bold text-primary hover:underline"
                                                    >
                                                        {prog.major.name}
                                                    </Link>
                                                    <p className="text-xs text-slate-500">
                                                        <Link
                                                            href={`/universities/${u.id}`}
                                                            className="hover:text-primary"
                                                        >
                                                            {u.short_name || u.name}
                                                        </Link>
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemove(item.id)}
                                                    className="shrink-0 text-xs text-rose-600 hover:underline"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                            {prog.tuition_fee != null && (
                                                <p className="mt-2 text-xs text-slate-600">
                                                    Học phí:{' '}
                                                    {formatTuitionVnd(
                                                        prog.tuition_fee,
                                                        prog.tuition_fee,
                                                    )}
                                                </p>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
