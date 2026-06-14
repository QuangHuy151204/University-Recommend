'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Loader2 } from 'lucide-react';
import { UniversityCompareView } from '@/components/universities/UniversityCompareView';
import { buildComparePath } from '@/lib/university-compare';
import { getUniversitiesByIds } from '@/services/universities';
import type { UniversityDetail } from '@/types';

interface Props {
    universityIds: number[];
}

export function ChatCompareCard({ universityIds }: Props) {
    const ids = useMemo(
        () => [...new Set(universityIds)].filter((id) => id > 0).slice(0, 2),
        [universityIds],
    );
    const [universities, setUniversities] = useState<UniversityDetail[]>([]);
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState<string | null>(
        ids.length < 2 ? 'Chưa đủ trường để so sánh.' : null,
    );
    const [prevIdsKey, setPrevIdsKey] = useState('');

    const idsKey = ids.join(',');
    if (idsKey !== prevIdsKey) {
        setPrevIdsKey(idsKey);
        setUniversities([]);
        setFetching(ids.length >= 2);
        setError(ids.length < 2 ? 'Chưa đủ trường để so sánh.' : null);
    }

    useEffect(() => {
        if (ids.length < 2) return;

        let cancelled = false;

        void getUniversitiesByIds(ids).then((result) => {
            if (cancelled) return;
            if (result.universities.length < 2) {
                setError('Không tải đủ dữ liệu trường để hiển thị bảng so sánh.');
                setUniversities([]);
            } else {
                setUniversities(result.universities);
            }
            setFetching(false);
        });

        return () => {
            cancelled = true;
        };
    }, [ids]);

    if (ids.length < 2) {
        return (
            <p className="mt-3 text-xs text-slate-500">
                {error ?? 'Chưa đủ trường để so sánh.'}
            </p>
        );
    }

    if (fetching) {
        return (
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
                <Loader2 className="size-4 animate-spin" />
                Đang tải bảng so sánh…
            </div>
        );
    }

    if (error || universities.length < 2) {
        return (
            <p className="mt-3 text-xs text-slate-500">
                {error ?? 'Không hiển thị được bảng so sánh.'}
            </p>
        );
    }

    const compareHref = buildComparePath(universities.map((u) => u.id));

    return (
        <div className="mt-3 space-y-3">
            <UniversityCompareView universities={universities} embedded />
            <Link
                href={compareHref}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
            >
                Mở trang so sánh đầy đủ
                <ExternalLink className="size-3.5" />
            </Link>
        </div>
    );
}
