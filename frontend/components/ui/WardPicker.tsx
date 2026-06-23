'use client';

import { useEffect, useState } from 'react';
import { listWards } from '@/services/universities';
import { useLocale } from '@/lib/i18n/locale';

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
    label,
    value = '',
    onChange,
    includeAny = true,
    anyLabel,
    disabled = false,
    helperText,
    showHelper,
    variant = 'default',
}: Props) {
    const { t } = useLocale();
    const resolvedLabel = label ?? t('picker.ward.defaultLabel');
    const resolvedAnyLabel = anyLabel ?? t('picker.ward.defaultAny');
    const resolvedHelper = helperText ?? t('picker.ward.helper');

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
                {resolvedLabel}
            </label>
            <select
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled || loading}
                className={`input-field ${variant === 'filter' ? 'mt-2' : ''}`}
            >
                {includeAny ? <option value="">{resolvedAnyLabel}</option> : null}
                {loading ? (
                    <option value="" disabled>
                        {t('picker.ward.loading')}
                    </option>
                ) : loadError ? (
                    <option value="" disabled>
                        {t('picker.ward.loadError')}
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
                <p className="mt-1 text-xs text-slate-500">{resolvedHelper}</p>
            ) : null}
        </div>
    );
}
