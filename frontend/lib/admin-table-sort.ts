'use client';

import { useCallback, useMemo, useState } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface TableSortState {
    key: string;
    direction: SortDirection;
}

export function compareValues(
    a: unknown,
    b: unknown,
    direction: SortDirection,
): number {
    const mul = direction === 'asc' ? 1 : -1;

    if (a == null && b == null) return 0;
    if (a == null) return 1 * mul;
    if (b == null) return -1 * mul;

    if (typeof a === 'number' && typeof b === 'number') {
        if (a === b) return 0;
        return (a < b ? -1 : 1) * mul;
    }

    return (
        String(a).localeCompare(String(b), 'vi', { sensitivity: 'base' }) * mul
    );
}

export function sortRows<T>(
    rows: T[],
    sort: TableSortState | null,
    getValue: (row: T, key: string) => unknown,
): T[] {
    if (!sort) return rows;
    return [...rows].sort((a, b) =>
        compareValues(getValue(a, sort.key), getValue(b, sort.key), sort.direction),
    );
}

export function useTableSort(initial: TableSortState | null = null) {
    const [sort, setSort] = useState<TableSortState | null>(initial);

    const toggleSort = useCallback((key: string) => {
        setSort((prev) => {
            if (prev?.key === key) {
                return {
                    key,
                    direction: prev.direction === 'asc' ? 'desc' : 'asc',
                };
            }
            return { key, direction: 'asc' };
        });
    }, []);

    return { sort, toggleSort, setSort };
}

export function useSortedRows<T>(
    rows: T[],
    getValue: (row: T, key: string) => unknown,
    initial: TableSortState | null = null,
) {
    const { sort, toggleSort } = useTableSort(initial);
    const sortedRows = useMemo(
        () => sortRows(rows, sort, getValue),
        [rows, sort, getValue],
    );
    return { sortedRows, sort, toggleSort };
}
