'use client';

/* eslint-disable react-hooks/set-state-in-effect -- admin tables fetch on filter change */
import { useCallback, useEffect, useState } from 'react';
import { listAdmissionMethods } from '@/services/admission-methods';
import {
    createAdmissionMethod,
    deleteAdmissionMethod,
    updateAdmissionMethod,
} from '@/services/admin';
import { ApiClientError } from '@/lib/api';
import type { AdmissionMethod } from '@/types';

const EMPTY = { method_code: '', method_name: '', description: '' };

export function AdmissionMethodsPanel() {
    const [rows, setRows] = useState<AdmissionMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editing, setEditing] = useState<AdmissionMethod | null>(null);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            setRows(await listAdmissionMethods());
        } catch (err) {
            setError(err instanceof ApiClientError ? err.message : 'Lỗi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    function openCreate() {
        setEditing(null);
        setForm(EMPTY);
    }

    function openEdit(row: AdmissionMethod) {
        setEditing(row);
        setForm({
            method_code: row.method_code,
            method_name: row.method_name,
            description: row.description ?? '',
        });
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError(null);
        const payload = {
            method_code: form.method_code.trim(),
            method_name: form.method_name.trim(),
            description: form.description.trim() || undefined,
        };
        try {
            if (editing) await updateAdmissionMethod(editing.id, payload);
            else await createAdmissionMethod(payload);
            setEditing(null);
            setForm(EMPTY);
            await load();
        } catch (err) {
            setError(err instanceof ApiClientError ? err.message : 'Lưu thất bại');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(row: AdmissionMethod) {
        if (!confirm(`Xóa phương thức "${row.method_name}"?`)) return;
        try {
            await deleteAdmissionMethod(row.id);
            await load();
        } catch (err) {
            setError(err instanceof ApiClientError ? err.message : 'Xóa thất bại');
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-3">
                <button type="button" onClick={() => void load()} className="btn-secondary">
                    Tải lại
                </button>
                <button type="button" onClick={openCreate} className="btn-primary">
                    Thêm phương thức
                </button>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSave} className="card grid gap-3 p-4 sm:grid-cols-3">
                <input
                    required
                    value={form.method_code}
                    onChange={(e) => setForm({ ...form, method_code: e.target.value })}
                    placeholder="Mã (THPT, DGNL…)"
                    className="input-field"
                />
                <input
                    required
                    value={form.method_name}
                    onChange={(e) => setForm({ ...form, method_name: e.target.value })}
                    placeholder="Tên hiển thị"
                    className="input-field"
                />
                <input
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Mô tả"
                    className="input-field"
                />
                <div className="flex gap-2 sm:col-span-3">
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
                            <th className="px-4 py-3">Mã</th>
                            <th className="px-4 py-3">Tên</th>
                            <th className="px-4 py-3">Mô tả</th>
                            <th className="px-4 py-3" />
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-6 text-slate-500">
                                    Đang tải…
                                </td>
                            </tr>
                        ) : (
                            rows.map((row) => (
                                <tr key={row.id} className="border-b border-slate-100">
                                    <td className="px-4 py-3">{row.id}</td>
                                    <td className="px-4 py-3 font-mono">{row.method_code}</td>
                                    <td className="px-4 py-3 font-medium">{row.method_name}</td>
                                    <td className="px-4 py-3 text-slate-600">
                                        {row.description ?? '—'}
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
        </div>
    );
}
