'use client';

/* eslint-disable react-hooks/set-state-in-effect -- admin tables fetch on filter change */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { listUniversities } from '@/services/universities';
import { ADMIN_PREFERRED_UNIVERSITY_SHORT_NAME } from '@/lib/admin-universities';
import { sortRows, useTableSort } from '@/lib/admin-table-sort';
import { AdminSortableTh } from '@/components/admin/AdminSortableTh';
import {
    createUniversity,
    deleteUniversity,
    updateUniversity,
} from '@/services/admin';
import { ApiClientError } from '@/lib/api';
import type { University, UniversityType } from '@/types';

const EMPTY_FORM = {
    name: '',
    short_name: '',
    type: 'public' as UniversityType,
    location: 'Hà Nội',
    ward: '',
    tuition_fee_min: '',
    tuition_fee_max: '',
};

export function UniversitiesPanel() {
    const [rows, setRows] = useState<University[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editing, setEditing] = useState<University | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const { sort, toggleSort } = useTableSort();

    const getSortValue = useCallback((row: University, key: string) => {
        switch (key) {
            case 'id':
                return row.id;
            case 'name':
                return row.name;
            case 'short_name':
                return row.short_name ?? '';
            case 'type':
                return row.type ?? '';
            case 'location':
                return row.location ?? '';
            default:
                return '';
        }
    }, []);

    const displayRows = useMemo(
        () => sortRows(rows, sort, getSortValue),
        [rows, sort, getSortValue],
    );

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await listUniversities({
                search: search || undefined,
                limit: 50,
                prefer_short_name: ADMIN_PREFERRED_UNIVERSITY_SHORT_NAME,
            });
            setRows(res.data);
        } catch (err) {
            setError(err instanceof ApiClientError ? err.message : 'Lỗi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        void load();
    }, [load]);

    function openCreate() {
        setEditing(null);
        setForm(EMPTY_FORM);
    }

    function openEdit(row: University) {
        setEditing(row);
        setForm({
            name: row.name,
            short_name: row.short_name ?? '',
            type: (row.type as UniversityType) || 'public',
            location: row.location ?? '',
            ward: row.ward ?? '',
            tuition_fee_min: row.tuition_fee_min?.toString() ?? '',
            tuition_fee_max: row.tuition_fee_max?.toString() ?? '',
        });
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError(null);
        const payload = {
            name: form.name.trim(),
            short_name: form.short_name.trim() || undefined,
            type: form.type,
            location: form.location.trim() || undefined,
            ward: form.ward.trim() || undefined,
            tuition_fee_min: form.tuition_fee_min
                ? Number(form.tuition_fee_min)
                : undefined,
            tuition_fee_max: form.tuition_fee_max
                ? Number(form.tuition_fee_max)
                : undefined,
        };
        try {
            if (editing) {
                await updateUniversity(editing.id, payload);
            } else {
                await createUniversity(payload);
            }
            setEditing(null);
            setForm(EMPTY_FORM);
            await load();
        } catch (err) {
            setError(err instanceof ApiClientError ? err.message : 'Lưu thất bại');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(row: University) {
        if (!confirm(`Xóa trường "${row.name}"?`)) return;
        try {
            await deleteUniversity(row.id);
            await load();
        } catch (err) {
            setError(err instanceof ApiClientError ? err.message : 'Xóa thất bại');
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm theo tên…"
                    className="input-field max-w-xs"
                />
                <button type="button" onClick={() => void load()} className="btn-secondary">
                    Tải lại
                </button>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSave} className="card grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
                <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Tên trường *"
                    className="input-field"
                />
                <input
                    value={form.short_name}
                    onChange={(e) => setForm({ ...form, short_name: e.target.value })}
                    placeholder="Mã viết tắt"
                    className="input-field"
                />
                <select
                    value={form.type}
                    onChange={(e) =>
                        setForm({ ...form, type: e.target.value as UniversityType })
                    }
                    className="input-field"
                >
                    <option value="public">Công lập</option>
                    <option value="private">Tư thục</option>
                    <option value="international">Quốc tế</option>
                </select>
                <input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Thành phố"
                    className="input-field"
                />
                <input
                    value={form.ward}
                    onChange={(e) => setForm({ ...form, ward: e.target.value })}
                    placeholder="Phường"
                    className="input-field"
                />
                <input
                    value={form.tuition_fee_min}
                    onChange={(e) => setForm({ ...form, tuition_fee_min: e.target.value })}
                    placeholder="Học phí min"
                    type="number"
                    className="input-field"
                />
                <input
                    value={form.tuition_fee_max}
                    onChange={(e) => setForm({ ...form, tuition_fee_max: e.target.value })}
                    placeholder="Học phí max"
                    type="number"
                    className="input-field"
                />
                <div className="flex gap-2 sm:col-span-2 lg:col-span-3">
                    <button type="submit" disabled={saving} className="btn-primary">
                        {saving ? 'Đang lưu…' : editing ? 'Cập nhật' : 'Tạo mới'}
                    </button>
                    {editing && (
                        <button
                            type="button"
                            onClick={openCreate}
                            className="btn-secondary"
                        >
                            Hủy sửa
                        </button>
                    )}
                </div>
            </form>

            <div className="card overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
                        <tr>
                            <AdminSortableTh
                                label="ID"
                                sortKey="id"
                                sort={sort}
                                onSort={toggleSort}
                            />
                            <AdminSortableTh
                                label="Tên"
                                sortKey="name"
                                sort={sort}
                                onSort={toggleSort}
                            />
                            <AdminSortableTh
                                label="Mã"
                                sortKey="short_name"
                                sort={sort}
                                onSort={toggleSort}
                            />
                            <AdminSortableTh
                                label="Loại"
                                sortKey="type"
                                sort={sort}
                                onSort={toggleSort}
                            />
                            <AdminSortableTh
                                label="Địa điểm"
                                sortKey="location"
                                sort={sort}
                                onSort={toggleSort}
                            />
                            <th className="px-4 py-3" />
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-6 text-slate-500">
                                    Đang tải…
                                </td>
                            </tr>
                        ) : rows.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-6 text-slate-500">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            displayRows.map((row) => (
                                <tr key={row.id} className="border-b border-slate-100">
                                    <td className="px-4 py-3">{row.id}</td>
                                    <td className="px-4 py-3 font-medium">{row.name}</td>
                                    <td className="px-4 py-3">{row.short_name ?? '—'}</td>
                                    <td className="px-4 py-3">{row.type}</td>
                                    <td className="px-4 py-3">{row.location ?? '—'}</td>
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
        </div>
    );
}
