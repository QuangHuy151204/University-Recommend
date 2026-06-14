"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TIER_LABELS_CHAT = exports.DB_MAJOR_LIST_PREFIX = exports.CHAT_DISCLAIMER_GENERAL = exports.CHAT_DISCLAIMER_TUITION = exports.CHAT_DISCLAIMER_CUTOFF = exports.CHAT_SCOPE_HANOI = void 0;
exports.tierLabelChat = tierLabelChat;
exports.CHAT_SCOPE_HANOI = 'Mình hiện có dữ liệu các trường ở Hà Nội (điểm chuẩn 2023–2025).';
exports.CHAT_DISCLAIMER_CUTOFF = 'Đây là số liệu tham khảo — bạn nên đối chiếu thêm thông báo tuyển sinh chính thức của nhà trường.';
exports.CHAT_DISCLAIMER_TUITION = 'Học phí thực tế có thể khác theo ngành, chương trình (chuẩn / chất lượng cao / quốc tế) và từng năm học.';
exports.CHAT_DISCLAIMER_GENERAL = 'Thông tin mang tính tham khảo, không thay thế tư vấn tuyển sinh chính thức.';
exports.DB_MAJOR_LIST_PREFIX = 'Danh sách ngành/chương trình tại';
exports.TIER_LABELS_CHAT = {
    safety: 'An toàn',
    match: 'Vừa sức',
    reach: 'Cân nhắc',
};
function tierLabelChat(tier) {
    if (!tier)
        return null;
    return exports.TIER_LABELS_CHAT[tier];
}
//# sourceMappingURL=chatbot-copy.js.map