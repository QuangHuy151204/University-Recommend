export function cn(...classes: (string | false | null | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}

export function formatTuitionVnd(min: number | null, max: number | null): string {
    if (!min && !max) return '—';
    const fmt = (n: number) =>
        n >= 1_000_000 ? `${(n / 1_000_000).toFixed(0)}` : `${n}`;
    if (min && max && min !== max) {
        return `~ ${fmt(min)} – ${fmt(max)} Triệu/Năm`;
    }
    return `~ ${fmt(min ?? max ?? 0)} Triệu/Năm`;
}

const UNIVERSITY_TYPE_LABELS: Record<string, string> = {
    public: 'Công lập',
    private: 'Tư thục',
    international: 'Quốc tế',
};

export function translateUniversityType(type: string | null | undefined): string {
    if (!type) return '—';
    return UNIVERSITY_TYPE_LABELS[type] ?? type;
}
