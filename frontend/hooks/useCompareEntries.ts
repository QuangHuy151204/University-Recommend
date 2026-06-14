'use client';

import { useSyncExternalStore } from 'react';
import {
    getCompareSnapshot,
    getServerCompareSnapshot,
    subscribeCompareStorage,
    type CompareEntry,
} from '@/lib/university-compare';

export function useCompareEntries(): CompareEntry[] {
    return useSyncExternalStore(
        subscribeCompareStorage,
        getCompareSnapshot,
        getServerCompareSnapshot,
    );
}
