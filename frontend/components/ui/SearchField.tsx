'use client';

import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchFieldProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    id?: string;
    className?: string;
}

/** Ô tìm kiếm client-side — lọc danh sách ngay trên trang. */
export function SearchField({
    value,
    onChange,
    placeholder = 'Tìm kiếm...',
    id,
    className,
}: SearchFieldProps) {
    return (
        <div className={cn('relative min-w-0 flex-1 sm:max-w-xs', className)}>
            <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                aria-hidden
            />
            <input
                id={id}
                type="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="input-field !w-full !pl-10"
            />
        </div>
    );
}
