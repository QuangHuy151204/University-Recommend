'use client';



import { useEffect, useState } from 'react';

import { Heart } from 'lucide-react';

import { useRouter } from 'next/navigation';

import { useAuth } from '@/lib/auth';

import { ApiClientError } from '@/lib/api';

import {

    addFavoriteProgram,

    listFavorites,

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

                    (f) => f.university_major_id === universityMajorId,

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

    }, [token, universityMajorId]);



    async function toggle(e: React.MouseEvent) {

        e.preventDefault();

        e.stopPropagation();

        if (!token) {

            router.push('/login?redirect=/profile#favorites');

            return;

        }

        if (loading) return;

        setLoading(true);

        try {

            if (favoriteId != null) {

                await removeFavoriteByProgram(universityMajorId, token);

                setFavoriteId(null);

            } else {

                const created = await addFavoriteProgram(universityMajorId, token);

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

                'inline-flex items-center gap-1.5 rounded-lg border text-xs font-medium transition-colors',

                compact ? 'px-2 py-1' : 'px-2.5 py-1.5',

                active

                    ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'

                    : 'border-slate-200 bg-white text-slate-600 hover:border-primary/30 hover:text-primary',

                className,

            )}

            aria-pressed={active}

            title={active ? 'Bỏ yêu thích ngành' : 'Lưu ngành yêu thích'}

        >

            <Heart

                className={cn('size-3.5', active && 'fill-current')}

                aria-hidden

            />

            {loading ? '…' : active ? 'Đã lưu' : compact ? 'Lưu' : 'Yêu thích ngành'}

        </button>

    );

}

