'use client';

import { useEffect, useState } from 'react';
import { listWards } from '@/services/universities';

type Props = {
    id?: string;
    label?: string;
    value?: string;
    onChange: (ward: string) => void;
    includeAny?: boolean;
    anyLabel?: string;
    disabled?: boolean;
    helperText?: string;
    showHelper?: boolean;
    variant?: 'default' | 'filter';
};

export function WardPicker({
    id = 'ward-picker',
    label = 'Khu vực',
    value = '',
    onChange,
    includeAny = true,
    anyLabel = 'Tất cả phường (Hà Nội)',
    disabled = false,
    helperText,
    showHelper,
    variant = 'default',
}: Props) {
    const [wards, setWards] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        let cancelled = false;
        listWards()
            .then((res) => {
                if (!cancelled) setWards(res.data);
            })
            .catch(() => {
                if (!cancelled) setLoadError(true);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const labelClass =
        variant === 'filter'
            ? 'text-xs font-semibold uppercase text-slate-500'
            : 'mb-1.5 block text-sm font-medium text-slate-700';
    const shouldShowHelper = showHelper ?? variant !== 'filter';

    return (
        <div>
            <label htmlFor={id} className={labelClass}>
                {label}
            </label>
            <select
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled || loading}
                className={`input-field ${variant === 'filter' ? 'mt-2' : ''}`}
            >
                {includeAny ? <option value="">{anyLabel}</option> : null}
                {loading ? (
                    <option value="" disabled>
                        Đang tải danh sách khu vực…
                    </option>
                ) : loadError ? (
                    <option value="" disabled>
                        Không tải được danh sách khu vực
                    </option>
                ) : (
                    wards.map((w) => (
                        <option key={w} value={w}>
                            {w}
                        </option>
                    ))
                )}
            </select>
            {shouldShowHelper ? (
                <p className="mt-1 text-xs text-slate-500">
                    {helperText ??
                        'Hệ thống chỉ hỗ trợ trường tại Hà Nội. Chọn khu vực bạn muốn ở gần để ưu tiên gợi ý (trường khác khu vực vẫn có thể xuất hiện).'}
                </p>
            ) : null}
        </div>
    );
}
