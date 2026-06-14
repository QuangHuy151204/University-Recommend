'use client';

/* eslint-disable react-hooks/set-state-in-effect -- admin tables fetch on filter change */
import { useCallback, useEffect, useState } from 'react';
import { listUniversities } from '@/services/universities';
import { listAdmissionMethods } from '@/services/admission-methods';
import {
    createCutoff,
    deleteCutoff,
    listCutoffsAdmin,
    listUniversityMajors,
    updateCutoff,
} from '@/services/admin';
import { ApiClientError } from '@/lib/api';
import type { AdmissionMethod, CutoffScore, University } from '@/types';

const EMPTY = {
    university_major_id: '',
    year: '2025',
    score: '',
    subject_combination: '',
    admission_method: '',
    note: '',
};

export function CutoffScoresPanel() {
    const [rows, setRows] = useState<CutoffScore[]>([]);
    const [universities, setUniversities] = useState<University[]>([]);
    const [methods, setMethods] = useState<AdmissionMethod[]>([]);
    const [uniMajorOptions, setUniMajorOptions] = useState<
        Array<{ id: number; label: string }>
    >([]);
    const [filterUniversityId, setFilterUniversityId] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [filterMethodCode, setFilterMethodCode] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editing, setEditing] = useState<CutoffScore | null>(null);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        Promise.all([
            listUniversities({ limit: 200 }),
            listAdmissionMethods(),
        ])
            .then(([u, m]) => {
                setUniversities(u.data);
                setMethods(m);
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (!filterUniversityId) {
            setUniMajorOptions([]);
            return;
        }
        listUniversityMajors({
            university_id: Number(filterUniversityId),
            limit: 200,
        })
            .then((res) =>
                setUniMajorOptions(
                    res.data.map((um) => ({
                        id: um.id,
                        label: `${um.major.name}${um.training_program ? ` (${um.training_program})` : ''}`,
                    })),
                ),
            )
            .catch(() => setUniMajorOptions([]));
    }, [filterUniversityId]);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await listCutoffsAdmin({
                university_id: filterUniversityId
                    ? Number(filterUniversityId)
                    : undefined,
                year: filterYear ? Number(filterYear) : undefined,
                method_code: filterMethodCode || undefined,
                page,
                limit: 30,
            });
            setRows(res.data);
            setTotalPages(res.totalPages);
        } catch (err) {
            setError(err instanceof ApiClientError ? err.message : 'Lỗi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    }, [filterUniversityId, filterYear, filterMethodCode, page]);

    useEffect(() => {
        void load();
    }, [load]);

    function openCreate() {
        setEditing(null);
        setForm(EMPTY);
    }

    function openEdit(row: CutoffScore) {
        setEditing(row);
        setForm({
            university_major_id: String(row.universityMajor?.id ?? ''),
            year: String(row.year),
            score: String(row.score),
            subject_combination: row.subject_combination ?? '',
            admission_method: row.admission_method ?? '',
            note: row.note ?? '',
        });
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            if (editing) {
                await updateCutoff(editing.id, {
                    year: Number(form.year),
                    score: Number(form.score),
                    subject_combination: form.subject_combination.trim() || undefined,
                    admission_method: form.admission_method.trim() || undefined,
                    note: form.note.trim() || undefined,
                });
            } else {
                await createCutoff({
                    university_major_id: Number(form.university_major_id),
                    year: Number(form.year),
                    score: Number(form.score),
                    subject_combination: form.subject_combination.trim() || undefined,
                    admission_method: form.admission_method.trim() || undefined,
                    note: form.note.trim() || undefined,
                });
            }
            setEditing(null);
            setForm(EMPTY);
            await load();
        } catch (err) {
            setError(err instanceof ApiClientError ? err.message : 'Lưu thất bại');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(row: CutoffScore) {
        if (!confirm(`Xóa điểm chuẩn id ${row.id}?`)) return;
        try {
            await deleteCutoff(row.id);
            await load();
        } catch (err) {
            setError(err instanceof ApiClientError ? err.message : 'Xóa thất bại');
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
                <select
                    value={filterUniversityId}
                    onChange={(e) => {
                        setFilterUniversityId(e.target.value);
                        setPage(1);
                    }}
                    className="input-field max-w-xs"
                >
                    <option value="">Tất cả trường</option>
                    {universities.map((u) => (
                        <option key={u.id} value={u.id}>
                            {u.short_name ?? u.name}
                        </option>
                    ))}
                </select>
                <select
                    value={filterYear}
                    onChange={(e) => {
                        setFilterYear(e.target.value);
                        setPage(1);
                    }}
                    className="input-field max-w-[120px]"
                >
                    <option value="">Mọi năm</option>
                    {[2025, 2024, 2023].map((y) => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>
                <select
                    value={filterMethodCode}
                    onChange={(e) => {
                        setFilterMethodCode(e.target.value);
                        setPage(1);
                    }}
                    className="input-field max-w-xs"
                >
                    <option value="">Mọi PT</option>
                    {methods.map((m) => (
                        <option key={m.id} value={m.method_code}>
                            {m.method_name}
                        </option>
                    ))}
                </select>
                <button type="button" onClick={() => void load()} className="btn-secondary">
                    Tải lại
                </button>
                <button type="button" onClick={openCreate} className="btn-primary">
                    Thêm điểm chuẩn
                </button>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSave} className="card grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
                {!editing && (
                    <select
                        required
                        value={form.university_major_id}
                        onChange={(e) =>
                            setForm({ ...form, university_major_id: e.target.value })
                        }
                        className="input-field sm:col-span-2"
                    >
                        <option value="">
                            {filterUniversityId
                                ? 'Chọn ngành tại trường *'
                                : 'Chọn trường ở bộ lọc trước'}
                        </option>
                        {uniMajorOptions.map((o) => (
                            <option key={o.id} value={o.id}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                )}
                <input
                    required
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    placeholder="Năm"
                    type="number"
                    className="input-field"
                />
                <input
                    required
                    value={form.score}
                    onChange={(e) => setForm({ ...form, score: e.target.value })}
                    placeholder="Điểm"
                    type="number"
                    step="0.01"
                    className="input-field"
                />
                <input
                    value={form.subject_combination}
                    onChange={(e) =>
                        setForm({ ...form, subject_combination: e.target.value })
                    }
                    placeholder="Tổ hợp (A00…)"
                    className="input-field"
                />
                <input
                    value={form.admission_method}
                    onChange={(e) =>
                        setForm({ ...form, admission_method: e.target.value })
                    }
                    placeholder="Phương thức (nhãn)"
                    className="input-field"
                />
                <input
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    placeholder="Ghi chú"
                    className="input-field"
                />
                <div className="flex gap-2 sm:col-span-2 lg:col-span-3">
                    <button type="submit" disabled={saving} className="btn-primary">
                        {saving ? 'Đang lưu…' : editing ? 'Cập nhật' : 'Tạo mới'}
                    </button>
                    {editing && (
                        <button type="button" onClick={openCreate} className="btn-secondary">
                            Hủy sửa
                        </button>
                    )}
                </div>
            </form>

            <div className="card overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
                        <tr>
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Trường / Ngành</th>
                            <th className="px-4 py-3">Năm</th>
                            <th className="px-4 py-3">Tổ hợp</th>
                            <th className="px-4 py-3">PT</th>
                            <th className="px-4 py-3">Điểm</th>
                            <th className="px-4 py-3" />
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-6 text-slate-500">
                                    Đang tải…
                                </td>
                            </tr>
                        ) : (
                            rows.map((row) => (
                                <tr key={row.id} className="border-b border-slate-100">
                                    <td className="px-4 py-3">{row.id}</td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium">
                                            {row.universityMajor?.university?.name ?? '—'}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {row.universityMajor?.major?.name ?? '—'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">{row.year}</td>
                                    <td className="px-4 py-3">
                                        {row.subject_combination ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {row.admission_method ?? '—'}
                                    </td>
                                    <td className="px-4 py-3 font-semibold">{row.score}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            type="button"
                                            onClick={() => openEdit(row)}
                                            className="text-tertiary hover:underline"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => void handleDelete(row)}
                                            className="ml-3 text-red-600 hover:underline"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-600">
                <span>
                    Trang {page} / {totalPages}
                </span>
                <div className="flex gap-2">
                    <button
                        type="button"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="btn-secondary"
                    >
                        Trước
                    </button>
                    <button
                        type="button"
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="btn-secondary"
                    >
                        Sau
                    </button>
                </div>
            </div>
        </div>
    );
}
