'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useFavorites } from '@/lib/favorites';
import { ApiClientError } from '@/lib/api';
import {
    addFavoriteProgram,
    removeFavoriteByProgram,
} from '@/services/favorites';
import { cn } from '@/lib/utils';

interface Props {
    universityMajorId: number;
    className?: string;
    compact?: boolean;
}

export function FavoriteProgramButton({
    universityMajorId,
    className,
    compact = false,
}: Props) {
    const { token } = useAuth();
    const router = useRouter();
    const {
        loading: favoritesLoading,
        findProgramFavoriteId,
        upsertItem,
        removeItemById,
    } = useFavorites();
    const [loading, setLoading] = useState(false);

    const favoriteId = token ? findProgramFavoriteId(universityMajorId) : null;
    const ready = !token || !favoritesLoading;

    async function toggle() {
        if (!token) {
            router.push('/login?redirect=/profile#favorites');
            return;
        }
        if (loading) return;
        setLoading(true);
        try {
            if (favoriteId != null) {
                await removeFavoriteByProgram(universityMajorId, token);
                removeItemById(favoriteId);
            } else {
                const created = await addFavoriteProgram(universityMajorId, token);
                upsertItem(created);
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
                'inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium transition-colors',
                active
                    ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-primary/30 hover:text-primary',
                className,
            )}
            aria-pressed={active}
            title={active ? 'Bỏ yêu thích ngành' : 'Yêu thích ngành'}
        >
            <Heart
                className={cn(compact ? 'size-3.5' : 'size-4', active && 'fill-current')}
                aria-hidden
            />
            {loading ? '…' : active ? 'Đã lưu' : compact ? 'Lưu' : 'Yêu thích ngành'}
        </button>
    );
}
