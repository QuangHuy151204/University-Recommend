'use client';

/* eslint-disable react-hooks/set-state-in-effect -- admin tables fetch on filter change */
import { useCallback, useEffect, useState } from 'react';
import { listUniversities } from '@/services/universities';
import { listMajors } from '@/services/majors';
import {
    createUniversityMajor,
    deleteUniversityMajor,
    listUniversityMajors,
    updateUniversityMajor,
} from '@/services/admin';
import { ApiClientError } from '@/lib/api';
import type { Major, University, UniversityMajor } from '@/types';

const EMPTY = {
    university_id: '',
    major_id: '',
    training_program: '',
    tuition_fee: '',
    quota: '',
};

export function UniversityMajorsPanel() {
    const [rows, setRows] = useState<UniversityMajor[]>([]);
    const [universities, setUniversities] = useState<University[]>([]);
    const [majors, setMajors] = useState<Major[]>([]);
    const [filterUniversityId, setFilterUniversityId] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editing, setEditing] = useState<UniversityMajor | null>(null);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        Promise.all([
            listUniversities({ limit: 200 }),
            listMajors({ limit: 200 }),
        ])
            .then(([u, m]) => {
                setUniversities(u.data);
                setMajors(m.data);
            })
            .catch(() => {});
    }, []);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await listUniversityMajors({
                university_id: filterUniversityId
                    ? Number(filterUniversityId)
                    : undefined,
                limit: 50,
            });
            setRows(res.data);
        } catch (err) {
            setError(err instanceof ApiClientError ? err.message : 'Lỗi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    }, [filterUniversityId]);

    useEffect(() => {
        void load();
    }, [load]);

    function openCreate() {
        setEditing(null);
        setForm({
            ...EMPTY,
            university_id: filterUniversityId,
        });
    }

    function openEdit(row: UniversityMajor) {
        setEditing(row);
        setForm({
            university_id: String(row.university.id),
            major_id: String(row.major.id),
            training_program: row.training_program ?? '',
            tuition_fee: row.tuition_fee?.toString() ?? '',
            quota: row.quota?.toString() ?? '',
        });
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError(null);
        const payload = {
            university_id: Number(form.university_id),
            major_id: Number(form.major_id),
            training_program: form.training_program.trim() || undefined,
            tuition_fee: form.tuition_fee ? Number(form.tuition_fee) : undefined,
            quota: form.quota ? Number(form.quota) : undefined,
        };
        try {
            if (editing) await updateUniversityMajor(editing.id, payload);
            else await createUniversityMajor(payload);
            setEditing(null);
            setForm(EMPTY);
            await load();
        } catch (err) {
            setError(err instanceof ApiClientError ? err.message : 'Lưu thất bại');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(row: UniversityMajor) {
        if (
            !confirm(
                `Xóa liên kết ${row.university.name} — ${row.major.name}? (chặn nếu còn điểm chuẩn)`,
            )
        )
            return;
        try {
            await deleteUniversityMajor(row.id);
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
                    onChange={(e) => setFilterUniversityId(e.target.value)}
                    className="input-field max-w-md"
                >
                    <option value="">Tất cả trường</option>
                    {universities.map((u) => (
                        <option key={u.id} value={u.id}>
                            {u.short_name ?? u.name}
                        </option>
                    ))}
                </select>
                <button type="button" onClick={() => void load()} className="btn-secondary">
                    Tải lại
                </button>
                <button type="button" onClick={openCreate} className="btn-primary">
                    Gán ngành cho trường
                </button>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSave} className="card grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
                <select
                    required
                    value={form.university_id}
                    onChange={(e) => setForm({ ...form, university_id: e.target.value })}
                    className="input-field"
                >
                    <option value="">Chọn trường *</option>
                    {universities.map((u) => (
                        <option key={u.id} value={u.id}>
                            {u.name}
                        </option>
                    ))}
                </select>
                <select
                    required
                    value={form.major_id}
                    onChange={(e) => setForm({ ...form, major_id: e.target.value })}
                    className="input-field"
                >
                    <option value="">Chọn ngành *</option>
                    {majors.map((m) => (
                        <option key={m.id} value={m.id}>
                            {m.name}
                        </option>
                    ))}
                </select>
                <input
                    value={form.training_program}
                    onChange={(e) =>
                        setForm({ ...form, training_program: e.target.value })
                    }
                    placeholder="Chương trình đào tạo"
                    className="input-field"
                />
                <input
                    value={form.tuition_fee}
                    onChange={(e) => setForm({ ...form, tuition_fee: e.target.value })}
                    placeholder="Học phí CT (VNĐ)"
                    type="number"
                    className="input-field"
                />
                <input
                    value={form.quota}
                    onChange={(e) => setForm({ ...form, quota: e.target.value })}
                    placeholder="Chỉ tiêu"
                    type="number"
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
                            <th className="px-4 py-3">Trường</th>
                            <th className="px-4 py-3">Ngành</th>
                            <th className="px-4 py-3">CTĐT</th>
                            <th className="px-4 py-3">Học phí</th>
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
                        ) : (
                            rows.map((row) => (
                                <tr key={row.id} className="border-b border-slate-100">
                                    <td className="px-4 py-3">{row.id}</td>
                                    <td className="px-4 py-3">{row.university.name}</td>
                                    <td className="px-4 py-3">{row.major.name}</td>
                                    <td className="px-4 py-3">
                                        {row.training_program ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {row.tuition_fee?.toLocaleString('vi-VN') ?? '—'}
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
