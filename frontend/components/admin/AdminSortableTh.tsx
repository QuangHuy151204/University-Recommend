'use client';

import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import type { TableSortState } from '@/lib/admin-table-sort';
import { cn } from '@/lib/utils';

interface AdminSortableThProps {
    label: string;
    sortKey: string;
    sort: TableSortState | null;
    onSort: (key: string) => void;
    className?: string;
}

export function AdminSortableTh({
    label,
    sortKey,
    sort,
    onSort,
    className,
}: AdminSortableThProps) {
    const isActive = sort?.key === sortKey;
    const Icon = !isActive
        ? ArrowUpDown
        : sort.direction === 'asc'
          ? ArrowUp
          : ArrowDown;

    return (
        <th
            className={cn('px-4 py-3', className)}
            aria-sort={
                isActive
                    ? sort.direction === 'asc'
                        ? 'ascending'
                        : 'descending'
                    : 'none'
            }
        >
            <button
                type="button"
                onClick={() => onSort(sortKey)}
                className={cn(
                    'inline-flex items-center gap-1.5 font-medium transition-colors hover:text-slate-900',
                    isActive ? 'text-slate-900' : 'text-slate-600',
                )}
            >
                {label}
                <Icon className="size-3.5 shrink-0 opacity-70" aria-hidden />
            </button>
        </th>
    );
}
