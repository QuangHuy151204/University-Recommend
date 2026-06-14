'use client';

import {
    forwardRef,
    useEffect,
    useId,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import { ChevronDown, X } from 'lucide-react';
import { getMajor, listAllMajors } from '@/services/majors';
import type { Major } from '@/types';

export type MajorResolveResult = {
    majorId: number | null;
    /** true khi đã gõ tên ngành nhưng không khớp được — chặn áp dụng bộ lọc. */
    blocked: boolean;
};

export type MajorSearchPickerHandle = {
    /** Khớp ngành từ lựa chọn hoặc tên đã gõ trước khi áp dụng bộ lọc. */
    resolveValue: () => Promise<MajorResolveResult>;
};

interface Props {
    value: number | null;
    onChange: (majorId: number | null) => void;
    id?: string;
    label?: string;
    hint?: string;
}

function filterMajorsByQuery(majors: Major[], query: string): Major[] {
    const term = query.trim().toLowerCase();
    if (!term) return majors;
    return majors.filter((m) => m.name.toLowerCase().includes(term));
}

export const MajorSearchPicker = forwardRef<MajorSearchPickerHandle, Props>(
    function MajorSearchPicker(
        {
            value,
            onChange,
            id: idProp,
            label = 'Ngành',
            hint = 'bấm chọn trong danh sách',
        },
        ref,
    ) {
        const autoId = useId();
        const id = idProp ?? autoId;
        const rootRef = useRef<HTMLDivElement>(null);
        const inputRef = useRef<HTMLInputElement>(null);
        const allMajorsRef = useRef<Major[] | null>(null);

        const [open, setOpen] = useState(false);
        const [query, setQuery] = useState('');
        const [options, setOptions] = useState<Major[]>([]);
        const [selected, setSelected] = useState<Major | null>(null);
        const [loading, setLoading] = useState(false);
        const [loadError, setLoadError] = useState<string | null>(null);
        const [resolveError, setResolveError] = useState<string | null>(null);

        useEffect(() => {
            if (!value || selected?.id === value) return;

            let cancelled = false;
            (async () => {
                try {
                    const major = await getMajor(value);
                    if (!cancelled) setSelected(major);
                } catch {
                    if (!cancelled) setSelected(null);
                }
            })();
            return () => {
                cancelled = true;
            };
        }, [value, selected?.id]);

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

        useEffect(() => {
            if (!open) return;

            let cancelled = false;

            (async () => {
                if (!allMajorsRef.current) {
                    setLoading(true);
                    setLoadError(null);
                    try {
                        allMajorsRef.current = await listAllMajors();
                    } catch {
                        if (!cancelled) {
                            setLoadError('Không tải được danh sách ngành.');
                            setOptions([]);
                        }
                        return;
                    } finally {
                        if (!cancelled) setLoading(false);
                    }
                }

                if (!cancelled && allMajorsRef.current) {
                    setOptions(filterMajorsByQuery(allMajorsRef.current, query));
                }
            })();

            return () => {
                cancelled = true;
            };
        }, [open, query]);

        async function resolveValueInternal(): Promise<MajorResolveResult> {
            setResolveError(null);
            if (value != null) {
                return { majorId: value, blocked: false };
            }

            const term = query.trim();
            if (!term) return { majorId: null, blocked: false };

            if (!allMajorsRef.current) {
                try {
                    allMajorsRef.current = await listAllMajors();
                } catch {
                    setResolveError('Không tải được danh sách ngành.');
                    return { majorId: null, blocked: true };
                }
            }

            const pool = filterMajorsByQuery(allMajorsRef.current, term);

            const exact = pool.find(
                (m) => m.name.toLowerCase() === term.toLowerCase(),
            );
            if (exact) {
                onChange(exact.id);
                setSelected(exact);
                setQuery('');
                return { majorId: exact.id, blocked: false };
            }

            if (pool.length === 1) {
                onChange(pool[0].id);
                setSelected(pool[0]);
                setQuery('');
                return { majorId: pool[0].id, blocked: false };
            }

            setResolveError(
                'Chọn ngành trong danh sách gợi ý (bấm vào tên ngành).',
            );
            setOpen(true);
            return { majorId: null, blocked: true };
        }

        useImperativeHandle(
            ref,
            () => ({
                resolveValue: resolveValueInternal,
            }),
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [value, query, onChange],
        );

        function pick(major: Major | null) {
            setResolveError(null);
            onChange(major?.id ?? null);
            setSelected(major);
            setOpen(false);
            setQuery('');
            inputRef.current?.blur();
        }

        function handleFocus() {
            setOpen(true);
            setResolveError(null);
            if (displayMajor && !query) {
                setQuery(displayMajor.name);
            }
        }

        function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
            const v = e.target.value;
            setQuery(v);
            setOpen(true);
            setResolveError(null);
            if (!v.trim()) {
                onChange(null);
                setSelected(null);
            }
        }

        function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
            if (e.key === 'Escape') {
                setOpen(false);
                setQuery('');
                inputRef.current?.blur();
            }
            if (e.key === 'Enter' && options.length === 1) {
                e.preventDefault();
                pick(options[0]);
            }
        }

        const displayMajor =
            value != null && selected?.id === value ? selected : null;

        const displayValue = open
            ? query
            : displayMajor
              ? displayMajor.name
              : '';

        return (
            <div ref={rootRef} className="relative">
                <label
                    htmlFor={`${id}-input`}
                    className="text-xs font-semibold uppercase text-slate-500"
                >
                    {label}
                    {hint ? (
                        <span className="ml-1 font-normal normal-case text-slate-400">
                            ({hint})
                        </span>
                    ) : null}
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
                        placeholder="Tìm tên ngành…"
                        onFocus={handleFocus}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        className={`input-field w-full pr-16 text-sm ${resolveError ? 'border-amber-400 ring-amber-100' : ''}`}
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
                        {value && !open && (
                            <button
                                type="button"
                                tabIndex={-1}
                                aria-label="Bỏ chọn ngành"
                                className="pointer-events-auto rounded p-1 text-slate-400 hover:text-slate-600"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    pick(null);
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

                {resolveError && (
                    <p className="mt-1.5 text-xs font-medium text-amber-700">
                        {resolveError}
                    </p>
                )}

                {loadError && (
                    <p className="mt-1.5 text-xs text-amber-700">{loadError}</p>
                )}

                {open && (
                    <ul
                        id={`${id}-listbox`}
                        role="listbox"
                        className="absolute left-0 right-0 z-30 mt-1 max-h-52 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
                        aria-label="Danh sách ngành"
                    >
                        {loading && options.length === 0 ? (
                            <li className="px-3 py-4 text-center text-xs text-slate-500">
                                Đang tải danh sách ngành…
                            </li>
                        ) : options.length === 0 ? (
                            <li className="px-3 py-4 text-center text-xs text-slate-500">
                                Không tìm thấy ngành phù hợp
                            </li>
                        ) : (
                            options.map((item) => {
                                const active = value === item.id;
                                return (
                                    <li key={item.id}>
                                        <button
                                            type="button"
                                            role="option"
                                            aria-selected={active}
                                            onMouseDown={(e) =>
                                                e.preventDefault()
                                            }
                                            onClick={() => pick(item)}
                                            className={`flex w-full px-3 py-2 text-left text-sm transition-colors ${
                                                active
                                                    ? 'bg-primary/10 font-semibold text-primary'
                                                    : 'text-slate-700 hover:bg-slate-50'
                                            }`}
                                        >
                                            {item.name}
                                        </button>
                                    </li>
                                );
                            })
                        )}
                    </ul>
                )}
            </div>
        );
    },
);
