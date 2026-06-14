'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { ApiClientError } from '@/lib/api';
import {
    addFavorite,
    listFavorites,
    removeFavoriteByUniversity,
} from '@/services/favorites';
import { cn } from '@/lib/utils';

interface Props {
    universityId: number;
    className?: string;
}

export function FavoriteButton({ universityId, className }: Props) {
    const { token } = useAuth();
    const router = useRouter();
    const [favoriteId, setFavoriteId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [ready, setReady] = useState(!token);
    const [prevToken, setPrevToken] = useState(token);

    if (token !== prevToken) {
        setPrevToken(token);
        setFavoriteId(null);
        setReady(!token);
    }

    useEffect(() => {
        if (!token) return;
        let cancelled = false;
        listFavorites(token)
            .then((items) => {
                if (cancelled) return;
                const hit = items.find(
                    (f) =>
                        f.favorite_type === 'university' &&
                        f.university_id === universityId,
                );

                setFavoriteId(hit?.id ?? null);
            })
            .catch(() => {
                if (!cancelled) setFavoriteId(null);
            })
            .finally(() => {
                if (!cancelled) setReady(true);
            });
        return () => {
            cancelled = true;
        };
    }, [token, universityId]);

    async function toggle() {
        if (!token) {
            router.push(`/login?redirect=/universities/${universityId}`);
            return;
        }
        if (loading) return;
        setLoading(true);
        try {
            if (favoriteId != null) {
                await removeFavoriteByUniversity(universityId, token);
                setFavoriteId(null);
            } else {
                const created = await addFavorite(universityId, token);
                setFavoriteId(created.id);
            }
        } catch (err) {
            const msg =
                err instanceof ApiClientError
                    ? err.message
                    : 'Không cập nhật được yêu thích.';
            window.alert(msg);
        } finally {
            setLoading(false);
        }
    }

    if (!ready) return null;

    const active = favoriteId != null;

    return (
        <button
            type="button"
            onClick={toggle}
            disabled={loading}
            className={cn(
                'inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                active
                    ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-primary/30 hover:text-primary',
                className,
            )}
            aria-pressed={active}
            title={active ? 'Bỏ yêu thích' : 'Lưu yêu thích'}
        >
            <Heart
                className={cn('size-4', active && 'fill-current')}
                aria-hidden
            />
            {loading ? 'Đang lưu…' : active ? 'Đã lưu' : 'Yêu thích'}
        </button>
    );
}
