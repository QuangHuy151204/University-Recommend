'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Scale } from 'lucide-react';
import {
    buildComparePath,
    COMPARE_MAX,
    toggleStoredUniversity,
    type CompareEntry,
} from '@/lib/university-compare';
import { useCompareEntries } from '@/hooks/useCompareEntries';
import { cn } from '@/lib/utils';

interface Props {
    universityId: number;
    universityName: string;
    universityShortName?: string | null;
    className?: string;
    variant?: 'button' | 'link';
}

export function CompareUniversityButton({
    universityId,
    universityName,
    universityShortName = null,
    className,
    variant = 'button',
}: Props) {
    const router = useRouter();
    const entries = useCompareEntries();
    const selected = entries.some((e) => e.id === universityId);
    const storedCount = entries.length;

    const entry: CompareEntry = {
        id: universityId,
        name: universityName,
        short_name: universityShortName,
    };

    const toggle = () => {
        toggleStoredUniversity(entry);
    };

    const baseClass =
        variant === 'link'
            ? 'inline-flex items-center gap-1.5 text-sm font-medium text-tertiary hover:text-primary'
            : 'btn-secondary inline-flex items-center gap-2';

    if (selected && storedCount >= 2) {
        return (
            <div className={cn('flex flex-wrap gap-2', className)}>
                <button
                    type="button"
                    onClick={toggle}
                    className={cn(
                        baseClass,
                        variant === 'button' && '!border-danger/30 !text-danger',
                    )}
                >
                    Bỏ khỏi so sánh
                </button>
                <Link
                    href={buildComparePath(entries.map((e) => e.id))}
                    className="btn-primary inline-flex items-center gap-2"
                >
                    <Scale className="size-4" />
                    So sánh ({storedCount})
                </Link>
            </div>
        );
    }

    return (
        <button
            type="button"
            onClick={() => {
                if (selected) {
                    toggle();
                    return;
                }
                if (storedCount >= COMPARE_MAX) return;
                const next = toggleStoredUniversity(entry);
                if (next.length >= 2) {
                    router.push(buildComparePath(next.map((e) => e.id)));
                }
            }}
            disabled={!selected && storedCount >= COMPARE_MAX}
            title={
                storedCount >= COMPARE_MAX && !selected
                    ? `Tối đa ${COMPARE_MAX} trường`
                    : undefined
            }
            className={cn(baseClass, className)}
        >
            <Scale className="size-4" />
            {selected ? 'Đã chọn so sánh' : 'Thêm vào so sánh'}
        </button>
    );
}
