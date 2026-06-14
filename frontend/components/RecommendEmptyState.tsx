import Link from 'next/link';
import type { RecommendEmptyReason, RecommendResponseMeta } from '@/types';

function emptyMessage(
    meta: RecommendResponseMeta,
): { title: string; body: string; hints: string[] } {
    const combo = meta.filtersApplied.subject_combination;
    const interests = meta.filtersApplied.interests?.join(', ');
    const method =
        meta.filtersApplied.method_label ?? meta.filtersApplied.method_code;

    switch (meta.emptyReason) {
        case 'no_subject_combination': {
            const isRareCombo = combo === 'B01';
            return {
                title: isRareCombo
                    ? 'Khối B01 hiếm trong dữ liệu'
                    : 'Không có ngành khớp tổ hợp môn',
                body: combo
                    ? isRareCombo
                      ? `Tổ hợp ${combo} (Toán, Sinh, Anh) có ít ngành công bố điểm chuẩn trong phạm vi Hà Nội${interests ? ` liên quan "${interests}"` : ''}.`
                      : `Trong dữ liệu hiện có, không tìm thấy ngành nào có điểm chuẩn tổ hợp ${combo}${interests ? ` liên quan "${interests}"` : ''} (PT ${method}).`
                    : 'Không có ngành phù hợp tổ hợp môn bạn chọn.',
                hints: isRareCombo
                    ? [
                          'Thử tổ hợp B00 (Toán, Hóa, Sinh) nếu môn Hóa thay Anh.',
                          'Nới rộng từ khóa ngành (vd. Y, Dược, Sinh học).',
                          'Tra cứu ngành để xem trường tuyển khối nào.',
                      ]
                    : [
                          'Thử đổi tổ hợp môn nếu bạn linh hoạt khối xét tuyển.',
                          'Nới rộng hoặc đổi từ khóa ngành / sở thích.',
                          'Xem tra cứu ngành để kiểm tra tổ hợp được tuyển.',
                      ],
            };
        }
        case 'no_score_match':
            return {
                title: 'Chưa đủ điểm phù hợp',
                body: combo
                    ? `Có ngành khớp tổ hợp ${combo} nhưng điểm dự kiến chưa đạt ngưỡng gợi ý so với điểm chuẩn (PT ${method}).`
                    : 'Có ngành khớp tiêu chí nhưng điểm dự kiến chưa đủ cao.',
                hints: [
                    'Nếu muốn có kết quả sớm, thử mở rộng từ khóa ngành để lấy thêm nhóm Reach (Cân nhắc).',
                    'Kiểm tra lại điểm dự kiến và phương thức xét tuyển để cải thiện nhóm Match/Safety.',
                    'Tra cứu điểm chuẩn các năm trước trên trang trường/ngành trước khi chốt nguyện vọng.',
                ],
            };
        default:
            return {
                title: 'Không tìm thấy gợi ý',
                body: 'Hệ thống chưa có dữ liệu phù hợp với bộ lọc hiện tại.',
                hints: [
                    'Thử nới rộng điểm hoặc sở thích.',
                    'Đổi phương thức xét tuyển nếu bạn có nhiều lựa chọn.',
                ],
            };
    }
}

export function RecommendEmptyState({ meta }: { meta: RecommendResponseMeta }) {
    const { title, body, hints } = emptyMessage(meta);

    return (
        <div className="card mt-8 p-6 text-sm text-slate-600">
            <h3 className="font-display text-base font-bold text-primary">{title}</h3>
            <p className="mt-2">{body}</p>
            <ul className="mt-4 list-inside list-disc space-y-1 text-slate-600">
                {hints.map((hint) => (
                    <li key={hint}>{hint}</li>
                ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/majors" className="text-sm font-medium text-primary hover:underline">
                    Tra cứu ngành
                </Link>
                <Link
                    href="/universities"
                    className="text-sm font-medium text-primary hover:underline"
                >
                    Tra cứu trường
                </Link>
            </div>
        </div>
    );
}

export function getEmptyReasonLabel(reason: RecommendEmptyReason | null): string {
    switch (reason) {
        case 'no_subject_combination':
            return 'Không khớp tổ hợp';
        case 'no_score_match':
            return 'Chưa đủ điểm';
        case 'no_data':
            return 'Thiếu dữ liệu';
        default:
            return 'Không có kết quả';
    }
}
