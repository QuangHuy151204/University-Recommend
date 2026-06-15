export type Locale = 'vi' | 'en';

export const LOCALE_STORAGE_KEY = 'uniguide-locale';

const vi = {
    'nav.home': 'Trang chủ',
    'nav.search': 'Tra cứu',
    'nav.majors': 'Ngành',
    'nav.cutoff': 'Điểm chuẩn',
    'nav.chatbot': 'Tư vấn AI',
    'nav.searchPlaceholder': 'Tìm kiếm trường...',
    'nav.login': 'Đăng nhập',
    'nav.register': 'Đăng ký',
    'nav.logout': 'Đăng xuất',
    'nav.backToLanding': '← Về trang giới thiệu',

    'footer.tagline':
        'Giúp học sinh THPT tại Hà Nội tra cứu trường, ngành và điểm chuẩn — nhận gợi ý phù hợp năng lực, sở thích và ngân sách học phí.',
    'footer.start': 'BẮT ĐẦU',
    'footer.explore': 'KHÁM PHÁ',
    'footer.support': 'HỖ TRỢ',
    'footer.features': 'TÍNH NĂNG',
    'footer.register': 'Đăng ký tài khoản',
    'footer.searchUnis': 'Tra cứu trường',
    'footer.exploreMajors': 'Khám phá ngành',
    'footer.cutoff': 'Điểm chuẩn 2023–2025',
    'footer.scope': 'Phạm vi: Hà Nội',
    'footer.cutoffYears': 'Điểm chuẩn 2023–2025',
    'footer.featureSearch': 'Tra cứu trường & ngành',
    'footer.featureCutoff': 'Tra điểm chuẩn theo trường',
    'footer.featureChatbot': 'Chatbot tư vấn AI',
    'footer.featureCompare': 'So sánh trường',
    'footer.copyright': '© {year} UniGuide AI. Gợi ý đại học minh bạch cho Gen Z.',

    'home.heroTitle': 'Định hướng tương lai cùng trí tuệ nhân tạo.',
    'home.heroSubtitle':
        'Khám phá trường đại học phù hợp năng lực và đam mê — xem điểm chuẩn, học phí và ngành đào tạo tại Hà Nội (2023–2025).',
    'home.searchPlaceholder': 'Tên trường, ngành học...',
    'home.searchNow': 'Tìm ngay',
    'home.cutoffTitle': 'Điểm chuẩn 2023–2025',
    'home.cutoffDesc':
        'Tìm tên trường, xem bảng điểm chuẩn theo ngành và phương thức xét tuyển.',
    'home.cutoffLink': 'Tra cứu điểm chuẩn →',
    'home.unisTitle': 'Tra cứu trường',
    'home.unisDesc':
        'Tra cứu trường đại học Hà Nội, học phí và điểm chuẩn theo năm.',
    'home.majorsTitle': 'Khám phá ngành',
    'home.majorsDesc':
        'Khám phá ngành học, định hướng nghề nghiệp và trường đào tạo.',
    'home.bannerTitle': 'Điểm chuẩn 2023–2025',
    'home.bannerDesc':
        'Xem điểm chuẩn theo trường, ngành và phương thức xét tuyển — cập nhật các năm gần đây.',
    'home.recommend': 'Gợi ý trường – ngành',
    'home.viewScores': 'Xem bảng điểm',
    'home.aiAdvisor': 'Tư vấn AI',
    'home.featuredTitle': 'Trường đại học tiêu biểu',
    'home.featuredMajorsEyebrow': 'Xu hướng nghề nghiệp',
    'home.featuredMajorsTitle': 'Ngành nổi bật',
    'home.featuredMajorsSubtitle':
        '12 nhóm ngành được chọn lọc theo nhu cầu thị trường lao động và định hướng phát triển — giúp bạn khám phá hướng đi trước khi chọn trường.',
    'home.featuredMajorsViewAll': 'Xem tất cả ngành →',
    'home.featuredMajorsSample': 'Các ngành tiêu biểu',
    'home.featuredMajorsBrowse': 'Tra cứu ngành',
    'home.featuredMajorsSuggest': 'Gợi ý cho tôi',
    'home.viewAll': 'Xem tất cả →',
    'home.hanoi': 'Hà Nội',
    'home.hanoiCountry': 'Hà Nội, Việt Nam',
    'home.schoolDetail': 'Chi tiết trường',
    'home.chatbotTeaser':
        'Hỏi chatbot về trường, ngành, điểm chuẩn và học phí — trả lời bằng tiếng Việt, dễ hiểu.',
    'home.chatbotCta': 'Bắt đầu tư vấn ngay',

    'universities.filtersTitle': 'Bộ lọc tìm kiếm',
    'universities.subjectLabel': 'Khối thi',
    'universities.majorLabel': 'Ngành',
    'universities.majorHint': 'bấm chọn trong danh sách',
    'universities.scoreLabel': 'Mức điểm',
    'universities.scorePlaceholder': 'VD: 24',
    'universities.scoreHint':
        'Điểm dự kiến của bạn (0–30). Lọc trường có ngành khớp tổ hợp với điểm chuẩn năm mới nhất (2023–2025) ≤ mức này.',
    'universities.tuitionOptional': 'Học phí (tuỳ chọn)',
    'universities.tuitionMin': '5 triệu',
    'universities.tuitionMax': '80 triệu',
    'universities.tuitionMaxLabel': 'Tối đa: {value}',
    'universities.scopeNote': 'Hiện đang là khu vực Hà Nội.',
    'universities.applying': 'Đang áp dụng…',
    'universities.applyFilters': 'Áp dụng bộ lọc',
    'universities.resultsTitle': 'Kết quả tìm kiếm',
    'universities.found':
        'Tìm thấy {total} trường đại học{searchPart} · trang {page}/{totalPages}',
    'universities.foundSearchPart': ' cho "{search}"',
    'universities.filterCombo': 'Khối {combo}',
    'universities.filterScore': 'Điểm ≤ {score}',
    'universities.filterMajor': 'Ngành: {name}',
    'universities.filterTuition': 'Học phí ≤ {value}',
    'universities.filtersShort': 'Bộ lọc',
    'universities.sortBest': 'Sắp xếp: Phù hợp nhất',
    'universities.sortAz': 'Tên A–Z',
    'universities.compare': 'So sánh',
    'universities.viewCutoff': 'Xem điểm chuẩn',
    'universities.details': 'Chi tiết',
    'universities.askAi': 'Hỏi AI',
    'universities.prev': '← Trước',
    'universities.next': 'Sau →',
    'universities.aiBadge': 'GỢI Ý TỪ AI',
    'universities.aiBanner':
        'Chưa tìm thấy trường phù hợp? Hãy thử chatbot — mô tả điểm số và ngành bạn quan tâm để nhận gợi ý.',
    'universities.aiCta': 'Bắt đầu tư vấn ngay',
    'universities.filterDialogLabel': 'Bộ lọc tìm kiếm',
    'universities.closeFilters': 'Đóng bộ lọc',
    'universities.close': 'Đóng',
    'universities.comparing': 'Đang so sánh {count} trường',
    'universities.clearAll': 'Xóa hết',
    'universities.compareNow': 'So sánh ngay',
    'universities.hanoi': 'Hà Nội',
    'universities.tuitionPerYear': '{value} triệu/năm',
} as const;

