'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    buildComparePath,
    readStoredCompareIds,
} from '@/lib/university-compare';

/** Khi vào /compare không có query, thử redirect từ localStorage. */
export function CompareIdsFromStorage() {
    const router = useRouter();

    useEffect(() => {
        const ids = readStoredCompareIds();
        if (ids.length >= 2) {
            router.replace(buildComparePath(ids));
        }
    }, [router]);

    return null;
}
