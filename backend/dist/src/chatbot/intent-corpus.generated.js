"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMBINED_EXAMPLES = exports.ENTITY_EXAMPLES = exports.INTENT_EXAMPLES = exports.CORPUS_ROW_COUNT = void 0;
exports.CORPUS_ROW_COUNT = 428;
exports.INTENT_EXAMPLES = [
    {
        "q": "Em được 24 điểm khối A00 muốn học CNTT ở Hà Nội thì nên chọn trường nào ạ?",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Mình thi được 22.5 điểm A01, muốn học Marketing ở Hà Nội thì có trường nào hợp không?",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 25 điểm D01 muốn học Ngôn ngữ Anh, gợi ý giúp em vài trường ở Hà Nội",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Con tôi được 21 điểm khối A, muốn học Kế toán ở Hà Nội thì nên cân nhắc trường nào?",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em khoảng 27 điểm B00 thì có cơ hội vào Y Hà Nội ngành Y đa khoa không ạ?",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Với điểm đó thì chọn trường nào an toàn hơn?",
        "intent": "recommendation_by_score",
        "is_follow_up": true,
        "context_note": "User vừa nói được 24 điểm A00 và muốn học CNTT ở Hà Nội"
    },
    {
        "q": "Mình được 23 điểm, tư vấn trường ở Hà Nội giúp mình với",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 20 điểm khối tự nhiên có nên đăng ký Công nghiệp hay Phenikaa không?",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "24 điểm tổ hợp toán lý hóa muốn học Cơ khí thì nên chọn HUST hay HAUI?",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Thế nếu em muốn học AI thì sao?",
        "intent": "recommendation_by_score",
        "is_follow_up": true,
        "context_note": "User vừa cung cấp điểm thi và hỏi gợi ý trường CNTT ở Hà Nội"
    },
    {
        "q": "Em được 18.5 điểm A00, có trường nào ở Hà Nội đào tạo Điện tử phù hợp không?",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Con tôi 26 điểm D01 muốn học Tài chính ngân hàng, có nên đặt NEU làm nguyện vọng không?",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 23.75 điểm A01 muốn học An toàn thông tin ở Hà Nội thì có những lựa chọn nào?",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm này có hơi thấp không ạ?",
        "intent": "recommendation_by_score",
        "is_follow_up": true,
        "context_note": "User vừa hỏi 20 điểm khối A00 có nên học CNTT ở Hà Nội không"
    },
    {
        "q": "Em khoảng 20 điểm khối xã hội thì nên học trường nào ở Hà Nội?",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Mình 22 điểm D01, muốn học Luật ở Hà Nội thì gợi ý giúp mình",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em được 24.2 điểm A00, muốn học Logistics ở Hà Nội thì trường nào vừa sức?",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Có trường nào dễ đỗ hơn không?",
        "intent": "recommendation_by_score",
        "is_follow_up": true,
        "context_note": "User vừa hỏi khả năng vào Bách Khoa với 22 điểm A00 ngành CNTT"
    },
    {
        "q": "Em 19 điểm học bạ muốn tìm trường ở Hà Nội có ngành Du lịch",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "21 điểm THPT quốc gia có nên học Quản trị kinh doanh ở Thăng Long không?",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "26 điểm muốn vào Ngoại thương thì nên chọn ngành nào?",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em thi A01 được 23 điểm, thích ngành dữ liệu hoặc AI thì Hà Nội có trường nào hợp?",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Nếu ưu tiên học phí thấp thì chọn trường nào?",
        "intent": "recommendation_by_score",
        "is_follow_up": true,
        "context_note": "User vừa nêu điểm và ngành mong muốn, đang cần gợi ý trường phù hợp ở Hà Nội"
    },
    {
        "q": "Còn ngành nào nữa?",
        "intent": "recommendation_by_score",
        "is_follow_up": true,
        "context_note": "User vừa hỏi gợi ý ngành phù hợp với 24 điểm A01 ở Hà Nội"
    },
    {
        "q": "Mình 25 điểm khối A00, phân vân CNTT ở Bách Khoa hay Bưu chính thì nên đặt nguyện vọng sao?",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn Bách Khoa ngành CNTT năm 2024 là bao nhiêu?",
        "intent": "ask_cutoff_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Cho mình hỏi điểm chuẩn NEU ngành Marketing 2025 theo THPT",
        "intent": "ask_cutoff_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "diem chuan BK 2023 la bao nhieu",
        "intent": "ask_cutoff_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn ngành Kế toán của Học viện Ngân hàng năm ngoái là bao nhiêu?",
        "intent": "ask_cutoff_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Thế còn năm 2025?",
        "intent": "ask_cutoff_score",
        "is_follow_up": true,
        "context_note": "User vừa hỏi điểm chuẩn Bách Khoa ngành CNTT năm 2024"
    },
    {
        "q": "FTU ngành Logistics điểm chuẩn 2024 bao nhiêu ạ?",
        "intent": "ask_cutoff_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn USTH ngành Công nghệ thông tin 2023 có cao không?",
        "intent": "ask_cutoff_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học viện Bưu chính ngành An toàn thông tin lấy bao nhiêu điểm năm 2025?",
        "intent": "ask_cutoff_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Còn phương thức học bạ thì sao?",
        "intent": "ask_cutoff_score",
        "is_follow_up": true,
        "context_note": "User vừa hỏi điểm chuẩn một ngành theo phương thức THPT"
    },
    {
        "q": "Điểm chuẩn ngành Luật của Luật Hà Nội năm 2024 theo D01 là bao nhiêu?",
        "intent": "ask_cutoff_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường Thương mại ngành Quản trị kinh doanh 2025 lấy điểm chuẩn bao nhiêu?",
        "intent": "ask_cutoff_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn Hà Nội ngành Dược 2024 trường Y dược là bao nhiêu?",
        "intent": "ask_cutoff_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "HAUI ngành Cơ khí điểm chuẩn 2023 theo A00 là mấy điểm?",
        "intent": "ask_cutoff_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành đó năm trước lấy bao nhiêu?",
        "intent": "ask_cutoff_score",
        "is_follow_up": true,
        "context_note": "User vừa hỏi thông tin một ngành cụ thể tại một trường ở Hà Nội"
    },
    {
        "q": "Cho em xem điểm chuẩn ngành Tài chính ngân hàng của Kinh tế Quốc dân 2024",
        "intent": "ask_cutoff_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn Phenikaa ngành Trí tuệ nhân tạo 2025 có không?",
        "intent": "ask_cutoff_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Mỹ thuật năm 2024 lấy bao nhiêu điểm ngành Kiến trúc?",
        "intent": "ask_cutoff_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Có điểm 2023 không?",
        "intent": "ask_cutoff_score",
        "is_follow_up": true,
        "context_note": "User vừa hỏi điểm chuẩn cùng trường và cùng ngành năm 2024"
    },
    {
        "q": "Điểm chuẩn ngành Du lịch ở Thăng Long 2025 là bao nhiêu vậy?",
        "intent": "ask_cutoff_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "HUST ngành Điện tử năm 2025 theo A01 lấy bao nhiêu điểm?",
        "intent": "ask_cutoff_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "USTH có những chương trình đào tạo gì?",
        "intent": "search_university",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Cho mình thông tin về trường Bách Khoa Hà Nội",
        "intent": "search_university",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "NEU có ngành Marketing không ạ?",
        "intent": "search_university",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường đó có ngành CNTT không?",
        "intent": "search_university",
        "is_follow_up": true,
        "context_note": "User vừa hỏi thông tin về trường Phenikaa"
    },
    {
        "q": "FPT Hà Nội có những ngành nào liên quan đến công nghệ?",
        "intent": "search_university",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học viện Ngân hàng đào tạo những ngành gì?",
        "intent": "search_university",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "truong thuong mai co nganh ke toan khong",
        "intent": "search_university",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Đại học Công nghiệp Hà Nội có chương trình An toàn thông tin không?",
        "intent": "search_university",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Còn danh sách ngành thì sao?",
        "intent": "search_university",
        "is_follow_up": true,
        "context_note": "User vừa hỏi thông tin tổng quan về trường USTH"
    },
    {
        "q": "Ngoại thương ở Hà Nội có những ngành kinh tế nào?",
        "intent": "search_university",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Cho em xem thông tin trường Luật Hà Nội",
        "intent": "search_university",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Phenikaa có đào tạo ngành Trí tuệ nhân tạo không?",
        "intent": "search_university",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Có ngành dược không?",
        "intent": "search_university",
        "is_follow_up": true,
        "context_note": "User vừa hỏi danh sách chương trình của một trường y dược ở Hà Nội"
    },
    {
        "q": "Thăng Long có những ngành nào phù hợp khối D01?",
        "intent": "search_university",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học viện Bưu chính có ngành Công nghệ thông tin không?",
        "intent": "search_university",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành CNTT có những trường nào ở Hà Nội đào tạo?",
        "intent": "search_major",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Marketing học ở trường nào tại Hà Nội thì phù hợp?",
        "intent": "search_major",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Logistics là học gì và Hà Nội có trường nào dạy?",
        "intent": "search_major",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành này trường nào có?",
        "intent": "search_major",
        "is_follow_up": true,
        "context_note": "User vừa nhắc đến ngành An toàn thông tin và hỏi thêm trường đào tạo ở Hà Nội"
    },
    {
        "q": "An toàn thông tin khác gì CNTT vậy ạ?",
        "intent": "search_major",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Tài chính ngân hàng ở Hà Nội có các trường nào?",
        "intent": "search_major",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "nganh ke toan hoc truong nao o ha noi",
        "intent": "search_major",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em muốn tìm hiểu ngành Y đa khoa, học xong sẽ học những gì?",
        "intent": "search_major",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Còn trường nào ở Hà Nội đào tạo nữa?",
        "intent": "search_major",
        "is_follow_up": true,
        "context_note": "User vừa hỏi về ngành Luật và danh sách trường đào tạo"
    },
    {
        "q": "Ngành Trí tuệ nhân tạo nên học ở đâu tại Hà Nội?",
        "intent": "search_major",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Khối tự nhiên có thể học những ngành kỹ thuật nào ở Hà Nội?",
        "intent": "search_major",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Luật có những trường đại học nào ở Hà Nội?",
        "intent": "search_major",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí FPT Hà Nội khoảng bao nhiêu một năm?",
        "intent": "ask_tuition_fee",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí ngành CNTT ở Bách Khoa năm 2025 là bao nhiêu?",
        "intent": "ask_tuition_fee",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Thế học phí thì sao?",
        "intent": "ask_tuition_fee",
        "is_follow_up": true,
        "context_note": "User vừa hỏi về trường FPT Hà Nội"
    },
    {
        "q": "hoc phi NEU nganh Marketing 1 nam khoang bao nhieu",
        "intent": "ask_tuition_fee",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "USTH tính học phí theo năm hay theo tín chỉ?",
        "intent": "ask_tuition_fee",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí ngành Dược ở Y dược Hà Nội có cao không?",
        "intent": "ask_tuition_fee",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Đại học Công nghiệp học phí theo tín chỉ là bao nhiêu?",
        "intent": "ask_tuition_fee",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành đó học phí cao không ạ?",
        "intent": "ask_tuition_fee",
        "is_follow_up": true,
        "context_note": "User vừa hỏi thông tin ngành Trí tuệ nhân tạo tại Phenikaa"
    },
    {
        "q": "Cho mình học phí ngành Kế toán của Học viện Ngân hàng",
        "intent": "ask_tuition_fee",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí Thăng Long ngành Du lịch khoảng bao nhiêu?",
        "intent": "ask_tuition_fee",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Có trường nào học phí thấp hơn không?",
        "intent": "ask_tuition_fee",
        "is_follow_up": true,
        "context_note": "User vừa xem học phí của một trường/ngành ở Hà Nội"
    },
    {
        "q": "Học phí ngành Luật Hà Nội năm 2024 là bao nhiêu?",
        "intent": "ask_tuition_fee",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "So sánh giúp em Bách Khoa và Học viện Bưu chính ngành CNTT",
        "intent": "compare_universities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "NEU với Thương mại trường nào hợp học Marketing hơn?",
        "intent": "compare_universities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "So sánh học phí FPT và USTH ở Hà Nội",
        "intent": "compare_universities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Hai trường này khác nhau thế nào?",
        "intent": "compare_universities",
        "is_follow_up": true,
        "context_note": "User vừa hỏi về Bách Khoa và Học viện Bưu chính"
    },
    {
        "q": "FTU và NEU ngành Tài chính ngân hàng nên chọn trường nào?",
        "intent": "compare_universities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "So sánh điểm chuẩn CNTT 2024 của HUST và HAUI",
        "intent": "compare_universities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Phenikaa với Thăng Long ngành Quản trị kinh doanh trường nào học phí dễ chịu hơn?",
        "intent": "compare_universities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Cái nào dễ đỗ hơn?",
        "intent": "compare_universities",
        "is_follow_up": true,
        "context_note": "User vừa so sánh hai trường cùng ngành ở Hà Nội"
    },
    {
        "q": "So sánh Luật Hà Nội và Học viện Ngân hàng nếu em muốn học Luật kinh tế",
        "intent": "compare_universities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Bách Khoa, FPT và USTH trường nào mạnh hơn về AI?",
        "intent": "compare_universities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học CNTT ra trường làm những công việc gì?",
        "intent": "ask_career",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Marketing sau này có thể làm vị trí nào?",
        "intent": "ask_career",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ra trường lương khoảng bao nhiêu?",
        "intent": "ask_career",
        "is_follow_up": true,
        "context_note": "User vừa hỏi về ngành An toàn thông tin"
    },
    {
        "q": "Học Tài chính ngân hàng có dễ xin việc không ạ?",
        "intent": "ask_career",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Logistics ra trường làm ở đâu?",
        "intent": "ask_career",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Y đa khoa học xong cơ hội nghề nghiệp thế nào?",
        "intent": "ask_career",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành đó sau này làm gì?",
        "intent": "ask_career",
        "is_follow_up": true,
        "context_note": "User vừa hỏi mô tả ngành Kế toán"
    },
    {
        "q": "Học Luật ra trường có thể làm trong doanh nghiệp không?",
        "intent": "ask_career",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Có những trường đại học nào ở Hà Nội?",
        "intent": "ask_location",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Cho mình danh sách trường ở Hà Nội có đào tạo khối kinh tế",
        "intent": "ask_location",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "truong dai hoc tai ha noi gom nhung truong nao",
        "intent": "ask_location",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ở khu vực Hà Nội thì còn trường nào nữa?",
        "intent": "ask_location",
        "is_follow_up": true,
        "context_note": "User vừa xem một danh sách trường ở Hà Nội và muốn mở rộng thêm"
    },
    {
        "q": "Các trường đại học ở Hà Nội có ngành kỹ thuật là trường nào?",
        "intent": "ask_location",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Liệt kê trường đại học tại Hà Nội cho em với ạ",
        "intent": "ask_location",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Chào bạn",
        "intent": "greeting",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Xin chào, tư vấn giúp mình với",
        "intent": "greeting",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "hello bot ạ",
        "intent": "greeting",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Chào em, tôi muốn hỏi thông tin tuyển sinh cho con",
        "intent": "greeting",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Bot có thể tư vấn những gì?",
        "intent": "help",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Mình dùng app này như thế nào để chọn trường?",
        "intent": "help",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Bạn có thể gợi ý trường theo điểm không?",
        "intent": "help",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Muốn tra điểm chuẩn thì phải hỏi như nào?",
        "intent": "help",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ở TP.HCM có trường nào học CNTT tốt?",
        "intent": "unknown",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Có học bổng toàn phần ở FPT không?",
        "intent": "unknown",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường nào ở Đà Nẵng phù hợp 24 điểm A00?",
        "intent": "unknown",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Cho em đề luyện thi toán để vào Bách Khoa",
        "intent": "unknown",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Đại học Thủ đô Hà Nội có những ngành sư phạm nào?",
        "intent": "search_university",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ở ĐH Thủ đô có chương trình sư phạm tiếng Anh không?",
        "intent": "search_university",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường Đại học Thủ đô Hà Nội đào tạo những chương trình nào thuộc khối sư phạm?",
        "intent": "search_university",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em được 24 điểm thì có đủ vào Đại học Thủ đô Hà Nội không?",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 24 điểm có đủ không?",
        "intent": "recommendation_by_score",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng đang hỏi về Đại học Thủ đô Hà Nội."
    },
    {
        "q": "Thế còn ngành sư phạm toán thì sao?",
        "intent": "search_university",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng đã chọn Đại học Thủ đô Hà Nội và đang hỏi các ngành sư phạm."
    },
    {
        "q": "Điểm chuẩn 2025 là bao nhiêu?",
        "intent": "ask_cutoff_score",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi ngành Sư phạm Toán tại Đại học Thủ đô Hà Nội."
    },
    {
        "q": "Điểm chuẩn ngành Sư phạm Toán của Đại học Thủ đô Hà Nội năm 2025 theo thi THPT là bao nhiêu?",
        "intent": "ask_cutoff_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành đó năm 2024 lấy bao nhiêu điểm theo học bạ?",
        "intent": "ask_cutoff_score",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng đang hỏi ngành Sư phạm Toán tại Đại học Thủ đô Hà Nội."
    },
    {
        "q": "Nhóm ngành Giáo dục - Sư phạm ở Hà Nội gồm những ngành nào?",
        "intent": "search_major",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ở Hà Nội có trường nào đào tạo ngành Sư phạm Toán không?",
        "intent": "search_major",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường nào ở Hà Nội phù hợp để học khối ngành giáo dục?",
        "intent": "search_major",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ở Hà Nội có những trường đại học nào?",
        "intent": "ask_location",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Cho em thông tin về Đại học Thủ đô Hà Nội",
        "intent": "search_university",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Đại học Thủ đô với Bách khoa ngành CNTT khối A00 nên chọn trường nào?",
        "intent": "compare_universities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "HUST hay PTIT phù hợp hơn nếu em muốn học công nghệ thông tin?",
        "intent": "compare_universities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí Đại học Thủ đô Hà Nội khoảng bao nhiêu một năm?",
        "intent": "ask_tuition_fee",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Sư phạm Toán ra trường làm gì, lương có ổn không?",
        "intent": "ask_career",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em chào anh chị, tư vấn giúp em với ạ",
        "intent": "greeting",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Chatbot này có thể hỗ trợ em những gì?",
        "intent": "help",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Đại học ở TP.HCM có ngành logistics nào tốt?",
        "intent": "unknown",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Con tôi được 22.5 điểm khối D01, nên chọn ngành nào ở Hà Nội?",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em được 26 điểm A00 muốn học CNTT ở Hà Nội thì nên xét trường nào?",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "24 điểm khối tự nhiên có cơ hội vào ngành công nghệ thông tin không?",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn CNTT của Bách khoa năm 2025 theo A00 là bao nhiêu?",
        "intent": "ask_cutoff_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "NEU có ngành marketing không?",
        "intent": "search_university",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường Kinh tế Quốc dân đào tạo những ngành nào?",
        "intent": "search_university",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành tài chính ngân hàng học những gì và trường nào ở Hà Nội có đào tạo?",
        "intent": "search_major",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí ngành CNTT của PTIT khoảng bao nhiêu?",
        "intent": "ask_tuition_fee",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Còn học phí ngành đó thì sao?",
        "intent": "ask_tuition_fee",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi ngành CNTT tại PTIT."
    },
    {
        "q": "Năm 2023 trường đó lấy bao nhiêu điểm?",
        "intent": "ask_cutoff_score",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng đang hỏi ngành CNTT tại PTIT."
    },
    {
        "q": "Nếu xét học bạ thì ngành này cần điều kiện gì?",
        "intent": "ask_cutoff_score",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi ngành CNTT tại PTIT, câu này tiếp tục hỏi phương thức xét học bạ."
    },
    {
        "q": "Vậy khối A01 có xét được không?",
        "intent": "ask_cutoff_score",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi ngành CNTT tại PTIT, câu này hỏi thêm tổ hợp xét tuyển."
    },
    {
        "q": "Ngành công nghệ thông tin sau này làm nghề gì?",
        "intent": "ask_career",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Bách khoa và Đại học Công nghệ khác nhau thế nào nếu học kỹ thuật máy tính?",
        "intent": "compare_universities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường nào ở Hà Nội có ngành truyền thông đa phương tiện?",
        "intent": "search_major",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 18 điểm khối C00 có trường công lập nào ở Hà Nội không?",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm đánh giá năng lực của ngành quản trị kinh doanh ở NEU năm 2025 là bao nhiêu?",
        "intent": "ask_cutoff_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường đó có ký túc xá không?",
        "intent": "search_university",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng đang hỏi thông tin chung về Đại học Thủ đô Hà Nội."
    },
    {
        "q": "Tôi muốn tìm trường đại học gần nhà ở Hà Nội nhưng chưa biết học ngành gì",
        "intent": "ask_location",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Cho em xem thông tin trường NEU",
        "intent": "search_university",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Còn ngành Marketing thì sao?",
        "intent": "search_university",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi thông tin tổng quan về NEU."
    },
    {
        "q": "Học phí ngành đó khoảng bao nhiêu?",
        "intent": "ask_tuition_fee",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi ngành Marketing tại NEU."
    },
    {
        "q": "Điểm chuẩn 2025 theo THPT là bao nhiêu?",
        "intent": "ask_cutoff_score",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi học phí ngành Marketing tại NEU."
    },
    {
        "q": "Cho mình biết về trường Bách Khoa Hà Nội",
        "intent": "search_university",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường này có những ngành gì?",
        "intent": "search_university",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi thông tin về Bách Khoa Hà Nội."
    },
    {
        "q": "Điểm chuẩn CNTT năm 2024 là bao nhiêu?",
        "intent": "ask_cutoff_score",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng xem danh sách ngành của Bách Khoa và quan tâm CNTT."
    },
    {
        "q": "Em 25 điểm có đủ vào ngành đó không?",
        "intent": "recommendation_by_score",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điểm chuẩn CNTT Bách Khoa năm 2024."
    },
    {
        "q": "Học phí trường đó một năm khoảng bao nhiêu?",
        "intent": "ask_tuition_fee",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi khả năng vào CNTT Bách Khoa với 25 điểm."
    },
    {
        "q": "Cho em thông tin về USTH (Đại học Khoa học và Công nghệ Hà Nội)",
        "intent": "search_university",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "có những ngành gì trong trường",
        "intent": "search_university",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi thông tin về USTH."
    },
    {
        "q": "cho tôi học phí của trường đại học Khoa học và công nghệ Hà Nội (USTH)",
        "intent": "ask_tuition_fee",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Thế còn học phí ngành CNTT thì sao?",
        "intent": "ask_tuition_fee",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi học phí chung của USTH."
    },
    {
        "q": "Con tôi được 23 điểm A00 muốn học CNTT, có nên chọn HUST không?",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Nếu không đủ HUST thì còn trường nào ở Hà Nội?",
        "intent": "recommendation_by_score",
        "is_follow_up": true,
        "context_note": "Turn trước phụ huynh hỏi con 23 điểm A00 CNTT có vào HUST không."
    },
    {
        "q": "So sánh PTIT và Học viện Bưu chính ngành An toàn thông tin",
        "intent": "compare_universities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường nào dễ đỗ hơn?",
        "intent": "compare_universities",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng so sánh PTIT và Học viện Bưu chính ngành An toàn thông tin."
    },
    {
        "q": "Hai trường đó học phí chênh lệch nhiều không?",
        "intent": "compare_universities",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng so sánh PTIT và Học viện Bưu chính."
    },
    {
        "q": "diem chuan FTU nganh Ngoai thuong 2024 la bao nhieu",
        "intent": "ask_cutoff_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Còn năm 2025 thì sao?",
        "intent": "ask_cutoff_score",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điểm chuẩn FTU ngành Ngoại thương năm 2024."
    },
    {
        "q": "Theo phương thức học bạ thì lấy bao nhiêu điểm?",
        "intent": "ask_cutoff_score",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điểm chuẩn FTU ngành Ngoại thương."
    },
    {
        "q": "Em được 20 điểm D01 muốn học Luật ở Hà Nội thì nên chọn trường nào?",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Có trường nào dễ hơn Luật Hà Nội không?",
        "intent": "recommendation_by_score",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng 20 điểm D01 muốn học Luật ở Hà Nội."
    },
    {
        "q": "Ngành Luật ở Hà Nội có những trường nào đào tạo?",
        "intent": "search_major",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Còn trường nào nữa?",
        "intent": "search_major",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng xem danh sách trường đào tạo Luật ở Hà Nội."
    },
    {
        "q": "Phenikaa có đào tạo ngành Trí tuệ nhân tạo không?",
        "intent": "search_university",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành AI ra trường làm gì?",
        "intent": "ask_career",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi Phenikaa có đào tạo ngành Trí tuệ nhân tạo không."
    },
    {
        "q": "Lương khởi điểm ngành đó khoảng bao nhiêu?",
        "intent": "ask_career",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi việc làm sau khi học AI tại Phenikaa."
    },
    {
        "q": "HAUI có những ngành kỹ thuật nào?",
        "intent": "search_university",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn ngành Cơ khí năm 2025 là bao nhiêu?",
        "intent": "ask_cutoff_score",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi các ngành kỹ thuật của HAUI và chọn Cơ khí."
    },
    {
        "q": "Em 22 điểm A00 có đủ vào ngành đó không?",
        "intent": "recommendation_by_score",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điểm chuẩn Cơ khí HAUI năm 2025."
    },
    {
        "q": "Thăng Long có ngành Du lịch không?",
        "intent": "search_university",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí ngành Du lịch ở trường đó thế nào?",
        "intent": "ask_tuition_fee",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi Thăng Long có ngành Du lịch không."
    },
    {
        "q": "FPT Hà Nội đào tạo những ngành công nghệ nào?",
        "intent": "search_university",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "So sánh FPT và USTH về học phí ngành CNTT",
        "intent": "compare_universities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường nào rẻ hơn?",
        "intent": "compare_universities",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng so sánh học phí CNTT giữa FPT và USTH."
    },
    {
        "q": "Con em được 19 điểm khối C00, ở Hà Nội có trường nào phù hợp không?",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Nếu muốn học sư phạm thì sao?",
        "intent": "recommendation_by_score",
        "is_follow_up": true,
        "context_note": "Turn trước phụ huynh hỏi con 19 điểm C00 tìm trường ở Hà Nội."
    },
    {
        "q": "Học viện Ngân hàng có ngành Tài chính ngân hàng không?",
        "intent": "search_university",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn ngành đó năm 2024 theo D01 là mấy?",
        "intent": "ask_cutoff_score",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi Học viện Ngân hàng có ngành Tài chính ngân hàng không."
    },
    {
        "q": "Cho em danh sách trường đại học công lập ở Hà Nội",
        "intent": "ask_location",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Còn trường tư thục nào nữa không?",
        "intent": "ask_location",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng xem danh sách trường công lập ở Hà Nội."
    },
    {
        "q": "Trường đó ở quận nào?",
        "intent": "search_university",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi thông tin về một trường cụ thể ở Hà Nội."
    },
    {
        "q": "Em chào ạ, em mới vào app",
        "intent": "greeting",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Mình cần hỏi gì để tra điểm chuẩn?",
        "intent": "help",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường nào ở Cần Thơ học CNTT tốt?",
        "intent": "unknown",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Có học bổng 100% tại NEU không?",
        "intent": "ask_scholarship",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Cho em lịch thi THPT Quốc gia 2026",
        "intent": "unknown",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 27 điểm B00 muốn vào Y Hà Nội ngành Y đa khoa có được không?",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Thế còn ngành Dược thì sao?",
        "intent": "search_university",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi khả năng vào Y đa khoa Y Hà Nội với 27 điểm B00."
    },
    {
        "q": "Em 21.5 điểm A00 thích lập trình, gợi ý trường ở Hà Nội",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Mình 23 điểm khối D07 muốn học Quản trị khách sạn ở Hà Nội",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Con em 20 điểm khối A01 có vào được ngành Kế toán ở Hà Nội không?",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 25 điểm muốn học ngành Dược ở Hà Nội thì nên chọn trường nào?",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "22 điểm khối xã hội muốn học Truyền thông ở Hà Nội",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 19 điểm C00 có cơ hội vào ngành Du lịch không?",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Mình được 24 điểm A00, ngân sách học phí tối đa 25 triệu/năm thì chọn trường nào?",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 26.5 điểm A01 muốn vào Ngoại thương ngành Kinh tế đối ngoại có được không?",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Nếu chỉ xét THPT thì em 22 điểm A00 học CNTT nên đăng ký trường nào ở Hà Nội?",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 17.5 điểm có trường nào ở Hà Nội nhận không ạ?",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Với điểm đó thì nên chọn ngành nào an toàn hơn?",
        "intent": "recommendation_by_score",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng nói được 22 điểm A00 và muốn học ở Hà Nội."
    },
    {
        "q": "Thế nếu em hạ nguyện vọng xuống thì còn trường nào?",
        "intent": "recommendation_by_score",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng 22 điểm A00 tìm trường CNTT Hà Nội."
    },
    {
        "q": "Điểm chuẩn ngành Quản trị kinh doanh NEU năm 2024 theo THPT",
        "intent": "ask_cutoff_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "HUST ngành Kỹ thuật điện năm 2025 lấy bao nhiêu điểm khối A00?",
        "intent": "ask_cutoff_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "diem chuan PTIT nganh CNTT 2023",
        "intent": "ask_cutoff_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn đánh giá năng lực USTH ngành CNTT 2025",
        "intent": "ask_cutoff_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Luật Hà Nội ngành Luật kinh tế năm 2024 lấy bao nhiêu điểm D01?",
        "intent": "ask_cutoff_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Phenikaa ngành AI năm 2025 điểm chuẩn bao nhiêu?",
        "intent": "ask_cutoff_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Thế còn năm 2023?",
        "intent": "ask_cutoff_score",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điểm chuẩn PTIT ngành CNTT năm 2025."
    },
    {
        "q": "Theo học bạ thì bao nhiêu điểm?",
        "intent": "ask_cutoff_score",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điểm chuẩn NEU ngành QTKD năm 2024 THPT."
    },
    {
        "q": "Khối A01 có xét không?",
        "intent": "ask_cutoff_score",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điểm chuẩn HUST ngành CNTT."
    },
    {
        "q": "Cho em xem thông tin Học viện Tài chính",
        "intent": "search_university",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường Công nghiệp Hà Nội có ngành Cơ khí chế tạo máy không?",
        "intent": "search_university",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Mỹ thuật Việt Nam đào tạo những ngành gì?",
        "intent": "search_university",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "truong do co nganh ke toan khong",
        "intent": "search_university",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi thông tin NEU."
    },
    {
        "q": "Còn chương trình tiếng Anh thì sao?",
        "intent": "search_university",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng xem danh sách ngành NEU."
    },
    {
        "q": "Ngành Kiến trúc ở Hà Nội trường nào đào tạo?",
        "intent": "search_major",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Quản lý đất đai học những gì?",
        "intent": "search_major",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Hà Nội có trường nào dạy ngành Báo chí?",
        "intent": "search_major",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành này còn trường nào nữa?",
        "intent": "search_major",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi trường đào tạo Báo chí ở Hà Nội."
    },
    {
        "q": "Học phí Đại học Thương mại khoảng bao nhiêu?",
        "intent": "ask_tuition_fee",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "hoc phi nganh marketing o NEU 1 nam",
        "intent": "ask_tuition_fee",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "FPT tính học phí theo tín chỉ hay theo năm?",
        "intent": "ask_tuition_fee",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí trường đó có cao không?",
        "intent": "ask_tuition_fee",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi thông tin Đại học Thương mại."
    },
    {
        "q": "So sánh NEU và FTU ngành Kinh tế quốc tế",
        "intent": "compare_universities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Bách khoa hay Công nghệ tốt hơn cho ngành CNTT?",
        "intent": "compare_universities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường nào uy tín hơn?",
        "intent": "compare_universities",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng so sánh NEU và FTU."
    },
    {
        "q": "Ngành Dược ra trường làm việc ở đâu?",
        "intent": "ask_career",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học Kế toán có dễ xin việc không?",
        "intent": "ask_career",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Lương ngành đó khoảng bao nhiêu?",
        "intent": "ask_career",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi việc làm ngành Marketing."
    },
    {
        "q": "Liệt kê các trường tư thục ở Hà Nội",
        "intent": "ask_location",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Hà Nội có bao nhiêu trường đại học công lập?",
        "intent": "ask_location",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Còn trường nào ở khu Cầu Giấy không?",
        "intent": "ask_location",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng xem danh sách trường Hà Nội."
    },
    {
        "q": "Chào bot, em cần tư vấn tuyển sinh",
        "intent": "greeting",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "App này dùng để làm gì?",
        "intent": "help",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường đại học ở Huế nào mạnh về kinh tế?",
        "intent": "unknown",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Cho em đề thi thử môn Toán",
        "intent": "unknown",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 24 điểm A00 muốn học Hệ thống thông tin quản lý ở Hà Nội",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn ngành Ngôn ngữ Trung Quốc Hà Nội năm 2025",
        "intent": "ask_cutoff_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học viện Ngoại ngữ có ngành Ngôn ngữ Nhật không?",
        "intent": "search_university",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Công nghệ thực phẩm trường nào có ở Hà Nội?",
        "intent": "search_major",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí Y dược Hà Nội ngành Y đa khoa",
        "intent": "ask_tuition_fee",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "So sánh Thăng Long và Phenikaa ngành QTKD",
        "intent": "compare_universities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Luật ra trường làm việc gì?",
        "intent": "ask_career",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Các trường đại học ở Hà Nội thuộc Bộ GD&ĐT",
        "intent": "ask_location",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 28 điểm A00 có nên đặt Bách Khoa nguyện vọng 1 không?",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn HAUI ngành Điện tử viễn thông 2024",
        "intent": "ask_cutoff_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "ĐH Công nghệ (UET) có những ngành CNTT nào?",
        "intent": "search_university",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành An toàn thông tin khác gì CNTT?",
        "intent": "search_major",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí ngành Logistics tại FTU",
        "intent": "ask_tuition_fee",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "NEU với HV Ngân hàng nên chọn trường nào học Tài chính?",
        "intent": "compare_universities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Y tá ra trường làm gì?",
        "intent": "ask_career",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường nào ở Hà Nội gần sân bay Nội Bài?",
        "intent": "ask_location",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Mình muốn biết cách dùng chatbot",
        "intent": "help",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Xin chào, em là học sinh lớp 12",
        "intent": "greeting",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em muốn tìm trường ở nước ngoài",
        "intent": "unknown",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Con tôi 24.5 điểm D01 thích Luật, gợi ý trường Hà Nội",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn B00 ngành Y đa khoa Y Hà Nội 2025",
        "intent": "ask_cutoff_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường đó có đào tạo ngành Dược không?",
        "intent": "search_university",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi Y Hà Nội ngành Y đa khoa."
    },
    {
        "q": "Em 22 điểm có đủ không?",
        "intent": "recommendation_by_score",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điểm chuẩn Y đa khoa Y Hà Nội 2025."
    },
    {
        "q": "Ngành Quản trị nhà hàng trường nào có?",
        "intent": "search_major",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí Bách Khoa ngành Cơ khí",
        "intent": "ask_tuition_fee",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "HUST và HAUI ngành Điện tử khác nhau thế nào?",
        "intent": "compare_universities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Kiến trúc cơ hội việc làm ra sao?",
        "intent": "ask_career",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Danh sách trường đại học ở Hà Nội theo quận",
        "intent": "ask_location",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 20 điểm A00 muốn học ngành Môi trường ở Hà Nội",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn ngành Môi trường ĐH Thủy lợi 2024",
        "intent": "ask_cutoff_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "ĐH Thăng Long có ngành CNTT không?",
        "intent": "search_university",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Khoa học dữ liệu học ở đâu ở Hà Nội?",
        "intent": "search_major",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí Phenikaa một năm bao nhiêu?",
        "intent": "ask_tuition_fee",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "FPT và Bách Khoa ngành CNTT trường nào phù hợp hơn?",
        "intent": "compare_universities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Ngôn ngữ Anh làm nghề gì?",
        "intent": "ask_career",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ở Hà Nội trường tư nào học phí thấp?",
        "intent": "ask_location",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Bot ơi giúp em với",
        "intent": "greeting",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Làm sao để xem điểm chuẩn theo phương thức?",
        "intent": "help",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em cần tư vấn chọn ngành theo sở thích",
        "intent": "help",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường nào ở Nha Trang học Du lịch?",
        "intent": "unknown",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Có app nào ôn thi THPT tốt không?",
        "intent": "unknown",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 23 điểm A01 muốn học Kinh tế ở Hà Nội",
        "intent": "recommendation_by_score",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Còn phương thức xét tuyển khác thì sao?",
        "intent": "ask_cutoff_score",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng 23 điểm A01 tìm ngành Kinh tế ở Hà Nội và xem điểm chuẩn NEU."
    },
    {
        "q": "NEU xét tuyển những phương thức nào?",
        "intent": "ask_admission_method",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Bách Khoa có xét tuyển bằng học bạ không?",
        "intent": "ask_admission_method",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "HUST tuyển sinh theo DGNL như thế nào?",
        "intent": "ask_admission_method",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "PTIT có phương thức xét tuyển thẳng không?",
        "intent": "ask_admission_method",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "FTU xét THPT quốc gia cần điều kiện gì?",
        "intent": "ask_admission_method",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "USTH tuyển sinh bằng phương thức nào?",
        "intent": "ask_admission_method",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Phenikaa có xét đánh giá năng lực không?",
        "intent": "ask_admission_method",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường FPT tuyển sinh theo những hình thức nào?",
        "intent": "ask_admission_method",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học viện Bưu chính xét học bạ thế nào?",
        "intent": "ask_admission_method",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Luật Hà Nội có xét tuyển kết hợp không?",
        "intent": "ask_admission_method",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Thăng Long tuyển sinh theo THPT hay học bạ?",
        "intent": "ask_admission_method",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "HAUI có phương thức xét tuyển nào cho ngành Cơ khí?",
        "intent": "ask_admission_method",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Y Hà Nội xét tuyển ngành Y đa khoa bằng phương thức gì?",
        "intent": "ask_admission_method",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "ĐH Thủy lợi có xét DGNL không?",
        "intent": "ask_admission_method",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học viện Ngân hàng tuyển sinh theo những PT nào?",
        "intent": "ask_admission_method",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "truong nao o ha noi xet tuyen bang hoc ba",
        "intent": "ask_admission_method",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Phương thức DGNL là gì ạ?",
        "intent": "ask_admission_method",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Xét tuyển học bạ khác gì thi THPT quốc gia?",
        "intent": "ask_admission_method",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em muốn nộp hồ sơ theo phương thức đánh giá năng lực thì làm sao?",
        "intent": "ask_admission_method",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường nào ở Hà Nội xét tuyển bằng học bạ ngành CNTT?",
        "intent": "ask_admission_method",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "NEU ngành Marketing xét theo THPT hay học bạ?",
        "intent": "ask_admission_method",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Bách Khoa ngành CNTT có xét tuyển thẳng không?",
        "intent": "ask_admission_method",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "PTIT xét tuyển ngành CNTT theo những phương thức nào?",
        "intent": "ask_admission_method",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Con tôi muốn nộp hồ sơ học bạ vào NEU thì cần gì?",
        "intent": "ask_admission_method",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "ĐH Công nghệ UET tuyển sinh CNTT bằng PT gì?",
        "intent": "ask_admission_method",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Còn phương thức học bạ thì sao?",
        "intent": "ask_admission_method",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi PT xét tuyển THPT của NEU."
    },
    {
        "q": "Trường đó có xét DGNL không?",
        "intent": "ask_admission_method",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi phương thức tuyển sinh NEU."
    },
    {
        "q": "Ngành đó xét theo khối nào?",
        "intent": "ask_admission_method",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi PTIT xét tuyển ngành CNTT."
    },
    {
        "q": "Thế còn xét tuyển thẳng?",
        "intent": "ask_admission_method",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi phương thức tuyển sinh Bách Khoa."
    },
    {
        "q": "Học bạ cần điểm trung bình bao nhiêu?",
        "intent": "ask_admission_method",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi FTU xét học bạ."
    },
    {
        "q": "DGNL thì thi môn gì?",
        "intent": "ask_admission_method",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi phương thức đánh giá năng lực."
    },
    {
        "q": "PT này áp dụng cho ngành Marketing không?",
        "intent": "ask_admission_method",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi NEU xét THPT."
    },
    {
        "q": "Em nộp hồ sơ online được không?",
        "intent": "ask_admission_method",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi phương thức tuyển sinh FPT."
    },
    {
        "q": "Còn phương thức nào khác nữa?",
        "intent": "ask_admission_method",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi USTH tuyển sinh thế nào."
    },
    {
        "q": "Xét học bạ có cần chứng chỉ tiếng Anh không?",
        "intent": "ask_admission_method",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điều kiện xét học bạ."
    },
    {
        "q": "Phương thức đó áp dụng năm 2025 chứ?",
        "intent": "ask_admission_method",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi PT THPT tại một trường Hà Nội."
    },
    {
        "q": "Trường ấy có xét kết hợp điểm thi và học bạ không?",
        "intent": "ask_admission_method",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi Phenikaa tuyển sinh."
    },
    {
        "q": "NEU có xét tuyển thẳng olympic không?",
        "intent": "ask_admission_method",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi phương thức NEU."
    },
    {
        "q": "HUST xét tuyển bằng chứng chỉ quốc tế không?",
        "intent": "ask_admission_method",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi PT tuyển sinh HUST."
    },
    {
        "q": "Em muốn đăng ký PT đó thì nộp hồ sơ ở đâu?",
        "intent": "ask_admission_method",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi USTH xét DGNL."
    },
    {
        "q": "NEU có học bổng cho tân sinh viên không?",
        "intent": "ask_scholarship",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Bách Khoa có học bổng khuyến khích học tập không?",
        "intent": "ask_scholarship",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "FPT University có học bổng 100% học phí không?",
        "intent": "ask_scholarship",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "USTH có chương trình học bổng quốc tế không?",
        "intent": "ask_scholarship",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Phenikaa miễn giảm học phí thế nào?",
        "intent": "ask_scholarship",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học bổng ngành CNTT ở Hà Nội trường nào có?",
        "intent": "ask_scholarship",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "FTU có học bổng cho sinh viên giỏi không?",
        "intent": "ask_scholarship",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 27 điểm có được học bổng không?",
        "intent": "ask_scholarship",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học bổng tại PTIT cần điều kiện gì?",
        "intent": "ask_scholarship",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Co hoc bong tai NEU khong",
        "intent": "ask_scholarship",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường tư ở Hà Nội học bổng nhiều không?",
        "intent": "ask_scholarship",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học bổng và miễn giảm học phí khác nhau thế nào?",
        "intent": "ask_scholarship",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Con tôi giỏi Toán có học bổng ở Bách Khoa không?",
        "intent": "ask_scholarship",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Thăng Long có hỗ trợ tài chính cho sinh viên không?",
        "intent": "ask_scholarship",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học viện Ngân hàng có học bổng ngành Tài chính không?",
        "intent": "ask_scholarship",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em muốn xin học bổng toàn phần thì làm sao?",
        "intent": "ask_scholarship",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học bổng dành cho sinh viên vùng khó khăn ở Hà Nội",
        "intent": "ask_scholarship",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Y Hà Nội có học bổng ngành Y không?",
        "intent": "ask_scholarship",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học bổng đó cần GPA bao nhiêu?",
        "intent": "ask_scholarship",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi học bổng NEU."
    },
    {
        "q": "Còn học bổng ngành khác không?",
        "intent": "ask_scholarship",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi học bổng NEU ngành Marketing."
    },
    {
        "q": "Em có đủ điều kiện xin không?",
        "intent": "ask_scholarship",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi học bổng FPT."
    },
    {
        "q": "Nộp hồ sơ học bổng khi nào?",
        "intent": "ask_scholarship",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi học bổng USTH."
    },
    {
        "q": "Trường đó có miễn 50% học phí không?",
        "intent": "ask_scholarship",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi miễn giảm Phenikaa."
    },
    {
        "q": "Học bổng có áp dụng ngành CNTT không?",
        "intent": "ask_scholarship",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi học bổng Bách Khoa."
    },
    {
        "q": "Thế còn học bổng doanh nghiệp tài trợ?",
        "intent": "ask_scholarship",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi học bổng PTIT."
    },
    {
        "q": "Học bổng full có cần cam kết không?",
        "intent": "ask_scholarship",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi học bổng 100% FPT."
    },
    {
        "q": "Con em học giỏi môn Anh có được ưu tiên học bổng không?",
        "intent": "ask_scholarship",
        "is_follow_up": true,
        "context_note": "Turn trước phụ huynh hỏi học bổng FTU."
    },
    {
        "q": "Học bổng này dành cho khối A00 phải không?",
        "intent": "ask_scholarship",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi học bổng tân sinh viên."
    },
    {
        "q": "Em cần chuẩn bị giấy tờ gì để xin?",
        "intent": "ask_scholarship",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điều kiện học bổng NEU."
    },
    {
        "q": "Còn hỗ trợ vay vốn sinh viên không?",
        "intent": "ask_scholarship",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi hỗ trợ tài chính HV Ngân hàng."
    },
    {
        "q": "NEU có ký túc xá không?",
        "intent": "ask_facilities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Bách Khoa ký túc xá ở đâu?",
        "intent": "ask_facilities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "FPT Hà Nội có KTX cho sinh viên năm nhất không?",
        "intent": "ask_facilities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "USTH cơ sở vật chất thế nào?",
        "intent": "ask_facilities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "PTIT có ký túc xá nội trú không?",
        "intent": "ask_facilities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường Phenikaa có phòng lab CNTT không?",
        "intent": "ask_facilities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "HAUI có ký túc xá cho nữ sinh không?",
        "intent": "ask_facilities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Thăng Long campus rộng không?",
        "intent": "ask_facilities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường đại học ở Hà Nội nào có KTX tốt?",
        "intent": "ask_facilities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học viện Bưu chính có thư viện lớn không?",
        "intent": "ask_facilities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Y Hà Nội bệnh viện thực hành ở đâu?",
        "intent": "ask_facilities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "truong co ky tuc xa khong",
        "intent": "ask_facilities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "FTU cơ sở chính ở đâu?",
        "intent": "ask_facilities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em muốn ở nội trú thì trường nào ở Hà Nội có KTX?",
        "intent": "ask_facilities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Luật Hà Nội có sân thể thao không?",
        "intent": "ask_facilities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "ĐH Thủ đô có ký túc xá giá rẻ không?",
        "intent": "ask_facilities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Phòng học UET có máy chiếu và wifi không?",
        "intent": "ask_facilities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường công lập Hà Nội nào có cơ sở vật chất hiện đại?",
        "intent": "ask_facilities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "KTX trường đó giá bao nhiêu một tháng?",
        "intent": "ask_facilities",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi NEU có ký túc xá không."
    },
    {
        "q": "Còn KTX khu vực nào khác không?",
        "intent": "ask_facilities",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi KTX Bách Khoa."
    },
    {
        "q": "Trường này có căng tin và siêu thị không?",
        "intent": "ask_facilities",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi cơ sở FPT Hà Nội."
    },
    {
        "q": "Phòng lab AI có đủ máy không?",
        "intent": "ask_facilities",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi lab CNTT Phenikaa."
    },
    {
        "q": "Em ở xa có được ưu tiên KTX không?",
        "intent": "ask_facilities",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi KTX PTIT."
    },
    {
        "q": "Thư viện mở cửa mấy giờ?",
        "intent": "ask_facilities",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi thư viện HV Bưu chính."
    },
    {
        "q": "Trường đó có xe buýt đưa đón không?",
        "intent": "ask_facilities",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi cơ sở USTH."
    },
    {
        "q": "KTX có điều hòa và nóng lạnh không?",
        "intent": "ask_facilities",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi KTX HAUI."
    },
    {
        "q": "Campus có khu ký túc riêng cho SV năm nhất không?",
        "intent": "ask_facilities",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi campus Thăng Long."
    },
    {
        "q": "Bệnh viện thực hành có đủ chỗ cho sinh viên không?",
        "intent": "ask_facilities",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi bệnh viện Y Hà Nội."
    },
    {
        "q": "Trường ấy có hồ bơi không?",
        "intent": "ask_facilities",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi cơ s sở Luật Hà Nội."
    },
    {
        "q": "Em muốn thuê phòng ngoài thì trường có hỗ trợ tìm nhà không?",
        "intent": "ask_facilities",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi KTX NEU."
    },
    {
        "q": "Sài Gòn có trường CNTT nào ngon không?",
        "intent": "unknown",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 25 điểm A00 muốn học ở TP.HCM thì chọn trường nào?",
        "intent": "unknown",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Dữ liệu điểm chuẩn trên app lấy từ đâu vậy?",
        "intent": "help",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "App chỉ tra cứu được Hà Nội thôi à?",
        "intent": "help",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "So sánh Bách Khoa, NEU và FTU về điểm chuẩn CNTT năm 2024",
        "intent": "compare_universities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "BKHN với PTIT với UET ngành an toàn thông tin cái nào cao hơn?",
        "intent": "compare_universities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí và điểm chuẩn Bách Khoa với Phenikaa khác nhau thế nào?",
        "intent": "compare_universities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Thế còn ở Đà Nẵng thì sao?",
        "intent": "unknown",
        "is_follow_up": true,
        "context_note": "User vừa hỏi trường CNTT ở Hà Nội"
    },
    {
        "q": "Hệ thống có hỗ trợ ngoài Hà Nội không?",
        "intent": "help",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "So sánh NEU, FTU và Thương mại về học phí ngành Logistics",
        "intent": "compare_universities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ở Hồ Chí Minh có đại học công lập nào mạnh CNTT?",
        "intent": "unknown",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Phải hỏi như nào để so sánh hai trường?",
        "intent": "help",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Còn học phí thì trường nào rẻ hơn?",
        "intent": "compare_universities",
        "is_follow_up": true,
        "context_note": "User vừa so sánh Bách Khoa và Phenikaa về điểm chuẩn CNTT"
    },
    {
        "q": "Tìm trường du học Mỹ giúp em",
        "intent": "unknown",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Bách Khoa hay NEU hay FTU học phí thấp hơn?",
        "intent": "compare_universities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "điểm chuẩn ngành hàng không của USTH thì sao",
        "intent": "ask_cutoff_score",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điểm chuẩn HUST ngành Trí tuệ nhân tạo năm 2024."
    },
    {
        "q": "thế còn FTU thì học phí bao nhiêu",
        "intent": "ask_tuition_fee",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi học phí NEU."
    },
    {
        "q": "PTIT có những ngành gì",
        "intent": "search_university",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi HUST có những ngành gì."
    },
    {
        "q": "thế còn Phenikaa ngành CNTT năm 2024",
        "intent": "ask_cutoff_score",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điểm chuẩn Bách Khoa ngành CNTT năm 2024."
    },
    {
        "q": "học phí NEU ngành Marketing thì sao",
        "intent": "ask_tuition_fee",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi học phí chung của USTH."
    },
    {
        "q": "so sánh USTH với HUST về điểm chuẩn CNTT",
        "intent": "compare_universities",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng so sánh NEU và FTU."
    },
    {
        "q": "HAUI ngành Điện tử năm 2025 lấy bao nhiêu điểm",
        "intent": "ask_cutoff_score",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điểm chuẩn HUST ngành Điện tử năm 2025."
    },
    {
        "q": "nếu em muốn học AI ở USTH thì sao",
        "intent": "recommendation_by_score",
        "is_follow_up": true,
        "context_note": "User vừa hỏi gợi ý trường với 24 điểm A00 học CNTT ở Hà Nội."
    },
    {
        "q": "USTH có KTX không",
        "intent": "ask_facilities",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi NEU có ký túc xá không."
    },
    {
        "q": "HUST xét tuyển bằng học bạ không",
        "intent": "ask_admission_method",
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi NEU xét tuyển những phương thức nào."
    },
    {
        "q": "So sánh NEU và FTU ngành Tài chính năm 2024 khối A00 theo THPT",
        "intent": "compare_universities",
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Hai trường này khác nhau thế nào về điểm chuẩn?",
        "intent": "compare_universities",
        "is_follow_up": true,
        "context_note": "Các trường vừa so sánh: NEU, FTU."
    },
    {
        "q": "So sánh Bách Khoa và PTIT về số ngành và phương thức xét tuyển",
        "intent": "compare_universities",
        "is_follow_up": false,
        "context_note": null
    }
];
exports.ENTITY_EXAMPLES = [
    {
        "q": "Em được 24 điểm khối A00 muốn học CNTT ở Hà Nội thì nên chọn trường nào ạ?",
        "a": {
            "score": 24,
            "subject_group": "A00",
            "major": "CNTT",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Mình thi được 22.5 điểm A01, muốn học Marketing ở Hà Nội thì có trường nào hợp không?",
        "a": {
            "score": 22.5,
            "subject_group": "A01",
            "major": "Marketing",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 25 điểm D01 muốn học Ngôn ngữ Anh, gợi ý giúp em vài trường ở Hà Nội",
        "a": {
            "score": 25,
            "subject_group": "D01",
            "major": "Ngôn ngữ Anh",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Con tôi được 21 điểm khối A, muốn học Kế toán ở Hà Nội thì nên cân nhắc trường nào?",
        "a": {
            "score": 21,
            "subject_group": "khối A",
            "major": "Kế toán",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em khoảng 27 điểm B00 thì có cơ hội vào Y Hà Nội ngành Y đa khoa không ạ?",
        "a": {
            "score": 27,
            "subject_group": "B00",
            "major": "Y đa khoa",
            "location": null,
            "university_name": "Y Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Mình được 23 điểm, tư vấn trường ở Hà Nội giúp mình với",
        "a": {
            "score": 23,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 20 điểm khối tự nhiên có nên đăng ký Công nghiệp hay Phenikaa không?",
        "a": {
            "score": 20,
            "subject_group": "khối tự nhiên",
            "major": null,
            "location": null,
            "university_name": "Đại học Công nghiệp, Phenikaa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "24 điểm tổ hợp toán lý hóa muốn học Cơ khí thì nên chọn HUST hay HAUI?",
        "a": {
            "score": 24,
            "subject_group": "tổ hợp toán lý hóa",
            "major": "Cơ khí",
            "location": null,
            "university_name": "HUST, HAUI",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Thế nếu em muốn học AI thì sao?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Trí tuệ nhân tạo",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "User vừa cung cấp điểm thi và hỏi gợi ý trường CNTT ở Hà Nội"
    },
    {
        "q": "Em được 18.5 điểm A00, có trường nào ở Hà Nội đào tạo Điện tử phù hợp không?",
        "a": {
            "score": 18.5,
            "subject_group": "A00",
            "major": "Điện tử",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Con tôi 26 điểm D01 muốn học Tài chính ngân hàng, có nên đặt NEU làm nguyện vọng không?",
        "a": {
            "score": 26,
            "subject_group": "D01",
            "major": "Tài chính ngân hàng",
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 23.75 điểm A01 muốn học An toàn thông tin ở Hà Nội thì có những lựa chọn nào?",
        "a": {
            "score": 23.75,
            "subject_group": "A01",
            "major": "An toàn thông tin",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em khoảng 20 điểm khối xã hội thì nên học trường nào ở Hà Nội?",
        "a": {
            "score": 20,
            "subject_group": "khối xã hội",
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Mình 22 điểm D01, muốn học Luật ở Hà Nội thì gợi ý giúp mình",
        "a": {
            "score": 22,
            "subject_group": "D01",
            "major": "Luật",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em được 24.2 điểm A00, muốn học Logistics ở Hà Nội thì trường nào vừa sức?",
        "a": {
            "score": 24.2,
            "subject_group": "A00",
            "major": "Logistics",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 19 điểm học bạ muốn tìm trường ở Hà Nội có ngành Du lịch",
        "a": {
            "score": 19,
            "subject_group": null,
            "major": "Du lịch",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": "học bạ"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "21 điểm THPT quốc gia có nên học Quản trị kinh doanh ở Thăng Long không?",
        "a": {
            "score": 21,
            "subject_group": null,
            "major": "Quản trị kinh doanh",
            "location": null,
            "university_name": "Thăng Long",
            "year": null,
            "method_code": "THPT"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "26 điểm muốn vào Ngoại thương thì nên chọn ngành nào?",
        "a": {
            "score": 26,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Ngoại thương",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em thi A01 được 23 điểm, thích ngành dữ liệu hoặc AI thì Hà Nội có trường nào hợp?",
        "a": {
            "score": 23,
            "subject_group": "A01",
            "major": "Trí tuệ nhân tạo",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Mình 25 điểm khối A00, phân vân CNTT ở Bách Khoa hay Bưu chính thì nên đặt nguyện vọng sao?",
        "a": {
            "score": 25,
            "subject_group": "A00",
            "major": "CNTT",
            "location": null,
            "university_name": "Bách Khoa, Học viện Bưu chính",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn Bách Khoa ngành CNTT năm 2024 là bao nhiêu?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "Bách Khoa",
            "year": 2024,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Cho mình hỏi điểm chuẩn NEU ngành Marketing 2025 theo THPT",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Marketing",
            "location": null,
            "university_name": "NEU",
            "year": 2025,
            "method_code": "THPT"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "diem chuan BK 2023 la bao nhieu",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "BK",
            "year": 2023,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn ngành Kế toán của Học viện Ngân hàng năm ngoái là bao nhiêu?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Kế toán",
            "location": null,
            "university_name": "Học viện Ngân hàng",
            "year": 2025,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Thế còn năm 2025?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": 2025,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "User vừa hỏi điểm chuẩn Bách Khoa ngành CNTT năm 2024"
    },
    {
        "q": "FTU ngành Logistics điểm chuẩn 2024 bao nhiêu ạ?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Logistics",
            "location": null,
            "university_name": "FTU",
            "year": 2024,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn USTH ngành Công nghệ thông tin 2023 có cao không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Công nghệ thông tin",
            "location": null,
            "university_name": "USTH",
            "year": 2023,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học viện Bưu chính ngành An toàn thông tin lấy bao nhiêu điểm năm 2025?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "An toàn thông tin",
            "location": null,
            "university_name": "Học viện Bưu chính",
            "year": 2025,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Còn phương thức học bạ thì sao?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": "học bạ"
        },
        "is_follow_up": true,
        "context_note": "User vừa hỏi điểm chuẩn một ngành theo phương thức THPT"
    },
    {
        "q": "Điểm chuẩn ngành Luật của Luật Hà Nội năm 2024 theo D01 là bao nhiêu?",
        "a": {
            "score": null,
            "subject_group": "D01",
            "major": "Luật",
            "location": null,
            "university_name": "Luật Hà Nội",
            "year": 2024,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường Thương mại ngành Quản trị kinh doanh 2025 lấy điểm chuẩn bao nhiêu?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Quản trị kinh doanh",
            "location": null,
            "university_name": "Thương mại",
            "year": 2025,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn Hà Nội ngành Dược 2024 trường Y dược là bao nhiêu?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Dược",
            "location": "Hà Nội",
            "university_name": "Y dược",
            "year": 2024,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "HAUI ngành Cơ khí điểm chuẩn 2023 theo A00 là mấy điểm?",
        "a": {
            "score": null,
            "subject_group": "A00",
            "major": "Cơ khí",
            "location": null,
            "university_name": "HAUI",
            "year": 2023,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành đó năm trước lấy bao nhiêu?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": 2025,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "User vừa hỏi thông tin một ngành cụ thể tại một trường ở Hà Nội"
    },
    {
        "q": "Cho em xem điểm chuẩn ngành Tài chính ngân hàng của Kinh tế Quốc dân 2024",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Tài chính ngân hàng",
            "location": null,
            "university_name": "Kinh tế Quốc dân",
            "year": 2024,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn Phenikaa ngành Trí tuệ nhân tạo 2025 có không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Trí tuệ nhân tạo",
            "location": null,
            "university_name": "Phenikaa",
            "year": 2025,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Mỹ thuật năm 2024 lấy bao nhiêu điểm ngành Kiến trúc?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Kiến trúc",
            "location": null,
            "university_name": "Mỹ thuật",
            "year": 2024,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Có điểm 2023 không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": 2023,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "User vừa hỏi điểm chuẩn cùng trường và cùng ngành năm 2024"
    },
    {
        "q": "Điểm chuẩn ngành Du lịch ở Thăng Long 2025 là bao nhiêu vậy?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Du lịch",
            "location": null,
            "university_name": "Thăng Long",
            "year": 2025,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "HUST ngành Điện tử năm 2025 theo A01 lấy bao nhiêu điểm?",
        "a": {
            "score": null,
            "subject_group": "A01",
            "major": "Điện tử",
            "location": null,
            "university_name": "HUST",
            "year": 2025,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "USTH có những chương trình đào tạo gì?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "USTH",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Cho mình thông tin về trường Bách Khoa Hà Nội",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": "Bách Khoa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "NEU có ngành Marketing không ạ?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Marketing",
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường đó có ngành CNTT không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "User vừa hỏi thông tin về trường Phenikaa"
    },
    {
        "q": "FPT Hà Nội có những ngành nào liên quan đến công nghệ?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "công nghệ",
            "location": "Hà Nội",
            "university_name": "FPT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học viện Ngân hàng đào tạo những ngành gì?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Học viện Ngân hàng",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "truong thuong mai co nganh ke toan khong",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Kế toán",
            "location": null,
            "university_name": "Thương mại",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Đại học Công nghiệp Hà Nội có chương trình An toàn thông tin không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "An toàn thông tin",
            "location": "Hà Nội",
            "university_name": "Đại học Công nghiệp",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngoại thương ở Hà Nội có những ngành kinh tế nào?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "kinh tế",
            "location": "Hà Nội",
            "university_name": "Ngoại thương",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Cho em xem thông tin trường Luật Hà Nội",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": "Luật Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Phenikaa có đào tạo ngành Trí tuệ nhân tạo không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Trí tuệ nhân tạo",
            "location": null,
            "university_name": "Phenikaa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Có ngành dược không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Dược",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "User vừa hỏi danh sách chương trình của một trường y dược ở Hà Nội"
    },
    {
        "q": "Thăng Long có những ngành nào phù hợp khối D01?",
        "a": {
            "score": null,
            "subject_group": "D01",
            "major": null,
            "location": null,
            "university_name": "Thăng Long",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học viện Bưu chính có ngành Công nghệ thông tin không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Công nghệ thông tin",
            "location": null,
            "university_name": "Học viện Bưu chính",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành CNTT có những trường nào ở Hà Nội đào tạo?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Marketing học ở trường nào tại Hà Nội thì phù hợp?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Marketing",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Logistics là học gì và Hà Nội có trường nào dạy?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Logistics",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "An toàn thông tin khác gì CNTT vậy ạ?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "An toàn thông tin",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Tài chính ngân hàng ở Hà Nội có các trường nào?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Tài chính ngân hàng",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "nganh ke toan hoc truong nao o ha noi",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Kế toán",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em muốn tìm hiểu ngành Y đa khoa, học xong sẽ học những gì?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Y đa khoa",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Còn trường nào ở Hà Nội đào tạo nữa?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "User vừa hỏi về ngành Luật và danh sách trường đào tạo"
    },
    {
        "q": "Ngành Trí tuệ nhân tạo nên học ở đâu tại Hà Nội?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Trí tuệ nhân tạo",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Khối tự nhiên có thể học những ngành kỹ thuật nào ở Hà Nội?",
        "a": {
            "score": null,
            "subject_group": "khối tự nhiên",
            "major": "kỹ thuật",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Luật có những trường đại học nào ở Hà Nội?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Luật",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí FPT Hà Nội khoảng bao nhiêu một năm?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": "FPT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí ngành CNTT ở Bách Khoa năm 2025 là bao nhiêu?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "Bách Khoa",
            "year": 2025,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "hoc phi NEU nganh Marketing 1 nam khoang bao nhieu",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Marketing",
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "USTH tính học phí theo năm hay theo tín chỉ?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "USTH",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí ngành Dược ở Y dược Hà Nội có cao không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Dược",
            "location": "Hà Nội",
            "university_name": "Y dược",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Đại học Công nghiệp học phí theo tín chỉ là bao nhiêu?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Đại học Công nghiệp",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Cho mình học phí ngành Kế toán của Học viện Ngân hàng",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Kế toán",
            "location": null,
            "university_name": "Học viện Ngân hàng",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí Thăng Long ngành Du lịch khoảng bao nhiêu?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Du lịch",
            "location": null,
            "university_name": "Thăng Long",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí ngành Luật Hà Nội năm 2024 là bao nhiêu?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Luật",
            "location": "Hà Nội",
            "university_name": "Luật Hà Nội",
            "year": 2024,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "So sánh giúp em Bách Khoa và Học viện Bưu chính ngành CNTT",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "Bách Khoa, Học viện Bưu chính",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "NEU với Thương mại trường nào hợp học Marketing hơn?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Marketing",
            "location": null,
            "university_name": "NEU, Thương mại",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "So sánh học phí FPT và USTH ở Hà Nội",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": "FPT, USTH",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "FTU và NEU ngành Tài chính ngân hàng nên chọn trường nào?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Tài chính ngân hàng",
            "location": null,
            "university_name": "FTU, NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "So sánh điểm chuẩn CNTT 2024 của HUST và HAUI",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "HUST, HAUI",
            "year": 2024,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Phenikaa với Thăng Long ngành Quản trị kinh doanh trường nào học phí dễ chịu hơn?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Quản trị kinh doanh",
            "location": null,
            "university_name": "Phenikaa, Thăng Long",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "So sánh Luật Hà Nội và Học viện Ngân hàng nếu em muốn học Luật kinh tế",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Luật",
            "location": "Hà Nội",
            "university_name": "Luật Hà Nội, Học viện Ngân hàng",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Bách Khoa, FPT và USTH trường nào mạnh hơn về AI?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Trí tuệ nhân tạo",
            "location": null,
            "university_name": "Bách Khoa, FPT, USTH",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học CNTT ra trường làm những công việc gì?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Marketing sau này có thể làm vị trí nào?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Marketing",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học Tài chính ngân hàng có dễ xin việc không ạ?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Tài chính ngân hàng",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Logistics ra trường làm ở đâu?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Logistics",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Y đa khoa học xong cơ hội nghề nghiệp thế nào?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Y đa khoa",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học Luật ra trường có thể làm trong doanh nghiệp không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Luật",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Có những trường đại học nào ở Hà Nội?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Cho mình danh sách trường ở Hà Nội có đào tạo khối kinh tế",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "kinh tế",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "truong dai hoc tai ha noi gom nhung truong nao",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ở khu vực Hà Nội thì còn trường nào nữa?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "User vừa xem một danh sách trường ở Hà Nội và muốn mở rộng thêm"
    },
    {
        "q": "Các trường đại học ở Hà Nội có ngành kỹ thuật là trường nào?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "kỹ thuật",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Liệt kê trường đại học tại Hà Nội cho em với ạ",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ở TP.HCM có trường nào học CNTT tốt?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Có học bổng toàn phần ở FPT không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "FPT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường nào ở Đà Nẵng phù hợp 24 điểm A00?",
        "a": {
            "score": 24,
            "subject_group": "A00",
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Cho em đề luyện thi toán để vào Bách Khoa",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Bách Khoa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Đại học Thủ đô Hà Nội có những ngành sư phạm nào?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Sư phạm",
            "location": "Hà Nội",
            "university_name": "Đại học Thủ đô Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ở ĐH Thủ đô có chương trình sư phạm tiếng Anh không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Sư phạm tiếng Anh",
            "location": null,
            "university_name": "ĐH Thủ đô",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường Đại học Thủ đô Hà Nội đào tạo những chương trình nào thuộc khối sư phạm?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Sư phạm",
            "location": "Hà Nội",
            "university_name": "Đại học Thủ đô Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em được 24 điểm thì có đủ vào Đại học Thủ đô Hà Nội không?",
        "a": {
            "score": 24,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": "Đại học Thủ đô Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 24 điểm có đủ không?",
        "a": {
            "score": 24,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": "Đại học Thủ đô Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng đang hỏi về Đại học Thủ đô Hà Nội."
    },
    {
        "q": "Thế còn ngành sư phạm toán thì sao?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Sư phạm Toán",
            "location": "Hà Nội",
            "university_name": "Đại học Thủ đô Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng đã chọn Đại học Thủ đô Hà Nội và đang hỏi các ngành sư phạm."
    },
    {
        "q": "Điểm chuẩn 2025 là bao nhiêu?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Sư phạm Toán",
            "location": "Hà Nội",
            "university_name": "Đại học Thủ đô Hà Nội",
            "year": 2025,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi ngành Sư phạm Toán tại Đại học Thủ đô Hà Nội."
    },
    {
        "q": "Điểm chuẩn ngành Sư phạm Toán của Đại học Thủ đô Hà Nội năm 2025 theo thi THPT là bao nhiêu?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Sư phạm Toán",
            "location": "Hà Nội",
            "university_name": "Đại học Thủ đô Hà Nội",
            "year": 2025,
            "method_code": "THPT"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành đó năm 2024 lấy bao nhiêu điểm theo học bạ?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Sư phạm Toán",
            "location": "Hà Nội",
            "university_name": "Đại học Thủ đô Hà Nội",
            "year": 2024,
            "method_code": "HOC_BA"
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng đang hỏi ngành Sư phạm Toán tại Đại học Thủ đô Hà Nội."
    },
    {
        "q": "Nhóm ngành Giáo dục - Sư phạm ở Hà Nội gồm những ngành nào?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Giáo dục - Sư phạm",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ở Hà Nội có trường nào đào tạo ngành Sư phạm Toán không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Sư phạm Toán",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường nào ở Hà Nội phù hợp để học khối ngành giáo dục?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Giáo dục",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ở Hà Nội có những trường đại học nào?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Cho em thông tin về Đại học Thủ đô Hà Nội",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": "Đại học Thủ đô Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Đại học Thủ đô với Bách khoa ngành CNTT khối A00 nên chọn trường nào?",
        "a": {
            "score": null,
            "subject_group": "A00",
            "major": "CNTT",
            "location": null,
            "university_name": "Đại học Thủ đô; Bách khoa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "HUST hay PTIT phù hợp hơn nếu em muốn học công nghệ thông tin?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Công nghệ thông tin",
            "location": null,
            "university_name": "HUST; PTIT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí Đại học Thủ đô Hà Nội khoảng bao nhiêu một năm?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": "Đại học Thủ đô Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Sư phạm Toán ra trường làm gì, lương có ổn không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Sư phạm Toán",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Đại học ở TP.HCM có ngành logistics nào tốt?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Logistics",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Con tôi được 22.5 điểm khối D01, nên chọn ngành nào ở Hà Nội?",
        "a": {
            "score": 22.5,
            "subject_group": "D01",
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em được 26 điểm A00 muốn học CNTT ở Hà Nội thì nên xét trường nào?",
        "a": {
            "score": 26,
            "subject_group": "A00",
            "major": "CNTT",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "24 điểm khối tự nhiên có cơ hội vào ngành công nghệ thông tin không?",
        "a": {
            "score": 24,
            "subject_group": "khối tự nhiên",
            "major": "Công nghệ thông tin",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn CNTT của Bách khoa năm 2025 theo A00 là bao nhiêu?",
        "a": {
            "score": null,
            "subject_group": "A00",
            "major": "CNTT",
            "location": null,
            "university_name": "Bách khoa",
            "year": 2025,
            "method_code": "THPT"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "NEU có ngành marketing không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Marketing",
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường Kinh tế Quốc dân đào tạo những ngành nào?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Kinh tế Quốc dân",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành tài chính ngân hàng học những gì và trường nào ở Hà Nội có đào tạo?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Tài chính ngân hàng",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí ngành CNTT của PTIT khoảng bao nhiêu?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "PTIT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Còn học phí ngành đó thì sao?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "PTIT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi ngành CNTT tại PTIT."
    },
    {
        "q": "Năm 2023 trường đó lấy bao nhiêu điểm?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "PTIT",
            "year": 2023,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng đang hỏi ngành CNTT tại PTIT."
    },
    {
        "q": "Nếu xét học bạ thì ngành này cần điều kiện gì?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "PTIT",
            "year": null,
            "method_code": "HOC_BA"
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi ngành CNTT tại PTIT, câu này tiếp tục hỏi phương thức xét học bạ."
    },
    {
        "q": "Vậy khối A01 có xét được không?",
        "a": {
            "score": null,
            "subject_group": "A01",
            "major": "CNTT",
            "location": null,
            "university_name": "PTIT",
            "year": null,
            "method_code": "THPT"
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi ngành CNTT tại PTIT, câu này hỏi thêm tổ hợp xét tuyển."
    },
    {
        "q": "Ngành công nghệ thông tin sau này làm nghề gì?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Công nghệ thông tin",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Bách khoa và Đại học Công nghệ khác nhau thế nào nếu học kỹ thuật máy tính?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Kỹ thuật máy tính",
            "location": null,
            "university_name": "Bách khoa; Đại học Công nghệ",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường nào ở Hà Nội có ngành truyền thông đa phương tiện?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Truyền thông đa phương tiện",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 18 điểm khối C00 có trường công lập nào ở Hà Nội không?",
        "a": {
            "score": 18,
            "subject_group": "C00",
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm đánh giá năng lực của ngành quản trị kinh doanh ở NEU năm 2025 là bao nhiêu?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Quản trị kinh doanh",
            "location": null,
            "university_name": "NEU",
            "year": 2025,
            "method_code": "DGNL"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường đó có ký túc xá không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": "Đại học Thủ đô Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng đang hỏi thông tin chung về Đại học Thủ đô Hà Nội."
    },
    {
        "q": "Tôi muốn tìm trường đại học gần nhà ở Hà Nội nhưng chưa biết học ngành gì",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Cho em xem thông tin trường NEU",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Còn ngành Marketing thì sao?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Marketing",
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi thông tin tổng quan về NEU."
    },
    {
        "q": "Học phí ngành đó khoảng bao nhiêu?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Marketing",
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi ngành Marketing tại NEU."
    },
    {
        "q": "Điểm chuẩn 2025 theo THPT là bao nhiêu?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Marketing",
            "location": null,
            "university_name": "NEU",
            "year": 2025,
            "method_code": "THPT"
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi học phí ngành Marketing tại NEU."
    },
    {
        "q": "Cho mình biết về trường Bách Khoa Hà Nội",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": "Bách Khoa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường này có những ngành gì?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Bách Khoa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi thông tin về Bách Khoa Hà Nội."
    },
    {
        "q": "Điểm chuẩn CNTT năm 2024 là bao nhiêu?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "Bách Khoa",
            "year": 2024,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng xem danh sách ngành của Bách Khoa và quan tâm CNTT."
    },
    {
        "q": "Em 25 điểm có đủ vào ngành đó không?",
        "a": {
            "score": 25,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "Bách Khoa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điểm chuẩn CNTT Bách Khoa năm 2024."
    },
    {
        "q": "Học phí trường đó một năm khoảng bao nhiêu?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Bách Khoa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi khả năng vào CNTT Bách Khoa với 25 điểm."
    },
    {
        "q": "Cho em thông tin về USTH (Đại học Khoa học và Công nghệ Hà Nội)",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": "USTH",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "có những ngành gì trong trường",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "USTH",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi thông tin về USTH."
    },
    {
        "q": "cho tôi học phí của trường đại học Khoa học và công nghệ Hà Nội (USTH)",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": "USTH",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Thế còn học phí ngành CNTT thì sao?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "USTH",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi học phí chung của USTH."
    },
    {
        "q": "Con tôi được 23 điểm A00 muốn học CNTT, có nên chọn HUST không?",
        "a": {
            "score": 23,
            "subject_group": "A00",
            "major": "CNTT",
            "location": null,
            "university_name": "HUST",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Nếu không đủ HUST thì còn trường nào ở Hà Nội?",
        "a": {
            "score": 23,
            "subject_group": "A00",
            "major": "CNTT",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước phụ huynh hỏi con 23 điểm A00 CNTT có vào HUST không."
    },
    {
        "q": "So sánh PTIT và Học viện Bưu chính ngành An toàn thông tin",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "An toàn thông tin",
            "location": null,
            "university_name": "PTIT; Học viện Bưu chính",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường nào dễ đỗ hơn?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "An toàn thông tin",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng so sánh PTIT và Học viện Bưu chính ngành An toàn thông tin."
    },
    {
        "q": "Hai trường đó học phí chênh lệch nhiều không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "An toàn thông tin",
            "location": null,
            "university_name": "PTIT; Học viện Bưu chính",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng so sánh PTIT và Học viện Bưu chính."
    },
    {
        "q": "diem chuan FTU nganh Ngoai thuong 2024 la bao nhieu",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Ngoại thương",
            "location": null,
            "university_name": "FTU",
            "year": 2024,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Còn năm 2025 thì sao?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Ngoại thương",
            "location": null,
            "university_name": "FTU",
            "year": 2025,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điểm chuẩn FTU ngành Ngoại thương năm 2024."
    },
    {
        "q": "Theo phương thức học bạ thì lấy bao nhiêu điểm?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Ngoại thương",
            "location": null,
            "university_name": "FTU",
            "year": null,
            "method_code": "HOC_BA"
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điểm chuẩn FTU ngành Ngoại thương."
    },
    {
        "q": "Em được 20 điểm D01 muốn học Luật ở Hà Nội thì nên chọn trường nào?",
        "a": {
            "score": 20,
            "subject_group": "D01",
            "major": "Luật",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Có trường nào dễ hơn Luật Hà Nội không?",
        "a": {
            "score": 20,
            "subject_group": "D01",
            "major": "Luật",
            "location": "Hà Nội",
            "university_name": "Luật Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng 20 điểm D01 muốn học Luật ở Hà Nội."
    },
    {
        "q": "Ngành Luật ở Hà Nội có những trường nào đào tạo?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Luật",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Còn trường nào nữa?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Luật",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng xem danh sách trường đào tạo Luật ở Hà Nội."
    },
    {
        "q": "Phenikaa có đào tạo ngành Trí tuệ nhân tạo không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Trí tuệ nhân tạo",
            "location": null,
            "university_name": "Phenikaa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành AI ra trường làm gì?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Trí tuệ nhân tạo",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi Phenikaa có đào tạo ngành Trí tuệ nhân tạo không."
    },
    {
        "q": "Lương khởi điểm ngành đó khoảng bao nhiêu?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Trí tuệ nhân tạo",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi việc làm sau khi học AI tại Phenikaa."
    },
    {
        "q": "HAUI có những ngành kỹ thuật nào?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "kỹ thuật",
            "location": null,
            "university_name": "HAUI",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn ngành Cơ khí năm 2025 là bao nhiêu?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Cơ khí",
            "location": null,
            "university_name": "HAUI",
            "year": 2025,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi các ngành kỹ thuật của HAUI và chọn Cơ khí."
    },
    {
        "q": "Em 22 điểm A00 có đủ vào ngành đó không?",
        "a": {
            "score": 22,
            "subject_group": "A00",
            "major": "Cơ khí",
            "location": null,
            "university_name": "HAUI",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điểm chuẩn Cơ khí HAUI năm 2025."
    },
    {
        "q": "Thăng Long có ngành Du lịch không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Du lịch",
            "location": null,
            "university_name": "Thăng Long",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí ngành Du lịch ở trường đó thế nào?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Du lịch",
            "location": null,
            "university_name": "Thăng Long",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi Thăng Long có ngành Du lịch không."
    },
    {
        "q": "FPT Hà Nội đào tạo những ngành công nghệ nào?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "công nghệ",
            "location": "Hà Nội",
            "university_name": "FPT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "So sánh FPT và USTH về học phí ngành CNTT",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": "Hà Nội",
            "university_name": "FPT; USTH",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường nào rẻ hơn?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng so sánh học phí CNTT giữa FPT và USTH."
    },
    {
        "q": "Con em được 19 điểm khối C00, ở Hà Nội có trường nào phù hợp không?",
        "a": {
            "score": 19,
            "subject_group": "C00",
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Nếu muốn học sư phạm thì sao?",
        "a": {
            "score": 19,
            "subject_group": "C00",
            "major": "Sư phạm",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước phụ huynh hỏi con 19 điểm C00 tìm trường ở Hà Nội."
    },
    {
        "q": "Học viện Ngân hàng có ngành Tài chính ngân hàng không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Tài chính ngân hàng",
            "location": null,
            "university_name": "Học viện Ngân hàng",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn ngành đó năm 2024 theo D01 là mấy?",
        "a": {
            "score": null,
            "subject_group": "D01",
            "major": "Tài chính ngân hàng",
            "location": null,
            "university_name": "Học viện Ngân hàng",
            "year": 2024,
            "method_code": "THPT"
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi Học viện Ngân hàng có ngành Tài chính ngân hàng không."
    },
    {
        "q": "Cho em danh sách trường đại học công lập ở Hà Nội",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Còn trường tư thục nào nữa không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng xem danh sách trường công lập ở Hà Nội."
    },
    {
        "q": "Trường đó ở quận nào?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi thông tin về một trường cụ thể ở Hà Nội."
    },
    {
        "q": "Trường nào ở Cần Thơ học CNTT tốt?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Có học bổng 100% tại NEU không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Cho em lịch thi THPT Quốc gia 2026",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": 2026,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 27 điểm B00 muốn vào Y Hà Nội ngành Y đa khoa có được không?",
        "a": {
            "score": 27,
            "subject_group": "B00",
            "major": "Y đa khoa",
            "location": null,
            "university_name": "Y Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Thế còn ngành Dược thì sao?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Dược",
            "location": null,
            "university_name": "Y Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi khả năng vào Y đa khoa Y Hà Nội với 27 điểm B00."
    },
    {
        "q": "Em 21.5 điểm A00 thích lập trình, gợi ý trường ở Hà Nội",
        "a": {
            "score": 21.5,
            "subject_group": "A00",
            "major": "CNTT",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Mình 23 điểm khối D07 muốn học Quản trị khách sạn ở Hà Nội",
        "a": {
            "score": 23,
            "subject_group": "D07",
            "major": "Quản trị khách sạn",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Con em 20 điểm khối A01 có vào được ngành Kế toán ở Hà Nội không?",
        "a": {
            "score": 20,
            "subject_group": "A01",
            "major": "Kế toán",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 25 điểm muốn học ngành Dược ở Hà Nội thì nên chọn trường nào?",
        "a": {
            "score": 25,
            "subject_group": null,
            "major": "Dược",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "22 điểm khối xã hội muốn học Truyền thông ở Hà Nội",
        "a": {
            "score": 22,
            "subject_group": "khối xã hội",
            "major": "Truyền thông",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 19 điểm C00 có cơ hội vào ngành Du lịch không?",
        "a": {
            "score": 19,
            "subject_group": "C00",
            "major": "Du lịch",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Mình được 24 điểm A00, ngân sách học phí tối đa 25 triệu/năm thì chọn trường nào?",
        "a": {
            "score": 24,
            "subject_group": "A00",
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 26.5 điểm A01 muốn vào Ngoại thương ngành Kinh tế đối ngoại có được không?",
        "a": {
            "score": 26.5,
            "subject_group": "A01",
            "major": "Kinh tế đối ngoại",
            "location": null,
            "university_name": "Ngoại thương",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Nếu chỉ xét THPT thì em 22 điểm A00 học CNTT nên đăng ký trường nào ở Hà Nội?",
        "a": {
            "score": 22,
            "subject_group": "A00",
            "major": "CNTT",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": "THPT"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 17.5 điểm có trường nào ở Hà Nội nhận không ạ?",
        "a": {
            "score": 17.5,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Với điểm đó thì nên chọn ngành nào an toàn hơn?",
        "a": {
            "score": 22,
            "subject_group": "A00",
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng nói được 22 điểm A00 và muốn học ở Hà Nội."
    },
    {
        "q": "Thế nếu em hạ nguyện vọng xuống thì còn trường nào?",
        "a": {
            "score": 20,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng 22 điểm A00 tìm trường CNTT Hà Nội."
    },
    {
        "q": "Điểm chuẩn ngành Quản trị kinh doanh NEU năm 2024 theo THPT",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Quản trị kinh doanh",
            "location": null,
            "university_name": "NEU",
            "year": 2024,
            "method_code": "THPT"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "HUST ngành Kỹ thuật điện năm 2025 lấy bao nhiêu điểm khối A00?",
        "a": {
            "score": null,
            "subject_group": "A00",
            "major": "Kỹ thuật điện",
            "location": null,
            "university_name": "HUST",
            "year": 2025,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "diem chuan PTIT nganh CNTT 2023",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "PTIT",
            "year": 2023,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn đánh giá năng lực USTH ngành CNTT 2025",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "USTH",
            "year": 2025,
            "method_code": "DGNL"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Luật Hà Nội ngành Luật kinh tế năm 2024 lấy bao nhiêu điểm D01?",
        "a": {
            "score": null,
            "subject_group": "D01",
            "major": "Luật kinh tế",
            "location": null,
            "university_name": "Luật Hà Nội",
            "year": 2024,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Phenikaa ngành AI năm 2025 điểm chuẩn bao nhiêu?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Trí tuệ nhân tạo",
            "location": null,
            "university_name": "Phenikaa",
            "year": 2025,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Thế còn năm 2023?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "PTIT",
            "year": 2023,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điểm chuẩn PTIT ngành CNTT năm 2025."
    },
    {
        "q": "Theo học bạ thì bao nhiêu điểm?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Quản trị kinh doanh",
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": "HOC_BA"
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điểm chuẩn NEU ngành QTKD năm 2024 THPT."
    },
    {
        "q": "Khối A01 có xét không?",
        "a": {
            "score": null,
            "subject_group": "A01",
            "major": "CNTT",
            "location": null,
            "university_name": "HUST",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điểm chuẩn HUST ngành CNTT."
    },
    {
        "q": "Cho em xem thông tin Học viện Tài chính",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Học viện Tài chính",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường Công nghiệp Hà Nội có ngành Cơ khí chế tạo máy không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Cơ khí chế tạo máy",
            "location": "Hà Nội",
            "university_name": "Công nghiệp Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Mỹ thuật Việt Nam đào tạo những ngành gì?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Mỹ thuật Việt Nam",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "truong do co nganh ke toan khong",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Kế toán",
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi thông tin NEU."
    },
    {
        "q": "Còn chương trình tiếng Anh thì sao?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Ngôn ngữ Anh",
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng xem danh sách ngành NEU."
    },
    {
        "q": "Ngành Kiến trúc ở Hà Nội trường nào đào tạo?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Kiến trúc",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Quản lý đất đai học những gì?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Quản lý đất đai",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Hà Nội có trường nào dạy ngành Báo chí?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Báo chí",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành này còn trường nào nữa?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Báo chí",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi trường đào tạo Báo chí ở Hà Nội."
    },
    {
        "q": "Học phí Đại học Thương mại khoảng bao nhiêu?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Thương mại",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "hoc phi nganh marketing o NEU 1 nam",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Marketing",
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "FPT tính học phí theo tín chỉ hay theo năm?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "FPT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí trường đó có cao không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Thương mại",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi thông tin Đại học Thương mại."
    },
    {
        "q": "So sánh NEU và FTU ngành Kinh tế quốc tế",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Kinh tế quốc tế",
            "location": null,
            "university_name": "NEU; FTU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Bách khoa hay Công nghệ tốt hơn cho ngành CNTT?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "Bách khoa; Công nghệ",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường nào uy tín hơn?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "NEU; FTU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng so sánh NEU và FTU."
    },
    {
        "q": "Ngành Dược ra trường làm việc ở đâu?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Dược",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học Kế toán có dễ xin việc không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Kế toán",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Lương ngành đó khoảng bao nhiêu?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Marketing",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi việc làm ngành Marketing."
    },
    {
        "q": "Liệt kê các trường tư thục ở Hà Nội",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Hà Nội có bao nhiêu trường đại học công lập?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Còn trường nào ở khu Cầu Giấy không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng xem danh sách trường Hà Nội."
    },
    {
        "q": "Em 24 điểm A00 muốn học Hệ thống thông tin quản lý ở Hà Nội",
        "a": {
            "score": 24,
            "subject_group": "A00",
            "major": "Hệ thống thông tin quản lý",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn ngành Ngôn ngữ Trung Quốc Hà Nội năm 2025",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Ngôn ngữ Trung Quốc",
            "location": "Hà Nội",
            "university_name": null,
            "year": 2025,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học viện Ngoại ngữ có ngành Ngôn ngữ Nhật không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Ngôn ngữ Nhật",
            "location": null,
            "university_name": "Học viện Ngoại ngữ",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Công nghệ thực phẩm trường nào có ở Hà Nội?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Công nghệ thực phẩm",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí Y dược Hà Nội ngành Y đa khoa",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Y đa khoa",
            "location": "Hà Nội",
            "university_name": "Y dược",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "So sánh Thăng Long và Phenikaa ngành QTKD",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Quản trị kinh doanh",
            "location": null,
            "university_name": "Thăng Long; Phenikaa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Luật ra trường làm việc gì?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Luật",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Các trường đại học ở Hà Nội thuộc Bộ GD&ĐT",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 28 điểm A00 có nên đặt Bách Khoa nguyện vọng 1 không?",
        "a": {
            "score": 28,
            "subject_group": "A00",
            "major": null,
            "location": null,
            "university_name": "Bách Khoa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn HAUI ngành Điện tử viễn thông 2024",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Điện tử viễn thông",
            "location": null,
            "university_name": "HAUI",
            "year": 2024,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "ĐH Công nghệ (UET) có những ngành CNTT nào?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "UET",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành An toàn thông tin khác gì CNTT?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "An toàn thông tin",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí ngành Logistics tại FTU",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Logistics",
            "location": null,
            "university_name": "FTU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "NEU với HV Ngân hàng nên chọn trường nào học Tài chính?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Tài chính ngân hàng",
            "location": null,
            "university_name": "NEU; Học viện Ngân hàng",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Y tá ra trường làm gì?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Y tá",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường nào ở Hà Nội gần sân bay Nội Bài?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Con tôi 24.5 điểm D01 thích Luật, gợi ý trường Hà Nội",
        "a": {
            "score": 24.5,
            "subject_group": "D01",
            "major": "Luật",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn B00 ngành Y đa khoa Y Hà Nội 2025",
        "a": {
            "score": null,
            "subject_group": "B00",
            "major": "Y đa khoa",
            "location": null,
            "university_name": "Y Hà Nội",
            "year": 2025,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường đó có đào tạo ngành Dược không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Dược",
            "location": null,
            "university_name": "Y Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi Y Hà Nội ngành Y đa khoa."
    },
    {
        "q": "Em 22 điểm có đủ không?",
        "a": {
            "score": 22,
            "subject_group": null,
            "major": "Y đa khoa",
            "location": null,
            "university_name": "Y Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điểm chuẩn Y đa khoa Y Hà Nội 2025."
    },
    {
        "q": "Ngành Quản trị nhà hàng trường nào có?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Quản trị nhà hàng",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí Bách Khoa ngành Cơ khí",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Cơ khí",
            "location": null,
            "university_name": "Bách Khoa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "HUST và HAUI ngành Điện tử khác nhau thế nào?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Điện tử",
            "location": null,
            "university_name": "HUST; HAUI",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Kiến trúc cơ hội việc làm ra sao?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Kiến trúc",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Danh sách trường đại học ở Hà Nội theo quận",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 20 điểm A00 muốn học ngành Môi trường ở Hà Nội",
        "a": {
            "score": 20,
            "subject_group": "A00",
            "major": "Môi trường",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn ngành Môi trường ĐH Thủy lợi 2024",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Môi trường",
            "location": null,
            "university_name": "Thủy lợi",
            "year": 2024,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "ĐH Thăng Long có ngành CNTT không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "Thăng Long",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Khoa học dữ liệu học ở đâu ở Hà Nội?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Khoa học dữ liệu",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí Phenikaa một năm bao nhiêu?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Phenikaa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "FPT và Bách Khoa ngành CNTT trường nào phù hợp hơn?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "FPT; Bách Khoa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Ngôn ngữ Anh làm nghề gì?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Ngôn ngữ Anh",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ở Hà Nội trường tư nào học phí thấp?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 23 điểm A01 muốn học Kinh tế ở Hà Nội",
        "a": {
            "score": 23,
            "subject_group": "A01",
            "major": "Kinh tế",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Còn phương thức xét tuyển khác thì sao?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Kinh tế",
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": "DGNL"
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng 23 điểm A01 tìm ngành Kinh tế ở Hà Nội và xem điểm chuẩn NEU."
    },
    {
        "q": "NEU xét tuyển những phương thức nào?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Bách Khoa có xét tuyển bằng học bạ không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Bách Khoa",
            "year": null,
            "method_code": "HOC_BA"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "HUST tuyển sinh theo DGNL như thế nào?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "HUST",
            "year": null,
            "method_code": "DGNL"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "PTIT có phương thức xét tuyển thẳng không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "PTIT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "FTU xét THPT quốc gia cần điều kiện gì?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "FTU",
            "year": null,
            "method_code": "THPT"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "USTH tuyển sinh bằng phương thức nào?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "USTH",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Phenikaa có xét đánh giá năng lực không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Phenikaa",
            "year": null,
            "method_code": "DGNL"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường FPT tuyển sinh theo những hình thức nào?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "FPT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học viện Bưu chính xét học bạ thế nào?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Học viện Bưu chính",
            "year": null,
            "method_code": "HOC_BA"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Luật Hà Nội có xét tuyển kết hợp không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Luật Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Thăng Long tuyển sinh theo THPT hay học bạ?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Thăng Long",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "HAUI có phương thức xét tuyển nào cho ngành Cơ khí?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Cơ khí",
            "location": null,
            "university_name": "HAUI",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Y Hà Nội xét tuyển ngành Y đa khoa bằng phương thức gì?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Y đa khoa",
            "location": null,
            "university_name": "Y Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "ĐH Thủy lợi có xét DGNL không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Thủy lợi",
            "year": null,
            "method_code": "DGNL"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học viện Ngân hàng tuyển sinh theo những PT nào?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Học viện Ngân hàng",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "truong nao o ha noi xet tuyen bang hoc ba",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": "HOC_BA"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Phương thức DGNL là gì ạ?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": "DGNL"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Xét tuyển học bạ khác gì thi THPT quốc gia?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": "HOC_BA"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em muốn nộp hồ sơ theo phương thức đánh giá năng lực thì làm sao?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": "DGNL"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường nào ở Hà Nội xét tuyển bằng học bạ ngành CNTT?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": "HOC_BA"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "NEU ngành Marketing xét theo THPT hay học bạ?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Marketing",
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Bách Khoa ngành CNTT có xét tuyển thẳng không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "Bách Khoa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "PTIT xét tuyển ngành CNTT theo những phương thức nào?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "PTIT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Con tôi muốn nộp hồ sơ học bạ vào NEU thì cần gì?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": "HOC_BA"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "ĐH Công nghệ UET tuyển sinh CNTT bằng PT gì?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "UET",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Còn phương thức học bạ thì sao?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": "HOC_BA"
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi PT xét tuyển THPT của NEU."
    },
    {
        "q": "Trường đó có xét DGNL không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": "DGNL"
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi phương thức tuyển sinh NEU."
    },
    {
        "q": "Ngành đó xét theo khối nào?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "PTIT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi PTIT xét tuyển ngành CNTT."
    },
    {
        "q": "Học bạ cần điểm trung bình bao nhiêu?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "FTU",
            "year": null,
            "method_code": "HOC_BA"
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi FTU xét học bạ."
    },
    {
        "q": "DGNL thì thi môn gì?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": "DGNL"
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi phương thức đánh giá năng lực."
    },
    {
        "q": "PT này áp dụng cho ngành Marketing không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Marketing",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": "THPT"
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi NEU xét THPT."
    },
    {
        "q": "Em nộp hồ sơ online được không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "FPT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi phương thức tuyển sinh FPT."
    },
    {
        "q": "Còn phương thức nào khác nữa?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "USTH",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi USTH tuyển sinh thế nào."
    },
    {
        "q": "Xét học bạ có cần chứng chỉ tiếng Anh không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": "HOC_BA"
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điều kiện xét học bạ."
    },
    {
        "q": "Phương thức đó áp dụng năm 2025 chứ?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": 2025,
            "method_code": "THPT"
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi PT THPT tại một trường Hà Nội."
    },
    {
        "q": "Trường ấy có xét kết hợp điểm thi và học bạ không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Phenikaa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi Phenikaa tuyển sinh."
    },
    {
        "q": "NEU có xét tuyển thẳng olympic không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi phương thức NEU."
    },
    {
        "q": "HUST xét tuyển bằng chứng chỉ quốc tế không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "HUST",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi PT tuyển sinh HUST."
    },
    {
        "q": "Em muốn đăng ký PT đó thì nộp hồ sơ ở đâu?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "USTH",
            "year": null,
            "method_code": "DGNL"
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi USTH xét DGNL."
    },
    {
        "q": "NEU có học bổng cho tân sinh viên không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Bách Khoa có học bổng khuyến khích học tập không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Bách Khoa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "FPT University có học bổng 100% học phí không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "FPT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "USTH có chương trình học bổng quốc tế không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "USTH",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Phenikaa miễn giảm học phí thế nào?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Phenikaa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học bổng ngành CNTT ở Hà Nội trường nào có?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "FTU có học bổng cho sinh viên giỏi không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "FTU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 27 điểm có được học bổng không?",
        "a": {
            "score": 27,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học bổng tại PTIT cần điều kiện gì?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "PTIT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Co hoc bong tai NEU khong",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường tư ở Hà Nội học bổng nhiều không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Con tôi giỏi Toán có học bổng ở Bách Khoa không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Bách Khoa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Thăng Long có hỗ trợ tài chính cho sinh viên không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Thăng Long",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học viện Ngân hàng có học bổng ngành Tài chính không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Tài chính ngân hàng",
            "location": null,
            "university_name": "Học viện Ngân hàng",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học bổng dành cho sinh viên vùng khó khăn ở Hà Nội",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Y Hà Nội có học bổng ngành Y không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Y đa khoa",
            "location": null,
            "university_name": "Y Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học bổng đó cần GPA bao nhiêu?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi học bổng NEU."
    },
    {
        "q": "Còn học bổng ngành khác không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi học bổng NEU ngành Marketing."
    },
    {
        "q": "Em có đủ điều kiện xin không?",
        "a": {
            "score": 27,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "FPT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi học bổng FPT."
    },
    {
        "q": "Nộp hồ sơ học bổng khi nào?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "USTH",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi học bổng USTH."
    },
    {
        "q": "Trường đó có miễn 50% học phí không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Phenikaa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi miễn giảm Phenikaa."
    },
    {
        "q": "Học bổng có áp dụng ngành CNTT không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "Bách Khoa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi học bổng Bách Khoa."
    },
    {
        "q": "Thế còn học bổng doanh nghiệp tài trợ?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "PTIT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi học bổng PTIT."
    },
    {
        "q": "Học bổng full có cần cam kết không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "FPT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi học bổng 100% FPT."
    },
    {
        "q": "Con em học giỏi môn Anh có được ưu tiên học bổng không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "FTU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước phụ huynh hỏi học bổng FTU."
    },
    {
        "q": "Học bổng này dành cho khối A00 phải không?",
        "a": {
            "score": null,
            "subject_group": "A00",
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi học bổng tân sinh viên."
    },
    {
        "q": "Em cần chuẩn bị giấy tờ gì để xin?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điều kiện học bổng NEU."
    },
    {
        "q": "Còn hỗ trợ vay vốn sinh viên không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Học viện Ngân hàng",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi hỗ trợ tài chính HV Ngân hàng."
    },
    {
        "q": "NEU có ký túc xá không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Bách Khoa ký túc xá ở đâu?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Bách Khoa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "FPT Hà Nội có KTX cho sinh viên năm nhất không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": "FPT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "USTH cơ sở vật chất thế nào?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "USTH",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "PTIT có ký túc xá nội trú không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "PTIT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường Phenikaa có phòng lab CNTT không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "Phenikaa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "HAUI có ký túc xá cho nữ sinh không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "HAUI",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Thăng Long campus rộng không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Thăng Long",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường đại học ở Hà Nội nào có KTX tốt?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học viện Bưu chính có thư viện lớn không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Học viện Bưu chính",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Y Hà Nội bệnh viện thực hành ở đâu?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Y Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "truong co ky tuc xa khong",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "FTU cơ sở chính ở đâu?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "FTU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em muốn ở nội trú thì trường nào ở Hà Nội có KTX?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Luật Hà Nội có sân thể thao không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Luật Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "ĐH Thủ đô có ký túc xá giá rẻ không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Đại học Thủ đô Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Phòng học UET có máy chiếu và wifi không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "UET",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường công lập Hà Nội nào có cơ sở vật chất hiện đại?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "KTX trường đó giá bao nhiêu một tháng?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi NEU có ký túc xá không."
    },
    {
        "q": "Còn KTX khu vực nào khác không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Bách Khoa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi KTX Bách Khoa."
    },
    {
        "q": "Trường này có căng tin và siêu thị không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "FPT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi cơ sở FPT Hà Nội."
    },
    {
        "q": "Phòng lab AI có đủ máy không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Trí tuệ nhân tạo",
            "location": null,
            "university_name": "Phenikaa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi lab CNTT Phenikaa."
    },
    {
        "q": "Em ở xa có được ưu tiên KTX không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "PTIT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi KTX PTIT."
    },
    {
        "q": "Thư viện mở cửa mấy giờ?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Học viện Bưu chính",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi thư viện HV Bưu chính."
    },
    {
        "q": "Trường đó có xe buýt đưa đón không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "USTH",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi cơ sở USTH."
    },
    {
        "q": "KTX có điều hòa và nóng lạnh không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "HAUI",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi KTX HAUI."
    },
    {
        "q": "Campus có khu ký túc riêng cho SV năm nhất không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Thăng Long",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi campus Thăng Long."
    },
    {
        "q": "Bệnh viện thực hành có đủ chỗ cho sinh viên không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Y Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi bệnh viện Y Hà Nội."
    },
    {
        "q": "Trường ấy có hồ bơi không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Luật Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi cơ s sở Luật Hà Nội."
    },
    {
        "q": "Em muốn thuê phòng ngoài thì trường có hỗ trợ tìm nhà không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi KTX NEU."
    },
    {
        "q": "Sài Gòn có trường CNTT nào ngon không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 25 điểm A00 muốn học ở TP.HCM thì chọn trường nào?",
        "a": {
            "score": 25,
            "subject_group": "A00",
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "App chỉ tra cứu được Hà Nội thôi à?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "So sánh Bách Khoa, NEU và FTU về điểm chuẩn CNTT năm 2024",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "Bách Khoa, NEU, FTU",
            "year": 2024,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "BKHN với PTIT với UET ngành an toàn thông tin cái nào cao hơn?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "An toàn thông tin",
            "location": null,
            "university_name": "BKHN, PTIT, UET",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí và điểm chuẩn Bách Khoa với Phenikaa khác nhau thế nào?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Bách Khoa, Phenikaa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Hệ thống có hỗ trợ ngoài Hà Nội không?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "So sánh NEU, FTU và Thương mại về học phí ngành Logistics",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Logistics",
            "location": null,
            "university_name": "NEU, FTU, Thương mại",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ở Hồ Chí Minh có đại học công lập nào mạnh CNTT?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Bách Khoa hay NEU hay FTU học phí thấp hơn?",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Bách Khoa, NEU, FTU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "điểm chuẩn ngành hàng không của USTH thì sao",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Hàng không",
            "location": null,
            "university_name": "USTH",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điểm chuẩn HUST ngành Trí tuệ nhân tạo năm 2024."
    },
    {
        "q": "thế còn FTU thì học phí bao nhiêu",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "FTU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi học phí NEU."
    },
    {
        "q": "PTIT có những ngành gì",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "PTIT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi HUST có những ngành gì."
    },
    {
        "q": "thế còn Phenikaa ngành CNTT năm 2024",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "Phenikaa",
            "year": 2024,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điểm chuẩn Bách Khoa ngành CNTT năm 2024."
    },
    {
        "q": "học phí NEU ngành Marketing thì sao",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Marketing",
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi học phí chung của USTH."
    },
    {
        "q": "so sánh USTH với HUST về điểm chuẩn CNTT",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "USTH, HUST",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng so sánh NEU và FTU."
    },
    {
        "q": "HAUI ngành Điện tử năm 2025 lấy bao nhiêu điểm",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Điện tử",
            "location": null,
            "university_name": "HAUI",
            "year": 2025,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điểm chuẩn HUST ngành Điện tử năm 2025."
    },
    {
        "q": "nếu em muốn học AI ở USTH thì sao",
        "a": {
            "score": null,
            "subject_group": null,
            "major": "Trí tuệ nhân tạo",
            "location": null,
            "university_name": "USTH",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "User vừa hỏi gợi ý trường với 24 điểm A00 học CNTT ở Hà Nội."
    },
    {
        "q": "USTH có KTX không",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "USTH",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi NEU có ký túc xá không."
    },
    {
        "q": "HUST xét tuyển bằng học bạ không",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "HUST",
            "year": null,
            "method_code": "học bạ"
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi NEU xét tuyển những phương thức nào."
    },
    {
        "q": "So sánh NEU và FTU ngành Tài chính năm 2024 khối A00 theo THPT",
        "a": {
            "score": null,
            "subject_group": "A00",
            "major": "Tài chính",
            "location": null,
            "university_name": "NEU, FTU",
            "year": 2024,
            "method_code": "THPT"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "So sánh Bách Khoa và PTIT về số ngành và phương thức xét tuyển",
        "a": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Bách Khoa, PTIT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    }
];
exports.COMBINED_EXAMPLES = [
    {
        "q": "Em được 24 điểm khối A00 muốn học CNTT ở Hà Nội thì nên chọn trường nào ạ?",
        "intent": "recommendation_by_score",
        "confidence": 0.95,
        "entities": {
            "score": 24,
            "subject_group": "A00",
            "major": "CNTT",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Mình thi được 22.5 điểm A01, muốn học Marketing ở Hà Nội thì có trường nào hợp không?",
        "intent": "recommendation_by_score",
        "confidence": 0.95,
        "entities": {
            "score": 22.5,
            "subject_group": "A01",
            "major": "Marketing",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 25 điểm D01 muốn học Ngôn ngữ Anh, gợi ý giúp em vài trường ở Hà Nội",
        "intent": "recommendation_by_score",
        "confidence": 0.95,
        "entities": {
            "score": 25,
            "subject_group": "D01",
            "major": "Ngôn ngữ Anh",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Con tôi được 21 điểm khối A, muốn học Kế toán ở Hà Nội thì nên cân nhắc trường nào?",
        "intent": "recommendation_by_score",
        "confidence": 0.9,
        "entities": {
            "score": 21,
            "subject_group": "khối A",
            "major": "Kế toán",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em khoảng 27 điểm B00 thì có cơ hội vào Y Hà Nội ngành Y đa khoa không ạ?",
        "intent": "recommendation_by_score",
        "confidence": 0.9,
        "entities": {
            "score": 27,
            "subject_group": "B00",
            "major": "Y đa khoa",
            "location": null,
            "university_name": "Y Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Với điểm đó thì chọn trường nào an toàn hơn?",
        "intent": "recommendation_by_score",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "User vừa nói được 24 điểm A00 và muốn học CNTT ở Hà Nội"
    },
    {
        "q": "Mình được 23 điểm, tư vấn trường ở Hà Nội giúp mình với",
        "intent": "recommendation_by_score",
        "confidence": 0.9,
        "entities": {
            "score": 23,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 20 điểm khối tự nhiên có nên đăng ký Công nghiệp hay Phenikaa không?",
        "intent": "recommendation_by_score",
        "confidence": 0.84,
        "entities": {
            "score": 20,
            "subject_group": "khối tự nhiên",
            "major": null,
            "location": null,
            "university_name": "Đại học Công nghiệp, Phenikaa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "24 điểm tổ hợp toán lý hóa muốn học Cơ khí thì nên chọn HUST hay HAUI?",
        "intent": "recommendation_by_score",
        "confidence": 0.84,
        "entities": {
            "score": 24,
            "subject_group": "tổ hợp toán lý hóa",
            "major": "Cơ khí",
            "location": null,
            "university_name": "HUST, HAUI",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Thế nếu em muốn học AI thì sao?",
        "intent": "recommendation_by_score",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Trí tuệ nhân tạo",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "User vừa cung cấp điểm thi và hỏi gợi ý trường CNTT ở Hà Nội"
    },
    {
        "q": "Em được 18.5 điểm A00, có trường nào ở Hà Nội đào tạo Điện tử phù hợp không?",
        "intent": "recommendation_by_score",
        "confidence": 0.95,
        "entities": {
            "score": 18.5,
            "subject_group": "A00",
            "major": "Điện tử",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Con tôi 26 điểm D01 muốn học Tài chính ngân hàng, có nên đặt NEU làm nguyện vọng không?",
        "intent": "recommendation_by_score",
        "confidence": 0.9,
        "entities": {
            "score": 26,
            "subject_group": "D01",
            "major": "Tài chính ngân hàng",
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 23.75 điểm A01 muốn học An toàn thông tin ở Hà Nội thì có những lựa chọn nào?",
        "intent": "recommendation_by_score",
        "confidence": 0.95,
        "entities": {
            "score": 23.75,
            "subject_group": "A01",
            "major": "An toàn thông tin",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm này có hơi thấp không ạ?",
        "intent": "recommendation_by_score",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "User vừa hỏi 20 điểm khối A00 có nên học CNTT ở Hà Nội không"
    },
    {
        "q": "Em khoảng 20 điểm khối xã hội thì nên học trường nào ở Hà Nội?",
        "intent": "recommendation_by_score",
        "confidence": 0.9,
        "entities": {
            "score": 20,
            "subject_group": "khối xã hội",
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Mình 22 điểm D01, muốn học Luật ở Hà Nội thì gợi ý giúp mình",
        "intent": "recommendation_by_score",
        "confidence": 0.95,
        "entities": {
            "score": 22,
            "subject_group": "D01",
            "major": "Luật",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em được 24.2 điểm A00, muốn học Logistics ở Hà Nội thì trường nào vừa sức?",
        "intent": "recommendation_by_score",
        "confidence": 0.95,
        "entities": {
            "score": 24.2,
            "subject_group": "A00",
            "major": "Logistics",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Có trường nào dễ đỗ hơn không?",
        "intent": "recommendation_by_score",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "User vừa hỏi khả năng vào Bách Khoa với 22 điểm A00 ngành CNTT"
    },
    {
        "q": "Em 19 điểm học bạ muốn tìm trường ở Hà Nội có ngành Du lịch",
        "intent": "recommendation_by_score",
        "confidence": 0.9,
        "entities": {
            "score": 19,
            "subject_group": null,
            "major": "Du lịch",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": "học bạ"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "21 điểm THPT quốc gia có nên học Quản trị kinh doanh ở Thăng Long không?",
        "intent": "recommendation_by_score",
        "confidence": 0.9,
        "entities": {
            "score": 21,
            "subject_group": null,
            "major": "Quản trị kinh doanh",
            "location": null,
            "university_name": "Thăng Long",
            "year": null,
            "method_code": "THPT"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "26 điểm muốn vào Ngoại thương thì nên chọn ngành nào?",
        "intent": "recommendation_by_score",
        "confidence": 0.9,
        "entities": {
            "score": 26,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Ngoại thương",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em thi A01 được 23 điểm, thích ngành dữ liệu hoặc AI thì Hà Nội có trường nào hợp?",
        "intent": "recommendation_by_score",
        "confidence": 0.9,
        "entities": {
            "score": 23,
            "subject_group": "A01",
            "major": "Trí tuệ nhân tạo",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Nếu ưu tiên học phí thấp thì chọn trường nào?",
        "intent": "recommendation_by_score",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "User vừa nêu điểm và ngành mong muốn, đang cần gợi ý trường phù hợp ở Hà Nội"
    },
    {
        "q": "Còn ngành nào nữa?",
        "intent": "recommendation_by_score",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "User vừa hỏi gợi ý ngành phù hợp với 24 điểm A01 ở Hà Nội"
    },
    {
        "q": "Mình 25 điểm khối A00, phân vân CNTT ở Bách Khoa hay Bưu chính thì nên đặt nguyện vọng sao?",
        "intent": "recommendation_by_score",
        "confidence": 0.84,
        "entities": {
            "score": 25,
            "subject_group": "A00",
            "major": "CNTT",
            "location": null,
            "university_name": "Bách Khoa, Học viện Bưu chính",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn Bách Khoa ngành CNTT năm 2024 là bao nhiêu?",
        "intent": "ask_cutoff_score",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "Bách Khoa",
            "year": 2024,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Cho mình hỏi điểm chuẩn NEU ngành Marketing 2025 theo THPT",
        "intent": "ask_cutoff_score",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Marketing",
            "location": null,
            "university_name": "NEU",
            "year": 2025,
            "method_code": "THPT"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "diem chuan BK 2023 la bao nhieu",
        "intent": "ask_cutoff_score",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "BK",
            "year": 2023,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn ngành Kế toán của Học viện Ngân hàng năm ngoái là bao nhiêu?",
        "intent": "ask_cutoff_score",
        "confidence": 0.84,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Kế toán",
            "location": null,
            "university_name": "Học viện Ngân hàng",
            "year": 2025,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Thế còn năm 2025?",
        "intent": "ask_cutoff_score",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": 2025,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "User vừa hỏi điểm chuẩn Bách Khoa ngành CNTT năm 2024"
    },
    {
        "q": "FTU ngành Logistics điểm chuẩn 2024 bao nhiêu ạ?",
        "intent": "ask_cutoff_score",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Logistics",
            "location": null,
            "university_name": "FTU",
            "year": 2024,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn USTH ngành Công nghệ thông tin 2023 có cao không?",
        "intent": "ask_cutoff_score",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Công nghệ thông tin",
            "location": null,
            "university_name": "USTH",
            "year": 2023,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học viện Bưu chính ngành An toàn thông tin lấy bao nhiêu điểm năm 2025?",
        "intent": "ask_cutoff_score",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "An toàn thông tin",
            "location": null,
            "university_name": "Học viện Bưu chính",
            "year": 2025,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Còn phương thức học bạ thì sao?",
        "intent": "ask_cutoff_score",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": "học bạ"
        },
        "is_follow_up": true,
        "context_note": "User vừa hỏi điểm chuẩn một ngành theo phương thức THPT"
    },
    {
        "q": "Điểm chuẩn ngành Luật của Luật Hà Nội năm 2024 theo D01 là bao nhiêu?",
        "intent": "ask_cutoff_score",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": "D01",
            "major": "Luật",
            "location": null,
            "university_name": "Luật Hà Nội",
            "year": 2024,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường Thương mại ngành Quản trị kinh doanh 2025 lấy điểm chuẩn bao nhiêu?",
        "intent": "ask_cutoff_score",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Quản trị kinh doanh",
            "location": null,
            "university_name": "Thương mại",
            "year": 2025,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn Hà Nội ngành Dược 2024 trường Y dược là bao nhiêu?",
        "intent": "ask_cutoff_score",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Dược",
            "location": "Hà Nội",
            "university_name": "Y dược",
            "year": 2024,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "HAUI ngành Cơ khí điểm chuẩn 2023 theo A00 là mấy điểm?",
        "intent": "ask_cutoff_score",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": "A00",
            "major": "Cơ khí",
            "location": null,
            "university_name": "HAUI",
            "year": 2023,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành đó năm trước lấy bao nhiêu?",
        "intent": "ask_cutoff_score",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": 2025,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "User vừa hỏi thông tin một ngành cụ thể tại một trường ở Hà Nội"
    },
    {
        "q": "Cho em xem điểm chuẩn ngành Tài chính ngân hàng của Kinh tế Quốc dân 2024",
        "intent": "ask_cutoff_score",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Tài chính ngân hàng",
            "location": null,
            "university_name": "Kinh tế Quốc dân",
            "year": 2024,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn Phenikaa ngành Trí tuệ nhân tạo 2025 có không?",
        "intent": "ask_cutoff_score",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Trí tuệ nhân tạo",
            "location": null,
            "university_name": "Phenikaa",
            "year": 2025,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Mỹ thuật năm 2024 lấy bao nhiêu điểm ngành Kiến trúc?",
        "intent": "ask_cutoff_score",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Kiến trúc",
            "location": null,
            "university_name": "Mỹ thuật",
            "year": 2024,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Có điểm 2023 không?",
        "intent": "ask_cutoff_score",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": 2023,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "User vừa hỏi điểm chuẩn cùng trường và cùng ngành năm 2024"
    },
    {
        "q": "Điểm chuẩn ngành Du lịch ở Thăng Long 2025 là bao nhiêu vậy?",
        "intent": "ask_cutoff_score",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Du lịch",
            "location": null,
            "university_name": "Thăng Long",
            "year": 2025,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "HUST ngành Điện tử năm 2025 theo A01 lấy bao nhiêu điểm?",
        "intent": "ask_cutoff_score",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": "A01",
            "major": "Điện tử",
            "location": null,
            "university_name": "HUST",
            "year": 2025,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "USTH có những chương trình đào tạo gì?",
        "intent": "search_university",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "USTH",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Cho mình thông tin về trường Bách Khoa Hà Nội",
        "intent": "search_university",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": "Bách Khoa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "NEU có ngành Marketing không ạ?",
        "intent": "search_university",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Marketing",
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường đó có ngành CNTT không?",
        "intent": "search_university",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "User vừa hỏi thông tin về trường Phenikaa"
    },
    {
        "q": "FPT Hà Nội có những ngành nào liên quan đến công nghệ?",
        "intent": "search_university",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "công nghệ",
            "location": "Hà Nội",
            "university_name": "FPT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học viện Ngân hàng đào tạo những ngành gì?",
        "intent": "search_university",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Học viện Ngân hàng",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "truong thuong mai co nganh ke toan khong",
        "intent": "search_university",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Kế toán",
            "location": null,
            "university_name": "Thương mại",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Đại học Công nghiệp Hà Nội có chương trình An toàn thông tin không?",
        "intent": "search_university",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "An toàn thông tin",
            "location": "Hà Nội",
            "university_name": "Đại học Công nghiệp",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Còn danh sách ngành thì sao?",
        "intent": "search_university",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "User vừa hỏi thông tin tổng quan về trường USTH"
    },
    {
        "q": "Ngoại thương ở Hà Nội có những ngành kinh tế nào?",
        "intent": "search_university",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "kinh tế",
            "location": "Hà Nội",
            "university_name": "Ngoại thương",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Cho em xem thông tin trường Luật Hà Nội",
        "intent": "search_university",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": "Luật Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Phenikaa có đào tạo ngành Trí tuệ nhân tạo không?",
        "intent": "search_university",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Trí tuệ nhân tạo",
            "location": null,
            "university_name": "Phenikaa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Có ngành dược không?",
        "intent": "search_university",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Dược",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "User vừa hỏi danh sách chương trình của một trường y dược ở Hà Nội"
    },
    {
        "q": "Thăng Long có những ngành nào phù hợp khối D01?",
        "intent": "search_university",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": "D01",
            "major": null,
            "location": null,
            "university_name": "Thăng Long",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học viện Bưu chính có ngành Công nghệ thông tin không?",
        "intent": "search_university",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Công nghệ thông tin",
            "location": null,
            "university_name": "Học viện Bưu chính",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành CNTT có những trường nào ở Hà Nội đào tạo?",
        "intent": "search_major",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Marketing học ở trường nào tại Hà Nội thì phù hợp?",
        "intent": "search_major",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Marketing",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Logistics là học gì và Hà Nội có trường nào dạy?",
        "intent": "search_major",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Logistics",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành này trường nào có?",
        "intent": "search_major",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "User vừa nhắc đến ngành An toàn thông tin và hỏi thêm trường đào tạo ở Hà Nội"
    },
    {
        "q": "An toàn thông tin khác gì CNTT vậy ạ?",
        "intent": "search_major",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "An toàn thông tin",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Tài chính ngân hàng ở Hà Nội có các trường nào?",
        "intent": "search_major",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Tài chính ngân hàng",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "nganh ke toan hoc truong nao o ha noi",
        "intent": "search_major",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Kế toán",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em muốn tìm hiểu ngành Y đa khoa, học xong sẽ học những gì?",
        "intent": "search_major",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Y đa khoa",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Còn trường nào ở Hà Nội đào tạo nữa?",
        "intent": "search_major",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "User vừa hỏi về ngành Luật và danh sách trường đào tạo"
    },
    {
        "q": "Ngành Trí tuệ nhân tạo nên học ở đâu tại Hà Nội?",
        "intent": "search_major",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Trí tuệ nhân tạo",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Khối tự nhiên có thể học những ngành kỹ thuật nào ở Hà Nội?",
        "intent": "search_major",
        "confidence": 0.84,
        "entities": {
            "score": null,
            "subject_group": "khối tự nhiên",
            "major": "kỹ thuật",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Luật có những trường đại học nào ở Hà Nội?",
        "intent": "search_major",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Luật",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí FPT Hà Nội khoảng bao nhiêu một năm?",
        "intent": "ask_tuition_fee",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": "FPT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí ngành CNTT ở Bách Khoa năm 2025 là bao nhiêu?",
        "intent": "ask_tuition_fee",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "Bách Khoa",
            "year": 2025,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Thế học phí thì sao?",
        "intent": "ask_tuition_fee",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "User vừa hỏi về trường FPT Hà Nội"
    },
    {
        "q": "hoc phi NEU nganh Marketing 1 nam khoang bao nhieu",
        "intent": "ask_tuition_fee",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Marketing",
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "USTH tính học phí theo năm hay theo tín chỉ?",
        "intent": "ask_tuition_fee",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "USTH",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí ngành Dược ở Y dược Hà Nội có cao không?",
        "intent": "ask_tuition_fee",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Dược",
            "location": "Hà Nội",
            "university_name": "Y dược",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Đại học Công nghiệp học phí theo tín chỉ là bao nhiêu?",
        "intent": "ask_tuition_fee",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Đại học Công nghiệp",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành đó học phí cao không ạ?",
        "intent": "ask_tuition_fee",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "User vừa hỏi thông tin ngành Trí tuệ nhân tạo tại Phenikaa"
    },
    {
        "q": "Cho mình học phí ngành Kế toán của Học viện Ngân hàng",
        "intent": "ask_tuition_fee",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Kế toán",
            "location": null,
            "university_name": "Học viện Ngân hàng",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí Thăng Long ngành Du lịch khoảng bao nhiêu?",
        "intent": "ask_tuition_fee",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Du lịch",
            "location": null,
            "university_name": "Thăng Long",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Có trường nào học phí thấp hơn không?",
        "intent": "ask_tuition_fee",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "User vừa xem học phí của một trường/ngành ở Hà Nội"
    },
    {
        "q": "Học phí ngành Luật Hà Nội năm 2024 là bao nhiêu?",
        "intent": "ask_tuition_fee",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Luật",
            "location": "Hà Nội",
            "university_name": "Luật Hà Nội",
            "year": 2024,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "So sánh giúp em Bách Khoa và Học viện Bưu chính ngành CNTT",
        "intent": "compare_universities",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "Bách Khoa, Học viện Bưu chính",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "NEU với Thương mại trường nào hợp học Marketing hơn?",
        "intent": "compare_universities",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Marketing",
            "location": null,
            "university_name": "NEU, Thương mại",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "So sánh học phí FPT và USTH ở Hà Nội",
        "intent": "compare_universities",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": "FPT, USTH",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Hai trường này khác nhau thế nào?",
        "intent": "compare_universities",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "User vừa hỏi về Bách Khoa và Học viện Bưu chính"
    },
    {
        "q": "FTU và NEU ngành Tài chính ngân hàng nên chọn trường nào?",
        "intent": "compare_universities",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Tài chính ngân hàng",
            "location": null,
            "university_name": "FTU, NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "So sánh điểm chuẩn CNTT 2024 của HUST và HAUI",
        "intent": "compare_universities",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "HUST, HAUI",
            "year": 2024,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Phenikaa với Thăng Long ngành Quản trị kinh doanh trường nào học phí dễ chịu hơn?",
        "intent": "compare_universities",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Quản trị kinh doanh",
            "location": null,
            "university_name": "Phenikaa, Thăng Long",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Cái nào dễ đỗ hơn?",
        "intent": "compare_universities",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "User vừa so sánh hai trường cùng ngành ở Hà Nội"
    },
    {
        "q": "So sánh Luật Hà Nội và Học viện Ngân hàng nếu em muốn học Luật kinh tế",
        "intent": "compare_universities",
        "confidence": 0.84,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Luật",
            "location": "Hà Nội",
            "university_name": "Luật Hà Nội, Học viện Ngân hàng",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Bách Khoa, FPT và USTH trường nào mạnh hơn về AI?",
        "intent": "compare_universities",
        "confidence": 0.84,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Trí tuệ nhân tạo",
            "location": null,
            "university_name": "Bách Khoa, FPT, USTH",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học CNTT ra trường làm những công việc gì?",
        "intent": "ask_career",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Marketing sau này có thể làm vị trí nào?",
        "intent": "ask_career",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Marketing",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ra trường lương khoảng bao nhiêu?",
        "intent": "ask_career",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "User vừa hỏi về ngành An toàn thông tin"
    },
    {
        "q": "Học Tài chính ngân hàng có dễ xin việc không ạ?",
        "intent": "ask_career",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Tài chính ngân hàng",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Logistics ra trường làm ở đâu?",
        "intent": "ask_career",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Logistics",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Y đa khoa học xong cơ hội nghề nghiệp thế nào?",
        "intent": "ask_career",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Y đa khoa",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành đó sau này làm gì?",
        "intent": "ask_career",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "User vừa hỏi mô tả ngành Kế toán"
    },
    {
        "q": "Học Luật ra trường có thể làm trong doanh nghiệp không?",
        "intent": "ask_career",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Luật",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Có những trường đại học nào ở Hà Nội?",
        "intent": "ask_location",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Cho mình danh sách trường ở Hà Nội có đào tạo khối kinh tế",
        "intent": "ask_location",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "kinh tế",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "truong dai hoc tai ha noi gom nhung truong nao",
        "intent": "ask_location",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ở khu vực Hà Nội thì còn trường nào nữa?",
        "intent": "ask_location",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "User vừa xem một danh sách trường ở Hà Nội và muốn mở rộng thêm"
    },
    {
        "q": "Các trường đại học ở Hà Nội có ngành kỹ thuật là trường nào?",
        "intent": "ask_location",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "kỹ thuật",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Liệt kê trường đại học tại Hà Nội cho em với ạ",
        "intent": "ask_location",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Chào bạn",
        "intent": "greeting",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Xin chào, tư vấn giúp mình với",
        "intent": "greeting",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "hello bot ạ",
        "intent": "greeting",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Chào em, tôi muốn hỏi thông tin tuyển sinh cho con",
        "intent": "greeting",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Bot có thể tư vấn những gì?",
        "intent": "help",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Mình dùng app này như thế nào để chọn trường?",
        "intent": "help",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Bạn có thể gợi ý trường theo điểm không?",
        "intent": "help",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Muốn tra điểm chuẩn thì phải hỏi như nào?",
        "intent": "help",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ở TP.HCM có trường nào học CNTT tốt?",
        "intent": "unknown",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Có học bổng toàn phần ở FPT không?",
        "intent": "unknown",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "FPT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường nào ở Đà Nẵng phù hợp 24 điểm A00?",
        "intent": "unknown",
        "confidence": 0.9,
        "entities": {
            "score": 24,
            "subject_group": "A00",
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Cho em đề luyện thi toán để vào Bách Khoa",
        "intent": "unknown",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Bách Khoa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Đại học Thủ đô Hà Nội có những ngành sư phạm nào?",
        "intent": "search_university",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Sư phạm",
            "location": "Hà Nội",
            "university_name": "Đại học Thủ đô Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ở ĐH Thủ đô có chương trình sư phạm tiếng Anh không?",
        "intent": "search_university",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Sư phạm tiếng Anh",
            "location": null,
            "university_name": "ĐH Thủ đô",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường Đại học Thủ đô Hà Nội đào tạo những chương trình nào thuộc khối sư phạm?",
        "intent": "search_university",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Sư phạm",
            "location": "Hà Nội",
            "university_name": "Đại học Thủ đô Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em được 24 điểm thì có đủ vào Đại học Thủ đô Hà Nội không?",
        "intent": "recommendation_by_score",
        "confidence": 0.9,
        "entities": {
            "score": 24,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": "Đại học Thủ đô Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 24 điểm có đủ không?",
        "intent": "recommendation_by_score",
        "confidence": 0.86,
        "entities": {
            "score": 24,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": "Đại học Thủ đô Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng đang hỏi về Đại học Thủ đô Hà Nội."
    },
    {
        "q": "Thế còn ngành sư phạm toán thì sao?",
        "intent": "search_university",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Sư phạm Toán",
            "location": "Hà Nội",
            "university_name": "Đại học Thủ đô Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng đã chọn Đại học Thủ đô Hà Nội và đang hỏi các ngành sư phạm."
    },
    {
        "q": "Điểm chuẩn 2025 là bao nhiêu?",
        "intent": "ask_cutoff_score",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Sư phạm Toán",
            "location": "Hà Nội",
            "university_name": "Đại học Thủ đô Hà Nội",
            "year": 2025,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi ngành Sư phạm Toán tại Đại học Thủ đô Hà Nội."
    },
    {
        "q": "Điểm chuẩn ngành Sư phạm Toán của Đại học Thủ đô Hà Nội năm 2025 theo thi THPT là bao nhiêu?",
        "intent": "ask_cutoff_score",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Sư phạm Toán",
            "location": "Hà Nội",
            "university_name": "Đại học Thủ đô Hà Nội",
            "year": 2025,
            "method_code": "THPT"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành đó năm 2024 lấy bao nhiêu điểm theo học bạ?",
        "intent": "ask_cutoff_score",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Sư phạm Toán",
            "location": "Hà Nội",
            "university_name": "Đại học Thủ đô Hà Nội",
            "year": 2024,
            "method_code": "HOC_BA"
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng đang hỏi ngành Sư phạm Toán tại Đại học Thủ đô Hà Nội."
    },
    {
        "q": "Nhóm ngành Giáo dục - Sư phạm ở Hà Nội gồm những ngành nào?",
        "intent": "search_major",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Giáo dục - Sư phạm",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ở Hà Nội có trường nào đào tạo ngành Sư phạm Toán không?",
        "intent": "search_major",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Sư phạm Toán",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường nào ở Hà Nội phù hợp để học khối ngành giáo dục?",
        "intent": "search_major",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Giáo dục",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ở Hà Nội có những trường đại học nào?",
        "intent": "ask_location",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Cho em thông tin về Đại học Thủ đô Hà Nội",
        "intent": "search_university",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": "Đại học Thủ đô Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Đại học Thủ đô với Bách khoa ngành CNTT khối A00 nên chọn trường nào?",
        "intent": "compare_universities",
        "confidence": 0.84,
        "entities": {
            "score": null,
            "subject_group": "A00",
            "major": "CNTT",
            "location": null,
            "university_name": "Đại học Thủ đô; Bách khoa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "HUST hay PTIT phù hợp hơn nếu em muốn học công nghệ thông tin?",
        "intent": "compare_universities",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Công nghệ thông tin",
            "location": null,
            "university_name": "HUST; PTIT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí Đại học Thủ đô Hà Nội khoảng bao nhiêu một năm?",
        "intent": "ask_tuition_fee",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": "Đại học Thủ đô Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Sư phạm Toán ra trường làm gì, lương có ổn không?",
        "intent": "ask_career",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Sư phạm Toán",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em chào anh chị, tư vấn giúp em với ạ",
        "intent": "greeting",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Chatbot này có thể hỗ trợ em những gì?",
        "intent": "help",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Đại học ở TP.HCM có ngành logistics nào tốt?",
        "intent": "unknown",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Logistics",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Con tôi được 22.5 điểm khối D01, nên chọn ngành nào ở Hà Nội?",
        "intent": "recommendation_by_score",
        "confidence": 0.9,
        "entities": {
            "score": 22.5,
            "subject_group": "D01",
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em được 26 điểm A00 muốn học CNTT ở Hà Nội thì nên xét trường nào?",
        "intent": "recommendation_by_score",
        "confidence": 0.9,
        "entities": {
            "score": 26,
            "subject_group": "A00",
            "major": "CNTT",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "24 điểm khối tự nhiên có cơ hội vào ngành công nghệ thông tin không?",
        "intent": "recommendation_by_score",
        "confidence": 0.9,
        "entities": {
            "score": 24,
            "subject_group": "khối tự nhiên",
            "major": "Công nghệ thông tin",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn CNTT của Bách khoa năm 2025 theo A00 là bao nhiêu?",
        "intent": "ask_cutoff_score",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": "A00",
            "major": "CNTT",
            "location": null,
            "university_name": "Bách khoa",
            "year": 2025,
            "method_code": "THPT"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "NEU có ngành marketing không?",
        "intent": "search_university",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Marketing",
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường Kinh tế Quốc dân đào tạo những ngành nào?",
        "intent": "search_university",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Kinh tế Quốc dân",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành tài chính ngân hàng học những gì và trường nào ở Hà Nội có đào tạo?",
        "intent": "search_major",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Tài chính ngân hàng",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí ngành CNTT của PTIT khoảng bao nhiêu?",
        "intent": "ask_tuition_fee",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "PTIT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Còn học phí ngành đó thì sao?",
        "intent": "ask_tuition_fee",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "PTIT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi ngành CNTT tại PTIT."
    },
    {
        "q": "Năm 2023 trường đó lấy bao nhiêu điểm?",
        "intent": "ask_cutoff_score",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "PTIT",
            "year": 2023,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng đang hỏi ngành CNTT tại PTIT."
    },
    {
        "q": "Nếu xét học bạ thì ngành này cần điều kiện gì?",
        "intent": "ask_cutoff_score",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "PTIT",
            "year": null,
            "method_code": "HOC_BA"
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi ngành CNTT tại PTIT, câu này tiếp tục hỏi phương thức xét học bạ."
    },
    {
        "q": "Vậy khối A01 có xét được không?",
        "intent": "ask_cutoff_score",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": "A01",
            "major": "CNTT",
            "location": null,
            "university_name": "PTIT",
            "year": null,
            "method_code": "THPT"
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi ngành CNTT tại PTIT, câu này hỏi thêm tổ hợp xét tuyển."
    },
    {
        "q": "Ngành công nghệ thông tin sau này làm nghề gì?",
        "intent": "ask_career",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Công nghệ thông tin",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Bách khoa và Đại học Công nghệ khác nhau thế nào nếu học kỹ thuật máy tính?",
        "intent": "compare_universities",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Kỹ thuật máy tính",
            "location": null,
            "university_name": "Bách khoa; Đại học Công nghệ",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường nào ở Hà Nội có ngành truyền thông đa phương tiện?",
        "intent": "search_major",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Truyền thông đa phương tiện",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 18 điểm khối C00 có trường công lập nào ở Hà Nội không?",
        "intent": "recommendation_by_score",
        "confidence": 0.9,
        "entities": {
            "score": 18,
            "subject_group": "C00",
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm đánh giá năng lực của ngành quản trị kinh doanh ở NEU năm 2025 là bao nhiêu?",
        "intent": "ask_cutoff_score",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Quản trị kinh doanh",
            "location": null,
            "university_name": "NEU",
            "year": 2025,
            "method_code": "DGNL"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường đó có ký túc xá không?",
        "intent": "search_university",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": "Đại học Thủ đô Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng đang hỏi thông tin chung về Đại học Thủ đô Hà Nội."
    },
    {
        "q": "Tôi muốn tìm trường đại học gần nhà ở Hà Nội nhưng chưa biết học ngành gì",
        "intent": "ask_location",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Cho em xem thông tin trường NEU",
        "intent": "search_university",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Còn ngành Marketing thì sao?",
        "intent": "search_university",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Marketing",
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi thông tin tổng quan về NEU."
    },
    {
        "q": "Học phí ngành đó khoảng bao nhiêu?",
        "intent": "ask_tuition_fee",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Marketing",
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi ngành Marketing tại NEU."
    },
    {
        "q": "Điểm chuẩn 2025 theo THPT là bao nhiêu?",
        "intent": "ask_cutoff_score",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Marketing",
            "location": null,
            "university_name": "NEU",
            "year": 2025,
            "method_code": "THPT"
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi học phí ngành Marketing tại NEU."
    },
    {
        "q": "Cho mình biết về trường Bách Khoa Hà Nội",
        "intent": "search_university",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": "Bách Khoa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường này có những ngành gì?",
        "intent": "search_university",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Bách Khoa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi thông tin về Bách Khoa Hà Nội."
    },
    {
        "q": "Điểm chuẩn CNTT năm 2024 là bao nhiêu?",
        "intent": "ask_cutoff_score",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "Bách Khoa",
            "year": 2024,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng xem danh sách ngành của Bách Khoa và quan tâm CNTT."
    },
    {
        "q": "Em 25 điểm có đủ vào ngành đó không?",
        "intent": "recommendation_by_score",
        "confidence": 0.86,
        "entities": {
            "score": 25,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "Bách Khoa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điểm chuẩn CNTT Bách Khoa năm 2024."
    },
    {
        "q": "Học phí trường đó một năm khoảng bao nhiêu?",
        "intent": "ask_tuition_fee",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Bách Khoa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi khả năng vào CNTT Bách Khoa với 25 điểm."
    },
    {
        "q": "Cho em thông tin về USTH (Đại học Khoa học và Công nghệ Hà Nội)",
        "intent": "search_university",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": "USTH",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "có những ngành gì trong trường",
        "intent": "search_university",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "USTH",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi thông tin về USTH."
    },
    {
        "q": "cho tôi học phí của trường đại học Khoa học và công nghệ Hà Nội (USTH)",
        "intent": "ask_tuition_fee",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": "USTH",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Thế còn học phí ngành CNTT thì sao?",
        "intent": "ask_tuition_fee",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "USTH",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi học phí chung của USTH."
    },
    {
        "q": "Con tôi được 23 điểm A00 muốn học CNTT, có nên chọn HUST không?",
        "intent": "recommendation_by_score",
        "confidence": 0.9,
        "entities": {
            "score": 23,
            "subject_group": "A00",
            "major": "CNTT",
            "location": null,
            "university_name": "HUST",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Nếu không đủ HUST thì còn trường nào ở Hà Nội?",
        "intent": "recommendation_by_score",
        "confidence": 0.86,
        "entities": {
            "score": 23,
            "subject_group": "A00",
            "major": "CNTT",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước phụ huynh hỏi con 23 điểm A00 CNTT có vào HUST không."
    },
    {
        "q": "So sánh PTIT và Học viện Bưu chính ngành An toàn thông tin",
        "intent": "compare_universities",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "An toàn thông tin",
            "location": null,
            "university_name": "PTIT; Học viện Bưu chính",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường nào dễ đỗ hơn?",
        "intent": "compare_universities",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "An toàn thông tin",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng so sánh PTIT và Học viện Bưu chính ngành An toàn thông tin."
    },
    {
        "q": "Hai trường đó học phí chênh lệch nhiều không?",
        "intent": "compare_universities",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "An toàn thông tin",
            "location": null,
            "university_name": "PTIT; Học viện Bưu chính",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng so sánh PTIT và Học viện Bưu chính."
    },
    {
        "q": "diem chuan FTU nganh Ngoai thuong 2024 la bao nhieu",
        "intent": "ask_cutoff_score",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Ngoại thương",
            "location": null,
            "university_name": "FTU",
            "year": 2024,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Còn năm 2025 thì sao?",
        "intent": "ask_cutoff_score",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Ngoại thương",
            "location": null,
            "university_name": "FTU",
            "year": 2025,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điểm chuẩn FTU ngành Ngoại thương năm 2024."
    },
    {
        "q": "Theo phương thức học bạ thì lấy bao nhiêu điểm?",
        "intent": "ask_cutoff_score",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Ngoại thương",
            "location": null,
            "university_name": "FTU",
            "year": null,
            "method_code": "HOC_BA"
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điểm chuẩn FTU ngành Ngoại thương."
    },
    {
        "q": "Em được 20 điểm D01 muốn học Luật ở Hà Nội thì nên chọn trường nào?",
        "intent": "recommendation_by_score",
        "confidence": 0.95,
        "entities": {
            "score": 20,
            "subject_group": "D01",
            "major": "Luật",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Có trường nào dễ hơn Luật Hà Nội không?",
        "intent": "recommendation_by_score",
        "confidence": 0.86,
        "entities": {
            "score": 20,
            "subject_group": "D01",
            "major": "Luật",
            "location": "Hà Nội",
            "university_name": "Luật Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng 20 điểm D01 muốn học Luật ở Hà Nội."
    },
    {
        "q": "Ngành Luật ở Hà Nội có những trường nào đào tạo?",
        "intent": "search_major",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Luật",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Còn trường nào nữa?",
        "intent": "search_major",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Luật",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng xem danh sách trường đào tạo Luật ở Hà Nội."
    },
    {
        "q": "Phenikaa có đào tạo ngành Trí tuệ nhân tạo không?",
        "intent": "search_university",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Trí tuệ nhân tạo",
            "location": null,
            "university_name": "Phenikaa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành AI ra trường làm gì?",
        "intent": "ask_career",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Trí tuệ nhân tạo",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi Phenikaa có đào tạo ngành Trí tuệ nhân tạo không."
    },
    {
        "q": "Lương khởi điểm ngành đó khoảng bao nhiêu?",
        "intent": "ask_career",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Trí tuệ nhân tạo",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi việc làm sau khi học AI tại Phenikaa."
    },
    {
        "q": "HAUI có những ngành kỹ thuật nào?",
        "intent": "search_university",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "kỹ thuật",
            "location": null,
            "university_name": "HAUI",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn ngành Cơ khí năm 2025 là bao nhiêu?",
        "intent": "ask_cutoff_score",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Cơ khí",
            "location": null,
            "university_name": "HAUI",
            "year": 2025,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi các ngành kỹ thuật của HAUI và chọn Cơ khí."
    },
    {
        "q": "Em 22 điểm A00 có đủ vào ngành đó không?",
        "intent": "recommendation_by_score",
        "confidence": 0.86,
        "entities": {
            "score": 22,
            "subject_group": "A00",
            "major": "Cơ khí",
            "location": null,
            "university_name": "HAUI",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điểm chuẩn Cơ khí HAUI năm 2025."
    },
    {
        "q": "Thăng Long có ngành Du lịch không?",
        "intent": "search_university",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Du lịch",
            "location": null,
            "university_name": "Thăng Long",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí ngành Du lịch ở trường đó thế nào?",
        "intent": "ask_tuition_fee",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Du lịch",
            "location": null,
            "university_name": "Thăng Long",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi Thăng Long có ngành Du lịch không."
    },
    {
        "q": "FPT Hà Nội đào tạo những ngành công nghệ nào?",
        "intent": "search_university",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "công nghệ",
            "location": "Hà Nội",
            "university_name": "FPT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "So sánh FPT và USTH về học phí ngành CNTT",
        "intent": "compare_universities",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": "Hà Nội",
            "university_name": "FPT; USTH",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường nào rẻ hơn?",
        "intent": "compare_universities",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng so sánh học phí CNTT giữa FPT và USTH."
    },
    {
        "q": "Con em được 19 điểm khối C00, ở Hà Nội có trường nào phù hợp không?",
        "intent": "recommendation_by_score",
        "confidence": 0.9,
        "entities": {
            "score": 19,
            "subject_group": "C00",
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Nếu muốn học sư phạm thì sao?",
        "intent": "recommendation_by_score",
        "confidence": 0.86,
        "entities": {
            "score": 19,
            "subject_group": "C00",
            "major": "Sư phạm",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước phụ huynh hỏi con 19 điểm C00 tìm trường ở Hà Nội."
    },
    {
        "q": "Học viện Ngân hàng có ngành Tài chính ngân hàng không?",
        "intent": "search_university",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Tài chính ngân hàng",
            "location": null,
            "university_name": "Học viện Ngân hàng",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn ngành đó năm 2024 theo D01 là mấy?",
        "intent": "ask_cutoff_score",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": "D01",
            "major": "Tài chính ngân hàng",
            "location": null,
            "university_name": "Học viện Ngân hàng",
            "year": 2024,
            "method_code": "THPT"
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi Học viện Ngân hàng có ngành Tài chính ngân hàng không."
    },
    {
        "q": "Cho em danh sách trường đại học công lập ở Hà Nội",
        "intent": "ask_location",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Còn trường tư thục nào nữa không?",
        "intent": "ask_location",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng xem danh sách trường công lập ở Hà Nội."
    },
    {
        "q": "Trường đó ở quận nào?",
        "intent": "search_university",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi thông tin về một trường cụ thể ở Hà Nội."
    },
    {
        "q": "Em chào ạ, em mới vào app",
        "intent": "greeting",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Mình cần hỏi gì để tra điểm chuẩn?",
        "intent": "help",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường nào ở Cần Thơ học CNTT tốt?",
        "intent": "unknown",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Có học bổng 100% tại NEU không?",
        "intent": "ask_scholarship",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Cho em lịch thi THPT Quốc gia 2026",
        "intent": "unknown",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": 2026,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 27 điểm B00 muốn vào Y Hà Nội ngành Y đa khoa có được không?",
        "intent": "recommendation_by_score",
        "confidence": 0.9,
        "entities": {
            "score": 27,
            "subject_group": "B00",
            "major": "Y đa khoa",
            "location": null,
            "university_name": "Y Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Thế còn ngành Dược thì sao?",
        "intent": "search_university",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Dược",
            "location": null,
            "university_name": "Y Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi khả năng vào Y đa khoa Y Hà Nội với 27 điểm B00."
    },
    {
        "q": "Em 21.5 điểm A00 thích lập trình, gợi ý trường ở Hà Nội",
        "intent": "recommendation_by_score",
        "confidence": 0.95,
        "entities": {
            "score": 21.5,
            "subject_group": "A00",
            "major": "CNTT",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Mình 23 điểm khối D07 muốn học Quản trị khách sạn ở Hà Nội",
        "intent": "recommendation_by_score",
        "confidence": 0.9,
        "entities": {
            "score": 23,
            "subject_group": "D07",
            "major": "Quản trị khách sạn",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Con em 20 điểm khối A01 có vào được ngành Kế toán ở Hà Nội không?",
        "intent": "recommendation_by_score",
        "confidence": 0.9,
        "entities": {
            "score": 20,
            "subject_group": "A01",
            "major": "Kế toán",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 25 điểm muốn học ngành Dược ở Hà Nội thì nên chọn trường nào?",
        "intent": "recommendation_by_score",
        "confidence": 0.9,
        "entities": {
            "score": 25,
            "subject_group": null,
            "major": "Dược",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "22 điểm khối xã hội muốn học Truyền thông ở Hà Nội",
        "intent": "recommendation_by_score",
        "confidence": 0.9,
        "entities": {
            "score": 22,
            "subject_group": "khối xã hội",
            "major": "Truyền thông",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 19 điểm C00 có cơ hội vào ngành Du lịch không?",
        "intent": "recommendation_by_score",
        "confidence": 0.9,
        "entities": {
            "score": 19,
            "subject_group": "C00",
            "major": "Du lịch",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Mình được 24 điểm A00, ngân sách học phí tối đa 25 triệu/năm thì chọn trường nào?",
        "intent": "recommendation_by_score",
        "confidence": 0.84,
        "entities": {
            "score": 24,
            "subject_group": "A00",
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 26.5 điểm A01 muốn vào Ngoại thương ngành Kinh tế đối ngoại có được không?",
        "intent": "recommendation_by_score",
        "confidence": 0.9,
        "entities": {
            "score": 26.5,
            "subject_group": "A01",
            "major": "Kinh tế đối ngoại",
            "location": null,
            "university_name": "Ngoại thương",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Nếu chỉ xét THPT thì em 22 điểm A00 học CNTT nên đăng ký trường nào ở Hà Nội?",
        "intent": "recommendation_by_score",
        "confidence": 0.9,
        "entities": {
            "score": 22,
            "subject_group": "A00",
            "major": "CNTT",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": "THPT"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 17.5 điểm có trường nào ở Hà Nội nhận không ạ?",
        "intent": "recommendation_by_score",
        "confidence": 0.9,
        "entities": {
            "score": 17.5,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Với điểm đó thì nên chọn ngành nào an toàn hơn?",
        "intent": "recommendation_by_score",
        "confidence": 0.86,
        "entities": {
            "score": 22,
            "subject_group": "A00",
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng nói được 22 điểm A00 và muốn học ở Hà Nội."
    },
    {
        "q": "Thế nếu em hạ nguyện vọng xuống thì còn trường nào?",
        "intent": "recommendation_by_score",
        "confidence": 0.86,
        "entities": {
            "score": 20,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng 22 điểm A00 tìm trường CNTT Hà Nội."
    },
    {
        "q": "Điểm chuẩn ngành Quản trị kinh doanh NEU năm 2024 theo THPT",
        "intent": "ask_cutoff_score",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Quản trị kinh doanh",
            "location": null,
            "university_name": "NEU",
            "year": 2024,
            "method_code": "THPT"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "HUST ngành Kỹ thuật điện năm 2025 lấy bao nhiêu điểm khối A00?",
        "intent": "ask_cutoff_score",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": "A00",
            "major": "Kỹ thuật điện",
            "location": null,
            "university_name": "HUST",
            "year": 2025,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "diem chuan PTIT nganh CNTT 2023",
        "intent": "ask_cutoff_score",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "PTIT",
            "year": 2023,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn đánh giá năng lực USTH ngành CNTT 2025",
        "intent": "ask_cutoff_score",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "USTH",
            "year": 2025,
            "method_code": "DGNL"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Luật Hà Nội ngành Luật kinh tế năm 2024 lấy bao nhiêu điểm D01?",
        "intent": "ask_cutoff_score",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": "D01",
            "major": "Luật kinh tế",
            "location": null,
            "university_name": "Luật Hà Nội",
            "year": 2024,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Phenikaa ngành AI năm 2025 điểm chuẩn bao nhiêu?",
        "intent": "ask_cutoff_score",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Trí tuệ nhân tạo",
            "location": null,
            "university_name": "Phenikaa",
            "year": 2025,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Thế còn năm 2023?",
        "intent": "ask_cutoff_score",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "PTIT",
            "year": 2023,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điểm chuẩn PTIT ngành CNTT năm 2025."
    },
    {
        "q": "Theo học bạ thì bao nhiêu điểm?",
        "intent": "ask_cutoff_score",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Quản trị kinh doanh",
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": "HOC_BA"
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điểm chuẩn NEU ngành QTKD năm 2024 THPT."
    },
    {
        "q": "Khối A01 có xét không?",
        "intent": "ask_cutoff_score",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": "A01",
            "major": "CNTT",
            "location": null,
            "university_name": "HUST",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điểm chuẩn HUST ngành CNTT."
    },
    {
        "q": "Cho em xem thông tin Học viện Tài chính",
        "intent": "search_university",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Học viện Tài chính",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường Công nghiệp Hà Nội có ngành Cơ khí chế tạo máy không?",
        "intent": "search_university",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Cơ khí chế tạo máy",
            "location": "Hà Nội",
            "university_name": "Công nghiệp Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Mỹ thuật Việt Nam đào tạo những ngành gì?",
        "intent": "search_university",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Mỹ thuật Việt Nam",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "truong do co nganh ke toan khong",
        "intent": "search_university",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Kế toán",
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi thông tin NEU."
    },
    {
        "q": "Còn chương trình tiếng Anh thì sao?",
        "intent": "search_university",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Ngôn ngữ Anh",
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng xem danh sách ngành NEU."
    },
    {
        "q": "Ngành Kiến trúc ở Hà Nội trường nào đào tạo?",
        "intent": "search_major",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Kiến trúc",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Quản lý đất đai học những gì?",
        "intent": "search_major",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Quản lý đất đai",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Hà Nội có trường nào dạy ngành Báo chí?",
        "intent": "search_major",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Báo chí",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành này còn trường nào nữa?",
        "intent": "search_major",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Báo chí",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi trường đào tạo Báo chí ở Hà Nội."
    },
    {
        "q": "Học phí Đại học Thương mại khoảng bao nhiêu?",
        "intent": "ask_tuition_fee",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Thương mại",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "hoc phi nganh marketing o NEU 1 nam",
        "intent": "ask_tuition_fee",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Marketing",
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "FPT tính học phí theo tín chỉ hay theo năm?",
        "intent": "ask_tuition_fee",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "FPT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí trường đó có cao không?",
        "intent": "ask_tuition_fee",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Thương mại",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi thông tin Đại học Thương mại."
    },
    {
        "q": "So sánh NEU và FTU ngành Kinh tế quốc tế",
        "intent": "compare_universities",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Kinh tế quốc tế",
            "location": null,
            "university_name": "NEU; FTU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Bách khoa hay Công nghệ tốt hơn cho ngành CNTT?",
        "intent": "compare_universities",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "Bách khoa; Công nghệ",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường nào uy tín hơn?",
        "intent": "compare_universities",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "NEU; FTU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng so sánh NEU và FTU."
    },
    {
        "q": "Ngành Dược ra trường làm việc ở đâu?",
        "intent": "ask_career",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Dược",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học Kế toán có dễ xin việc không?",
        "intent": "ask_career",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Kế toán",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Lương ngành đó khoảng bao nhiêu?",
        "intent": "ask_career",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Marketing",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi việc làm ngành Marketing."
    },
    {
        "q": "Liệt kê các trường tư thục ở Hà Nội",
        "intent": "ask_location",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Hà Nội có bao nhiêu trường đại học công lập?",
        "intent": "ask_location",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Còn trường nào ở khu Cầu Giấy không?",
        "intent": "ask_location",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng xem danh sách trường Hà Nội."
    },
    {
        "q": "Chào bot, em cần tư vấn tuyển sinh",
        "intent": "greeting",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "App này dùng để làm gì?",
        "intent": "help",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường đại học ở Huế nào mạnh về kinh tế?",
        "intent": "unknown",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Cho em đề thi thử môn Toán",
        "intent": "unknown",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 24 điểm A00 muốn học Hệ thống thông tin quản lý ở Hà Nội",
        "intent": "recommendation_by_score",
        "confidence": 0.95,
        "entities": {
            "score": 24,
            "subject_group": "A00",
            "major": "Hệ thống thông tin quản lý",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn ngành Ngôn ngữ Trung Quốc Hà Nội năm 2025",
        "intent": "ask_cutoff_score",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Ngôn ngữ Trung Quốc",
            "location": "Hà Nội",
            "university_name": null,
            "year": 2025,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học viện Ngoại ngữ có ngành Ngôn ngữ Nhật không?",
        "intent": "search_university",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Ngôn ngữ Nhật",
            "location": null,
            "university_name": "Học viện Ngoại ngữ",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Công nghệ thực phẩm trường nào có ở Hà Nội?",
        "intent": "search_major",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Công nghệ thực phẩm",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí Y dược Hà Nội ngành Y đa khoa",
        "intent": "ask_tuition_fee",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Y đa khoa",
            "location": "Hà Nội",
            "university_name": "Y dược",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "So sánh Thăng Long và Phenikaa ngành QTKD",
        "intent": "compare_universities",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Quản trị kinh doanh",
            "location": null,
            "university_name": "Thăng Long; Phenikaa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Luật ra trường làm việc gì?",
        "intent": "ask_career",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Luật",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Các trường đại học ở Hà Nội thuộc Bộ GD&ĐT",
        "intent": "ask_location",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 28 điểm A00 có nên đặt Bách Khoa nguyện vọng 1 không?",
        "intent": "recommendation_by_score",
        "confidence": 0.9,
        "entities": {
            "score": 28,
            "subject_group": "A00",
            "major": null,
            "location": null,
            "university_name": "Bách Khoa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn HAUI ngành Điện tử viễn thông 2024",
        "intent": "ask_cutoff_score",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Điện tử viễn thông",
            "location": null,
            "university_name": "HAUI",
            "year": 2024,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "ĐH Công nghệ (UET) có những ngành CNTT nào?",
        "intent": "search_university",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "UET",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành An toàn thông tin khác gì CNTT?",
        "intent": "search_major",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "An toàn thông tin",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí ngành Logistics tại FTU",
        "intent": "ask_tuition_fee",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Logistics",
            "location": null,
            "university_name": "FTU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "NEU với HV Ngân hàng nên chọn trường nào học Tài chính?",
        "intent": "compare_universities",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Tài chính ngân hàng",
            "location": null,
            "university_name": "NEU; Học viện Ngân hàng",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Y tá ra trường làm gì?",
        "intent": "ask_career",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Y tá",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường nào ở Hà Nội gần sân bay Nội Bài?",
        "intent": "ask_location",
        "confidence": 0.84,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Mình muốn biết cách dùng chatbot",
        "intent": "help",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Xin chào, em là học sinh lớp 12",
        "intent": "greeting",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em muốn tìm trường ở nước ngoài",
        "intent": "unknown",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Con tôi 24.5 điểm D01 thích Luật, gợi ý trường Hà Nội",
        "intent": "recommendation_by_score",
        "confidence": 0.9,
        "entities": {
            "score": 24.5,
            "subject_group": "D01",
            "major": "Luật",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn B00 ngành Y đa khoa Y Hà Nội 2025",
        "intent": "ask_cutoff_score",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": "B00",
            "major": "Y đa khoa",
            "location": null,
            "university_name": "Y Hà Nội",
            "year": 2025,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường đó có đào tạo ngành Dược không?",
        "intent": "search_university",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Dược",
            "location": null,
            "university_name": "Y Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi Y Hà Nội ngành Y đa khoa."
    },
    {
        "q": "Em 22 điểm có đủ không?",
        "intent": "recommendation_by_score",
        "confidence": 0.86,
        "entities": {
            "score": 22,
            "subject_group": null,
            "major": "Y đa khoa",
            "location": null,
            "university_name": "Y Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điểm chuẩn Y đa khoa Y Hà Nội 2025."
    },
    {
        "q": "Ngành Quản trị nhà hàng trường nào có?",
        "intent": "search_major",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Quản trị nhà hàng",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí Bách Khoa ngành Cơ khí",
        "intent": "ask_tuition_fee",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Cơ khí",
            "location": null,
            "university_name": "Bách Khoa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "HUST và HAUI ngành Điện tử khác nhau thế nào?",
        "intent": "compare_universities",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Điện tử",
            "location": null,
            "university_name": "HUST; HAUI",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Kiến trúc cơ hội việc làm ra sao?",
        "intent": "ask_career",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Kiến trúc",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Danh sách trường đại học ở Hà Nội theo quận",
        "intent": "ask_location",
        "confidence": 0.84,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 20 điểm A00 muốn học ngành Môi trường ở Hà Nội",
        "intent": "recommendation_by_score",
        "confidence": 0.95,
        "entities": {
            "score": 20,
            "subject_group": "A00",
            "major": "Môi trường",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Điểm chuẩn ngành Môi trường ĐH Thủy lợi 2024",
        "intent": "ask_cutoff_score",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Môi trường",
            "location": null,
            "university_name": "Thủy lợi",
            "year": 2024,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "ĐH Thăng Long có ngành CNTT không?",
        "intent": "search_university",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "Thăng Long",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Khoa học dữ liệu học ở đâu ở Hà Nội?",
        "intent": "search_major",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Khoa học dữ liệu",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí Phenikaa một năm bao nhiêu?",
        "intent": "ask_tuition_fee",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Phenikaa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "FPT và Bách Khoa ngành CNTT trường nào phù hợp hơn?",
        "intent": "compare_universities",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "FPT; Bách Khoa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ngành Ngôn ngữ Anh làm nghề gì?",
        "intent": "ask_career",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Ngôn ngữ Anh",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ở Hà Nội trường tư nào học phí thấp?",
        "intent": "ask_location",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Bot ơi giúp em với",
        "intent": "greeting",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Làm sao để xem điểm chuẩn theo phương thức?",
        "intent": "help",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em cần tư vấn chọn ngành theo sở thích",
        "intent": "help",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường nào ở Nha Trang học Du lịch?",
        "intent": "unknown",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Có app nào ôn thi THPT tốt không?",
        "intent": "unknown",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 23 điểm A01 muốn học Kinh tế ở Hà Nội",
        "intent": "recommendation_by_score",
        "confidence": 0.95,
        "entities": {
            "score": 23,
            "subject_group": "A01",
            "major": "Kinh tế",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Còn phương thức xét tuyển khác thì sao?",
        "intent": "ask_cutoff_score",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Kinh tế",
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": "DGNL"
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng 23 điểm A01 tìm ngành Kinh tế ở Hà Nội và xem điểm chuẩn NEU."
    },
    {
        "q": "NEU xét tuyển những phương thức nào?",
        "intent": "ask_admission_method",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Bách Khoa có xét tuyển bằng học bạ không?",
        "intent": "ask_admission_method",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Bách Khoa",
            "year": null,
            "method_code": "HOC_BA"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "HUST tuyển sinh theo DGNL như thế nào?",
        "intent": "ask_admission_method",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "HUST",
            "year": null,
            "method_code": "DGNL"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "PTIT có phương thức xét tuyển thẳng không?",
        "intent": "ask_admission_method",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "PTIT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "FTU xét THPT quốc gia cần điều kiện gì?",
        "intent": "ask_admission_method",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "FTU",
            "year": null,
            "method_code": "THPT"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "USTH tuyển sinh bằng phương thức nào?",
        "intent": "ask_admission_method",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "USTH",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Phenikaa có xét đánh giá năng lực không?",
        "intent": "ask_admission_method",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Phenikaa",
            "year": null,
            "method_code": "DGNL"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường FPT tuyển sinh theo những hình thức nào?",
        "intent": "ask_admission_method",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "FPT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học viện Bưu chính xét học bạ thế nào?",
        "intent": "ask_admission_method",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Học viện Bưu chính",
            "year": null,
            "method_code": "HOC_BA"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Luật Hà Nội có xét tuyển kết hợp không?",
        "intent": "ask_admission_method",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Luật Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Thăng Long tuyển sinh theo THPT hay học bạ?",
        "intent": "ask_admission_method",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Thăng Long",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "HAUI có phương thức xét tuyển nào cho ngành Cơ khí?",
        "intent": "ask_admission_method",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Cơ khí",
            "location": null,
            "university_name": "HAUI",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Y Hà Nội xét tuyển ngành Y đa khoa bằng phương thức gì?",
        "intent": "ask_admission_method",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Y đa khoa",
            "location": null,
            "university_name": "Y Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "ĐH Thủy lợi có xét DGNL không?",
        "intent": "ask_admission_method",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Thủy lợi",
            "year": null,
            "method_code": "DGNL"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học viện Ngân hàng tuyển sinh theo những PT nào?",
        "intent": "ask_admission_method",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Học viện Ngân hàng",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "truong nao o ha noi xet tuyen bang hoc ba",
        "intent": "ask_admission_method",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": "HOC_BA"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Phương thức DGNL là gì ạ?",
        "intent": "ask_admission_method",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": "DGNL"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Xét tuyển học bạ khác gì thi THPT quốc gia?",
        "intent": "ask_admission_method",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": "HOC_BA"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em muốn nộp hồ sơ theo phương thức đánh giá năng lực thì làm sao?",
        "intent": "ask_admission_method",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": "DGNL"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường nào ở Hà Nội xét tuyển bằng học bạ ngành CNTT?",
        "intent": "ask_admission_method",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": "HOC_BA"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "NEU ngành Marketing xét theo THPT hay học bạ?",
        "intent": "ask_admission_method",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Marketing",
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Bách Khoa ngành CNTT có xét tuyển thẳng không?",
        "intent": "ask_admission_method",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "Bách Khoa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "PTIT xét tuyển ngành CNTT theo những phương thức nào?",
        "intent": "ask_admission_method",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "PTIT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Con tôi muốn nộp hồ sơ học bạ vào NEU thì cần gì?",
        "intent": "ask_admission_method",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": "HOC_BA"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "ĐH Công nghệ UET tuyển sinh CNTT bằng PT gì?",
        "intent": "ask_admission_method",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "UET",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Còn phương thức học bạ thì sao?",
        "intent": "ask_admission_method",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": "HOC_BA"
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi PT xét tuyển THPT của NEU."
    },
    {
        "q": "Trường đó có xét DGNL không?",
        "intent": "ask_admission_method",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": "DGNL"
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi phương thức tuyển sinh NEU."
    },
    {
        "q": "Ngành đó xét theo khối nào?",
        "intent": "ask_admission_method",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "PTIT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi PTIT xét tuyển ngành CNTT."
    },
    {
        "q": "Thế còn xét tuyển thẳng?",
        "intent": "ask_admission_method",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi phương thức tuyển sinh Bách Khoa."
    },
    {
        "q": "Học bạ cần điểm trung bình bao nhiêu?",
        "intent": "ask_admission_method",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "FTU",
            "year": null,
            "method_code": "HOC_BA"
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi FTU xét học bạ."
    },
    {
        "q": "DGNL thì thi môn gì?",
        "intent": "ask_admission_method",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": "DGNL"
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi phương thức đánh giá năng lực."
    },
    {
        "q": "PT này áp dụng cho ngành Marketing không?",
        "intent": "ask_admission_method",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Marketing",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": "THPT"
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi NEU xét THPT."
    },
    {
        "q": "Em nộp hồ sơ online được không?",
        "intent": "ask_admission_method",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "FPT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi phương thức tuyển sinh FPT."
    },
    {
        "q": "Còn phương thức nào khác nữa?",
        "intent": "ask_admission_method",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "USTH",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi USTH tuyển sinh thế nào."
    },
    {
        "q": "Xét học bạ có cần chứng chỉ tiếng Anh không?",
        "intent": "ask_admission_method",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": "HOC_BA"
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điều kiện xét học bạ."
    },
    {
        "q": "Phương thức đó áp dụng năm 2025 chứ?",
        "intent": "ask_admission_method",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": 2025,
            "method_code": "THPT"
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi PT THPT tại một trường Hà Nội."
    },
    {
        "q": "Trường ấy có xét kết hợp điểm thi và học bạ không?",
        "intent": "ask_admission_method",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Phenikaa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi Phenikaa tuyển sinh."
    },
    {
        "q": "NEU có xét tuyển thẳng olympic không?",
        "intent": "ask_admission_method",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi phương thức NEU."
    },
    {
        "q": "HUST xét tuyển bằng chứng chỉ quốc tế không?",
        "intent": "ask_admission_method",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "HUST",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi PT tuyển sinh HUST."
    },
    {
        "q": "Em muốn đăng ký PT đó thì nộp hồ sơ ở đâu?",
        "intent": "ask_admission_method",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "USTH",
            "year": null,
            "method_code": "DGNL"
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi USTH xét DGNL."
    },
    {
        "q": "NEU có học bổng cho tân sinh viên không?",
        "intent": "ask_scholarship",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Bách Khoa có học bổng khuyến khích học tập không?",
        "intent": "ask_scholarship",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Bách Khoa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "FPT University có học bổng 100% học phí không?",
        "intent": "ask_scholarship",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "FPT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "USTH có chương trình học bổng quốc tế không?",
        "intent": "ask_scholarship",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "USTH",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Phenikaa miễn giảm học phí thế nào?",
        "intent": "ask_scholarship",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Phenikaa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học bổng ngành CNTT ở Hà Nội trường nào có?",
        "intent": "ask_scholarship",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "FTU có học bổng cho sinh viên giỏi không?",
        "intent": "ask_scholarship",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "FTU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 27 điểm có được học bổng không?",
        "intent": "ask_scholarship",
        "confidence": 0.9,
        "entities": {
            "score": 27,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học bổng tại PTIT cần điều kiện gì?",
        "intent": "ask_scholarship",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "PTIT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Co hoc bong tai NEU khong",
        "intent": "ask_scholarship",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường tư ở Hà Nội học bổng nhiều không?",
        "intent": "ask_scholarship",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học bổng và miễn giảm học phí khác nhau thế nào?",
        "intent": "ask_scholarship",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Con tôi giỏi Toán có học bổng ở Bách Khoa không?",
        "intent": "ask_scholarship",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Bách Khoa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Thăng Long có hỗ trợ tài chính cho sinh viên không?",
        "intent": "ask_scholarship",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Thăng Long",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học viện Ngân hàng có học bổng ngành Tài chính không?",
        "intent": "ask_scholarship",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Tài chính ngân hàng",
            "location": null,
            "university_name": "Học viện Ngân hàng",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em muốn xin học bổng toàn phần thì làm sao?",
        "intent": "ask_scholarship",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học bổng dành cho sinh viên vùng khó khăn ở Hà Nội",
        "intent": "ask_scholarship",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Y Hà Nội có học bổng ngành Y không?",
        "intent": "ask_scholarship",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Y đa khoa",
            "location": null,
            "university_name": "Y Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học bổng đó cần GPA bao nhiêu?",
        "intent": "ask_scholarship",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi học bổng NEU."
    },
    {
        "q": "Còn học bổng ngành khác không?",
        "intent": "ask_scholarship",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi học bổng NEU ngành Marketing."
    },
    {
        "q": "Em có đủ điều kiện xin không?",
        "intent": "ask_scholarship",
        "confidence": 0.86,
        "entities": {
            "score": 27,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "FPT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi học bổng FPT."
    },
    {
        "q": "Nộp hồ sơ học bổng khi nào?",
        "intent": "ask_scholarship",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "USTH",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi học bổng USTH."
    },
    {
        "q": "Trường đó có miễn 50% học phí không?",
        "intent": "ask_scholarship",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Phenikaa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi miễn giảm Phenikaa."
    },
    {
        "q": "Học bổng có áp dụng ngành CNTT không?",
        "intent": "ask_scholarship",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "Bách Khoa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi học bổng Bách Khoa."
    },
    {
        "q": "Thế còn học bổng doanh nghiệp tài trợ?",
        "intent": "ask_scholarship",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "PTIT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi học bổng PTIT."
    },
    {
        "q": "Học bổng full có cần cam kết không?",
        "intent": "ask_scholarship",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "FPT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi học bổng 100% FPT."
    },
    {
        "q": "Con em học giỏi môn Anh có được ưu tiên học bổng không?",
        "intent": "ask_scholarship",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "FTU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước phụ huynh hỏi học bổng FTU."
    },
    {
        "q": "Học bổng này dành cho khối A00 phải không?",
        "intent": "ask_scholarship",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": "A00",
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi học bổng tân sinh viên."
    },
    {
        "q": "Em cần chuẩn bị giấy tờ gì để xin?",
        "intent": "ask_scholarship",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điều kiện học bổng NEU."
    },
    {
        "q": "Còn hỗ trợ vay vốn sinh viên không?",
        "intent": "ask_scholarship",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Học viện Ngân hàng",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi hỗ trợ tài chính HV Ngân hàng."
    },
    {
        "q": "NEU có ký túc xá không?",
        "intent": "ask_facilities",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Bách Khoa ký túc xá ở đâu?",
        "intent": "ask_facilities",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Bách Khoa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "FPT Hà Nội có KTX cho sinh viên năm nhất không?",
        "intent": "ask_facilities",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": "FPT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "USTH cơ sở vật chất thế nào?",
        "intent": "ask_facilities",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "USTH",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "PTIT có ký túc xá nội trú không?",
        "intent": "ask_facilities",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "PTIT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường Phenikaa có phòng lab CNTT không?",
        "intent": "ask_facilities",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "Phenikaa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "HAUI có ký túc xá cho nữ sinh không?",
        "intent": "ask_facilities",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "HAUI",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Thăng Long campus rộng không?",
        "intent": "ask_facilities",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Thăng Long",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường đại học ở Hà Nội nào có KTX tốt?",
        "intent": "ask_facilities",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học viện Bưu chính có thư viện lớn không?",
        "intent": "ask_facilities",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Học viện Bưu chính",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Y Hà Nội bệnh viện thực hành ở đâu?",
        "intent": "ask_facilities",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Y Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "truong co ky tuc xa khong",
        "intent": "ask_facilities",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "FTU cơ sở chính ở đâu?",
        "intent": "ask_facilities",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "FTU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em muốn ở nội trú thì trường nào ở Hà Nội có KTX?",
        "intent": "ask_facilities",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Luật Hà Nội có sân thể thao không?",
        "intent": "ask_facilities",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Luật Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "ĐH Thủ đô có ký túc xá giá rẻ không?",
        "intent": "ask_facilities",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Đại học Thủ đô Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Phòng học UET có máy chiếu và wifi không?",
        "intent": "ask_facilities",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "UET",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Trường công lập Hà Nội nào có cơ sở vật chất hiện đại?",
        "intent": "ask_facilities",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "KTX trường đó giá bao nhiêu một tháng?",
        "intent": "ask_facilities",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi NEU có ký túc xá không."
    },
    {
        "q": "Còn KTX khu vực nào khác không?",
        "intent": "ask_facilities",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Bách Khoa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi KTX Bách Khoa."
    },
    {
        "q": "Trường này có căng tin và siêu thị không?",
        "intent": "ask_facilities",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "FPT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi cơ sở FPT Hà Nội."
    },
    {
        "q": "Phòng lab AI có đủ máy không?",
        "intent": "ask_facilities",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Trí tuệ nhân tạo",
            "location": null,
            "university_name": "Phenikaa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi lab CNTT Phenikaa."
    },
    {
        "q": "Em ở xa có được ưu tiên KTX không?",
        "intent": "ask_facilities",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "PTIT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi KTX PTIT."
    },
    {
        "q": "Thư viện mở cửa mấy giờ?",
        "intent": "ask_facilities",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Học viện Bưu chính",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi thư viện HV Bưu chính."
    },
    {
        "q": "Trường đó có xe buýt đưa đón không?",
        "intent": "ask_facilities",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "USTH",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi cơ sở USTH."
    },
    {
        "q": "KTX có điều hòa và nóng lạnh không?",
        "intent": "ask_facilities",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "HAUI",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi KTX HAUI."
    },
    {
        "q": "Campus có khu ký túc riêng cho SV năm nhất không?",
        "intent": "ask_facilities",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Thăng Long",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi campus Thăng Long."
    },
    {
        "q": "Bệnh viện thực hành có đủ chỗ cho sinh viên không?",
        "intent": "ask_facilities",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Y Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi bệnh viện Y Hà Nội."
    },
    {
        "q": "Trường ấy có hồ bơi không?",
        "intent": "ask_facilities",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Luật Hà Nội",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi cơ s sở Luật Hà Nội."
    },
    {
        "q": "Em muốn thuê phòng ngoài thì trường có hỗ trợ tìm nhà không?",
        "intent": "ask_facilities",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi KTX NEU."
    },
    {
        "q": "Sài Gòn có trường CNTT nào ngon không?",
        "intent": "unknown",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Em 25 điểm A00 muốn học ở TP.HCM thì chọn trường nào?",
        "intent": "unknown",
        "confidence": 0.9,
        "entities": {
            "score": 25,
            "subject_group": "A00",
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Dữ liệu điểm chuẩn trên app lấy từ đâu vậy?",
        "intent": "help",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "App chỉ tra cứu được Hà Nội thôi à?",
        "intent": "help",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "So sánh Bách Khoa, NEU và FTU về điểm chuẩn CNTT năm 2024",
        "intent": "compare_universities",
        "confidence": 0.84,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "Bách Khoa, NEU, FTU",
            "year": 2024,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "BKHN với PTIT với UET ngành an toàn thông tin cái nào cao hơn?",
        "intent": "compare_universities",
        "confidence": 0.84,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "An toàn thông tin",
            "location": null,
            "university_name": "BKHN, PTIT, UET",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Học phí và điểm chuẩn Bách Khoa với Phenikaa khác nhau thế nào?",
        "intent": "compare_universities",
        "confidence": 0.84,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Bách Khoa, Phenikaa",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Thế còn ở Đà Nẵng thì sao?",
        "intent": "unknown",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "User vừa hỏi trường CNTT ở Hà Nội"
    },
    {
        "q": "Hệ thống có hỗ trợ ngoài Hà Nội không?",
        "intent": "help",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": "Hà Nội",
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "So sánh NEU, FTU và Thương mại về học phí ngành Logistics",
        "intent": "compare_universities",
        "confidence": 0.84,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Logistics",
            "location": null,
            "university_name": "NEU, FTU, Thương mại",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Ở Hồ Chí Minh có đại học công lập nào mạnh CNTT?",
        "intent": "unknown",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Phải hỏi như nào để so sánh hai trường?",
        "intent": "help",
        "confidence": 0.95,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Còn học phí thì trường nào rẻ hơn?",
        "intent": "compare_universities",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "User vừa so sánh Bách Khoa và Phenikaa về điểm chuẩn CNTT"
    },
    {
        "q": "Tìm trường du học Mỹ giúp em",
        "intent": "unknown",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Bách Khoa hay NEU hay FTU học phí thấp hơn?",
        "intent": "compare_universities",
        "confidence": 0.84,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Bách Khoa, NEU, FTU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "điểm chuẩn ngành hàng không của USTH thì sao",
        "intent": "ask_cutoff_score",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Hàng không",
            "location": null,
            "university_name": "USTH",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điểm chuẩn HUST ngành Trí tuệ nhân tạo năm 2024."
    },
    {
        "q": "thế còn FTU thì học phí bao nhiêu",
        "intent": "ask_tuition_fee",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "FTU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi học phí NEU."
    },
    {
        "q": "PTIT có những ngành gì",
        "intent": "search_university",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "PTIT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi HUST có những ngành gì."
    },
    {
        "q": "thế còn Phenikaa ngành CNTT năm 2024",
        "intent": "ask_cutoff_score",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "Phenikaa",
            "year": 2024,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điểm chuẩn Bách Khoa ngành CNTT năm 2024."
    },
    {
        "q": "học phí NEU ngành Marketing thì sao",
        "intent": "ask_tuition_fee",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Marketing",
            "location": null,
            "university_name": "NEU",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi học phí chung của USTH."
    },
    {
        "q": "so sánh USTH với HUST về điểm chuẩn CNTT",
        "intent": "compare_universities",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "CNTT",
            "location": null,
            "university_name": "USTH, HUST",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng so sánh NEU và FTU."
    },
    {
        "q": "HAUI ngành Điện tử năm 2025 lấy bao nhiêu điểm",
        "intent": "ask_cutoff_score",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Điện tử",
            "location": null,
            "university_name": "HAUI",
            "year": 2025,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi điểm chuẩn HUST ngành Điện tử năm 2025."
    },
    {
        "q": "nếu em muốn học AI ở USTH thì sao",
        "intent": "recommendation_by_score",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": "Trí tuệ nhân tạo",
            "location": null,
            "university_name": "USTH",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "User vừa hỏi gợi ý trường với 24 điểm A00 học CNTT ở Hà Nội."
    },
    {
        "q": "USTH có KTX không",
        "intent": "ask_facilities",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "USTH",
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi NEU có ký túc xá không."
    },
    {
        "q": "HUST xét tuyển bằng học bạ không",
        "intent": "ask_admission_method",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "HUST",
            "year": null,
            "method_code": "học bạ"
        },
        "is_follow_up": true,
        "context_note": "Turn trước người dùng hỏi NEU xét tuyển những phương thức nào."
    },
    {
        "q": "So sánh NEU và FTU ngành Tài chính năm 2024 khối A00 theo THPT",
        "intent": "compare_universities",
        "confidence": 0.84,
        "entities": {
            "score": null,
            "subject_group": "A00",
            "major": "Tài chính",
            "location": null,
            "university_name": "NEU, FTU",
            "year": 2024,
            "method_code": "THPT"
        },
        "is_follow_up": false,
        "context_note": null
    },
    {
        "q": "Hai trường này khác nhau thế nào về điểm chuẩn?",
        "intent": "compare_universities",
        "confidence": 0.86,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": null,
            "year": null,
            "method_code": null
        },
        "is_follow_up": true,
        "context_note": "Các trường vừa so sánh: NEU, FTU."
    },
    {
        "q": "So sánh Bách Khoa và PTIT về số ngành và phương thức xét tuyển",
        "intent": "compare_universities",
        "confidence": 0.9,
        "entities": {
            "score": null,
            "subject_group": null,
            "major": null,
            "location": null,
            "university_name": "Bách Khoa, PTIT",
            "year": null,
            "method_code": null
        },
        "is_follow_up": false,
        "context_note": null
    }
];
//# sourceMappingURL=intent-corpus.generated.js.map