/**
 * Văn phong chatbot — chỉ chuỗi hiển thị, không chứa logic nghiệp vụ.
 * Giọng: thân thiện, ngắn gọn, hội thoại; không lộ thuật ngữ kỹ thuật.
 */

export const CHAT_SCOPE_HANOI =
  'Mình hiện có dữ liệu các trường ở Hà Nội (điểm chuẩn 2023–2025).';

export const CHAT_DISCLAIMER_CUTOFF =
  'Đây là số liệu tham khảo — bạn nên đối chiếu thêm thông báo tuyển sinh chính thức của nhà trường.';

export const CHAT_DISCLAIMER_TUITION =
  'Học phí thực tế có thể khác theo ngành, chương trình (chuẩn / chất lượng cao / quốc tế) và từng năm học.';

export const CHAT_DISCLAIMER_GENERAL =
  'Thông tin mang tính tham khảo, không thay thế tư vấn tuyển sinh chính thức.';

/** Prefix danh sách ngành từ DB — dùng cho skip Ollama rewrite. */
export const DB_MAJOR_LIST_PREFIX = 'Danh sách ngành/chương trình tại';

export const TIER_LABELS_CHAT = {
  safety: 'An toàn',
  match: 'Vừa sức',
  reach: 'Cân nhắc',
} as const;

export function tierLabelChat(
  tier: 'safety' | 'match' | 'reach' | null | undefined,
): string | null {
  if (!tier) return null;
  return TIER_LABELS_CHAT[tier];
}
