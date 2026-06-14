'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { listSubjectCombinations } from '@/services/cutoff-scores';
import type { SubjectCombinationOption } from '@/services/cutoff-scores';
import {
    filterCombinationOptions,
    subjectCombinationLabel,
} from '@/lib/subject-combinations';

interface Props {
    value: string;
    onChange: (code: string) => void;
    id?: string;
    label?: string;
}

export function SubjectCombinationPicker({
    value,
    onChange,
    id: idProp,
    label = 'Khối thi',
}: Props) {
    const autoId = useId();
    const id = idProp ?? autoId;
    const rootRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [options, setOptions] = useState<SubjectCombinationOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            setLoadError(null);
            try {
                const rows = await listSubjectCombinations();
                if (!cancelled) setOptions(rows);
            } catch {
                if (!cancelled) {
                    setLoadError('Không tải được danh sách tổ hợp từ hệ thống.');
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const filtered = filterCombinationOptions(query, options);
    const selectedLabel = value ? subjectCombinationLabel(value) : null;

    useEffect(() => {
        if (!open) return;
        const onDocClick = (e: MouseEvent) => {
            if (!rootRef.current?.contains(e.target as Node)) {
                setOpen(false);
                setQuery('');
            }
        };
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, [open]);

    function pick(code: string) {
        onChange(code);
        setOpen(false);
        setQuery('');
        inputRef.current?.blur();
    }

    function handleFocus() {
        setOpen(true);
        if (value && !query) {
            setQuery(value);
        }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const v = e.target.value;
        setQuery(v);
        setOpen(true);
        const trimmed = v.trim().toUpperCase();
        if (!trimmed) {
            onChange('');
            return;
        }
        const exact = options.find((o) => o.code === trimmed);
        if (exact) {
            onChange(exact.code);
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Escape') {
            setOpen(false);
            setQuery('');
            inputRef.current?.blur();
        }
        if (e.key === 'Enter' && filtered.length === 1) {
            e.preventDefault();
            pick(filtered[0].code);
        }
    }

    const displayValue = open
        ? query
        : value
          ? selectedLabel
              ? `${value} (${selectedLabel})`
              : value
          : '';

    return (
        <div ref={rootRef} className="relative">
            <label
                htmlFor={`${id}-input`}
                className="text-xs font-semibold uppercase text-slate-500"
            >
                {label}
            </label>

            <div className="relative mt-2">
                <input
                    ref={inputRef}
                    id={`${id}-input`}
                    type="text"
                    role="combobox"
                    aria-expanded={open}
                    aria-autocomplete="list"
                    aria-controls={`${id}-listbox`}
                    autoComplete="off"
                    value={displayValue}
                    placeholder={loading ? 'Đang tải tổ hợp…' : 'Tổ hợp môn'}
                    disabled={loading && options.length === 0}
                    onFocus={handleFocus}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="input-field w-full pr-16 text-sm"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
                    {value && !open && (
                        <button
                            type="button"
                            tabIndex={-1}
                            aria-label="Bỏ chọn khối"
                            className="pointer-events-auto rounded p-1 text-slate-400 hover:text-slate-600"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                onChange('');
                                setQuery('');
                            }}
                        >
                            <X className="size-4" />
                        </button>
                    )}
                    <ChevronDown
                        className={`size-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
                    />
                </div>
            </div>

            {loadError && (
                <p className="mt-1.5 text-xs text-amber-700">{loadError}</p>
            )}

            {open && (
                <ul
                    id={`${id}-listbox`}
                    role="listbox"
                    className="absolute left-0 right-0 z-30 mt-1 max-h-52 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
                    aria-label="Danh sách tổ hợp môn"
                >
                    {!query.trim() && (
                        <li>
                            <button
                                type="button"
                                role="option"
                                aria-selected={!value}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => pick('')}
                                className="flex w-full px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50"
                            >
                                Tất cả khối
                            </button>
                        </li>
                    )}
                    {filtered.length === 0 ? (
                        <li className="px-3 py-4 text-center text-xs text-slate-500">
                            {loading
                                ? 'Đang tải…'
                                : 'Không tìm thấy tổ hợp trong dữ liệu'}
                        </li>
                    ) : (
                        filtered.slice(0, 80).map((item) => {
                            const active = value === item.code;
                            const sub = subjectCombinationLabel(item.code);
                            return (
                                <li key={item.code}>
                                    <button
                                        type="button"
                                        role="option"
                                        aria-selected={active}
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => pick(item.code)}
                                        className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors ${
                                            active
                                                ? 'bg-primary/10 font-semibold text-primary'
                                                : 'text-slate-700 hover:bg-slate-50'
                                        }`}
                                    >
                                        <span>{item.code}</span>
                                        {sub ? (
                                            <span className="truncate text-xs text-slate-500">
                                                {sub}
                                            </span>
                                        ) : null}
                                    </button>
                                </li>
                            );
                        })
                    )}
                </ul>
            )}
        </div>
    );
}
