'use client';

/* eslint-disable react-hooks/set-state-in-effect -- admin tables fetch on filter change */
import { useCallback, useEffect, useState } from 'react';
import { listMajors } from '@/services/majors';
import { createMajor, deleteMajor, updateMajor } from '@/services/admin';
import { ApiClientError } from '@/lib/api';
import { useTableSort } from '@/lib/admin-table-sort';
import { AdminSortableTh } from '@/components/admin/AdminSortableTh';
import type { Major } from '@/types';

const EMPTY = { name: '', code: '', field_group: '', career_orientation: '' };

const PAGE_SIZE = 50;

function toApiSortKey(key: string): 'id' | 'name' | 'code' | 'field_group' {
    if (key === 'tags') return 'field_group';
    if (key === 'id' || key === 'name' || key === 'code' || key === 'field_group') {
        return key;
    }
    return 'id';
}

export function MajorsPanel() {
    const [rows, setRows] = useState<Major[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editing, setEditing] = useState<Major | null>(null);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const { sort, toggleSort } = useTableSort({ key: 'id', direction: 'asc' });

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await listMajors({
                search: search || undefined,
                limit: PAGE_SIZE,
                page,
                sort_by: toApiSortKey(sort?.key ?? 'id'),
                sort_order: sort?.direction ?? 'asc',
            });
            setRows(res.data);
            setTotalPages(res.totalPages);
        } catch (err) {
            setError(err instanceof ApiClientError ? err.message : 'Lỗi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    }, [search, page, sort]);

    useEffect(() => {
        void load();
    }, [load]);

    function handleSort(key: string) {
        toggleSort(key);
        setPage(1);
    }

    function openCreate() {
        setEditing(null);
        setForm(EMPTY);
    }

    function openEdit(row: Major) {
        setEditing(row);
        setForm({
            name: row.name,
            code: row.code ?? '',
            field_group: row.field_group ?? '',
            career_orientation: row.career_orientation ?? '',
        });
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError(null);
        const payload = {
            name: form.name.trim(),
            code: form.code.trim() || undefined,
            field_group: form.field_group.trim() || undefined,
            career_orientation: form.career_orientation.trim() || undefined,
        };
        try {
            if (editing) await updateMajor(editing.id, payload);
            else await createMajor(payload);
            setEditing(null);
            setForm(EMPTY);
            await load();
        } catch (err) {
            setError(err instanceof ApiClientError ? err.message : 'Lưu thất bại');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(row: Major) {
        if (!confirm(`Xóa ngành "${row.name}"?`)) return;
        try {
            await deleteMajor(row.id);
            await load();
        } catch (err) {
            setError(err instanceof ApiClientError ? err.message : 'Xóa thất bại');
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
                <input
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    placeholder="Tìm ngành…"
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

            <form onSubmit={handleSave} className="card grid gap-3 p-4 sm:grid-cols-2">
                <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Tên ngành *"
                    className="input-field"
                />
                <input
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    placeholder="Mã ngành"
                    className="input-field"
                />
                <input
                    value={form.field_group}
                    onChange={(e) => setForm({ ...form, field_group: e.target.value })}
                    placeholder="Nhóm ngành (field_group)"
                    className="input-field"
                />
                <input
                    value={form.career_orientation}
                    onChange={(e) =>
                        setForm({ ...form, career_orientation: e.target.value })
                    }
                    placeholder="Định hướng nghề"
                    className="input-field"
                />
                <div className="flex gap-2 sm:col-span-2">
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
                            <AdminSortableTh
                                label="ID"
                                sortKey="id"
                                sort={sort}
                                onSort={handleSort}
                            />
                            <AdminSortableTh
                                label="Tên"
                                sortKey="name"
                                sort={sort}
                                onSort={handleSort}
                            />
                            <AdminSortableTh
                                label="Mã"
                                sortKey="code"
                                sort={sort}
                                onSort={handleSort}
                            />
                            <AdminSortableTh
                                label="Nhóm ngành"
                                sortKey="field_group"
                                sort={sort}
                                onSort={handleSort}
                            />
                            <AdminSortableTh
                                label="Tags"
                                sortKey="tags"
                                sort={sort}
                                onSort={handleSort}
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
                            rows.map((row) => (
                                <tr key={row.id} className="border-b border-slate-100">
                                    <td className="px-4 py-3">{row.id}</td>
                                    <td className="px-4 py-3 font-medium">{row.name}</td>
                                    <td className="px-4 py-3">{row.code ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        {(row.groups?.length
                                            ? row.groups.map((g) => g.group_name)
                                            : row.field_group
                                              ? [row.field_group]
                                              : []
                                        ).join(', ') || '—'}
                                    </td>
                                    <td className="max-w-[12rem] truncate px-4 py-3 text-xs text-slate-600">
                                        {(row.tags ?? []).slice(0, 4).join(', ') || '—'}
                                    </td>
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
                    Trang {page} / {totalPages} · {PAGE_SIZE} dòng/trang
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
