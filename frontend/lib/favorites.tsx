'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { useAuth } from '@/lib/auth';
import { ApiClientError } from '@/lib/api';
import {
    listFavorites,
    type FavoriteItem,
} from '@/services/favorites';

type FavoritesContextValue = {
    items: FavoriteItem[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    findUniversityFavoriteId: (universityId: number) => number | null;
    findProgramFavoriteId: (universityMajorId: number) => number | null;
    upsertItem: (item: FavoriteItem) => void;
    removeItemById: (favoriteId: number) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const { token } = useAuth();
    const [items, setItems] = useState<FavoriteItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [prevToken, setPrevToken] = useState(token);

    if (token !== prevToken) {
        setPrevToken(token);
        setItems([]);
        setError(null);
        setLoading(Boolean(token));
    }

    const refresh = useCallback(async () => {
        if (!token) {
            setItems([]);
            setError(null);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await listFavorites(token);
            setItems(data);
        } catch (err) {
            setItems([]);
            setError(
                err instanceof ApiClientError
                    ? err.message
                    : 'Không tải được danh sách yêu thích.',
            );
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (!token) return;

        let cancelled = false;

        listFavorites(token)
            .then((data) => {
                if (!cancelled) setItems(data);
            })
            .catch((err) => {
                if (!cancelled) {
                    setItems([]);
                    setError(
                        err instanceof ApiClientError
                            ? err.message
                            : 'Không tải được danh sách yêu thích.',
                    );
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [token]);

    const findUniversityFavoriteId = useCallback(
        (universityId: number) => {
            const hit = items.find(
                (f) =>
                    f.favorite_type === 'university' &&
                    f.university_id === universityId,
            );
            return hit?.id ?? null;
        },
        [items],
    );

    const findProgramFavoriteId = useCallback(
        (universityMajorId: number) => {
            const hit = items.find(
                (f) => f.university_major_id === universityMajorId,
            );
            return hit?.id ?? null;
        },
        [items],
    );

    const upsertItem = useCallback((item: FavoriteItem) => {
        setItems((prev) => {
            const without = prev.filter((f) => f.id !== item.id);
            return [item, ...without];
        });
    }, []);

    const removeItemById = useCallback((favoriteId: number) => {
        setItems((prev) => prev.filter((f) => f.id !== favoriteId));
    }, []);

    const value = useMemo(
        () => ({
            items,
            loading,
            error,
            refresh,
            findUniversityFavoriteId,
            findProgramFavoriteId,
            upsertItem,
            removeItemById,
        }),
        [
            items,
            loading,
            error,
            refresh,
            findUniversityFavoriteId,
            findProgramFavoriteId,
            upsertItem,
            removeItemById,
        ],
    );

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites(): FavoritesContextValue {
    const ctx = useContext(FavoritesContext);
    if (!ctx) {
        throw new Error('useFavorites must be used within FavoritesProvider');
    }
    return ctx;
}