const en: Record<keyof typeof vi, string> = {
    'nav.home': 'Home',
    'nav.search': 'Search',
    'nav.majors': 'Majors',
    'nav.cutoff': 'Cutoff scores',
    'nav.chatbot': 'AI advisor',
    'nav.searchPlaceholder': 'Search universities...',
    'nav.login': 'Log in',
    'nav.register': 'Sign up',
    'nav.logout': 'Log out',
    'nav.backToLanding': '← Back to landing',

    'footer.tagline':
        'Helps Hanoi high-school students explore universities, majors, and cutoff scores — with recommendations matched to ability, interests, and budget.',
    'footer.start': 'GET STARTED',
    'footer.explore': 'EXPLORE',
    'footer.support': 'SUPPORT',
    'footer.features': 'FEATURES',
    'footer.register': 'Create an account',
    'footer.searchUnis': 'Search universities',
    'footer.exploreMajors': 'Explore majors',
    'footer.cutoff': 'Cutoff scores 2023–2025',
    'footer.scope': 'Scope: Hanoi',
    'footer.cutoffYears': 'Cutoff scores 2023–2025',
    'footer.featureSearch': 'University & major search',
    'footer.featureCutoff': 'Cutoff scores by school',
    'footer.featureChatbot': 'AI advisor chatbot',
    'footer.featureCompare': 'Compare universities',
    'footer.copyright': '© {year} UniGuide AI. Transparent university guidance for Gen Z.',

    'home.heroTitle': 'Shape your future with artificial intelligence.',
    'home.heroSubtitle':
        'Discover universities that fit your ability and passion — view cutoff scores, tuition, and programs in Hanoi (2023–2025).',
    'home.searchPlaceholder': 'University or major name...',
    'home.searchNow': 'Search',
    'home.cutoffTitle': 'Cutoff scores 2023–2025',
    'home.cutoffDesc':
        'Find a school and view cutoff tables by major and admission method.',
    'home.cutoffLink': 'Browse cutoff scores →',
    'home.unisTitle': 'Search universities',
    'home.unisDesc':
        'Browse Hanoi universities with tuition and yearly cutoff scores.',
    'home.majorsTitle': 'Explore majors',
    'home.majorsDesc':
        'Explore majors, career paths, and training institutions.',
    'home.bannerTitle': 'Cutoff scores 2023–2025',
    'home.bannerDesc':
        'View cutoff scores by school, major, and admission method — recent years included.',
    'home.recommend': 'University & major suggestions',
    'home.viewScores': 'View score tables',
    'home.aiAdvisor': 'AI advisor',
    'home.featuredTitle': 'Featured universities',
    'home.featuredMajorsEyebrow': 'Career trends',
    'home.featuredMajorsTitle': 'Featured majors',
    'home.featuredMajorsSubtitle':
        'Twelve industry groups picked from labor-market demand and growth outlook — explore directions before choosing a school.',
    'home.featuredMajorsViewAll': 'Browse all majors →',
    'home.featuredMajorsSample': 'Representative majors',
    'home.featuredMajorsBrowse': 'Search majors',
    'home.featuredMajorsSuggest': 'Get suggestions',
    'home.viewAll': 'View all →',
    'home.hanoi': 'Hanoi',
    'home.hanoiCountry': 'Hanoi, Vietnam',
    'home.schoolDetail': 'School details',
    'home.chatbotTeaser':
        'Ask the chatbot about schools, majors, cutoff scores, and tuition — clear answers in plain language.',
    'home.chatbotCta': 'Start advising now',

    'universities.filtersTitle': 'Search filters',
    'universities.subjectLabel': 'Subject group',
    'universities.majorLabel': 'Major',
    'universities.majorHint': 'pick from the list',
    'universities.scoreLabel': 'Expected score',
    'universities.scorePlaceholder': 'e.g. 24',
    'universities.scoreHint':
        'Your expected score (0–30). Filters schools with majors matching your subject group and latest cutoff (2023–2025) ≤ this score.',
    'universities.tuitionOptional': 'Tuition (optional)',
    'universities.tuitionMin': '5M',
    'universities.tuitionMax': '80M',
    'universities.tuitionMaxLabel': 'Max: {value}',
    'universities.scopeNote': 'Currently scoped to Hanoi.',
    'universities.applying': 'Applying…',
    'universities.applyFilters': 'Apply filters',
    'universities.resultsTitle': 'Search results',
    'universities.found':
        'Found {total} universities{searchPart} · page {page}/{totalPages}',
    'universities.foundSearchPart': ' for "{search}"',
    'universities.filterCombo': 'Group {combo}',
    'universities.filterScore': 'Score ≤ {score}',
    'universities.filterMajor': 'Major: {name}',
    'universities.filterTuition': 'Tuition ≤ {value}',
    'universities.filtersShort': 'Filters',
    'universities.sortBest': 'Sort: Best match',
    'universities.sortAz': 'Name A–Z',
    'universities.compare': 'Compare',
    'universities.viewCutoff': 'View cutoff scores',
    'universities.details': 'Details',
    'universities.askAi': 'Ask AI',
    'universities.prev': '← Previous',
    'universities.next': 'Next →',
    'universities.aiBadge': 'AI SUGGESTION',
    'universities.aiBanner':
        'No good match yet? Try the chatbot — describe your score and interests for tailored suggestions.',
    'universities.aiCta': 'Start advising now',
    'universities.filterDialogLabel': 'Search filters',
    'universities.closeFilters': 'Close filters',
    'universities.close': 'Close',
    'universities.comparing': 'Comparing {count} schools',
    'universities.clearAll': 'Clear all',
    'universities.compareNow': 'Compare now',
    'universities.hanoi': 'Hanoi',
    'universities.tuitionPerYear': '{value}M/year',
};

export type TranslationKey = keyof typeof vi;

export const translations: Record<Locale, Record<TranslationKey, string>> = {
    vi,
    en,
};

export function translate(
    locale: Locale,
    key: TranslationKey,
    params?: Record<string, string | number>,
): string {
    let text = translations[locale][key] ?? translations.vi[key] ?? key;
    if (params) {
        for (const [name, value] of Object.entries(params)) {
            text = text.replace(`{${name}}`, String(value));
        }
    }
    return text;
}
