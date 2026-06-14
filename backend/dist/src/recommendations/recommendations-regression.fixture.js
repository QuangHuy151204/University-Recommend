"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXPECTED_B01_CNTT_25_RANKING = exports.EXPECTED_A00_SUPHAM_TOAN_25_RANKING = exports.CANONICAL_SUPHAM_TOAN_REQUEST = exports.CANONICAL_RECOMMEND_REQUEST = void 0;
exports.buildA00SuphamToanRegressionFixture = buildA00SuphamToanRegressionFixture;
exports.buildB01CnttRegressionFixture = buildB01CnttRegressionFixture;
exports.CANONICAL_RECOMMEND_REQUEST = {
    expected_score: 25,
    subject_combination: 'B01',
    interests: 'CNTT',
};
exports.CANONICAL_SUPHAM_TOAN_REQUEST = {
    expected_score: 25,
    subject_combination: 'A00',
    interests: 'Sư phạm Toán học',
};
exports.EXPECTED_A00_SUPHAM_TOAN_25_RANKING = [
    {
        short_name: 'HNMU',
        majorKeyword: 'sư phạm toán',
        matchScore: 58,
        admissionTier: 'reach',
        referenceCutoff: 27.34,
    },
    {
        short_name: 'HNUE',
        majorKeyword: 'sư phạm toán',
        matchScore: 58,
        admissionTier: 'reach',
        referenceCutoff: 28.27,
    },
    {
        short_name: 'VNU-UED',
        majorKeyword: 'sư phạm toán',
        matchScore: 48,
        admissionTier: 'reach',
        referenceCutoff: 26.58,
    },
];
exports.EXPECTED_B01_CNTT_25_RANKING = [
    {
        short_name: 'HUST',
        majorKeyword: 'công nghệ thông tin',
        matchScore: 93,
        admissionTier: 'safety',
        referenceCutoff: 24,
    },
    {
        short_name: 'PTIT',
        majorKeyword: 'cntt',
        matchScore: 73,
        admissionTier: 'match',
        referenceCutoff: 26,
    },
    {
        short_name: 'HUMG',
        majorKeyword: 'công nghệ thông tin',
        matchScore: 58,
        admissionTier: 'reach',
        referenceCutoff: 28,
    },
];
function cutoff(id, year, score, combo) {
    return {
        id,
        year,
        score,
        subject_combination: combo,
        admission_method: 'THPT Quốc gia',
        note: null,
        created_at: new Date(),
    };
}
function uni(id, short_name, name, location) {
    return {
        id,
        short_name,
        name,
        location,
        type: 'public',
        tuition_fee_min: 20_000_000,
        tuition_fee_max: 35_000_000,
    };
}
function major(id, name, field_group) {
    return {
        id,
        name,
        field_group,
        career_orientation: 'Lập trình viên, kỹ sư phần mềm',
    };
}
function um(id, university, majorEntity, cutoffs) {
    return {
        id,
        university,
        major: majorEntity,
        cutoffScores: cutoffs,
        tuition_fee: 25_000_000,
    };
}
function buildA00SuphamToanRegressionFixture() {
    const vnuUed = uni(10, 'VNU-UED', 'Trường Đại học Giáo dục, Đại học Quốc gia Hà Nội', 'Hà Nội');
    const hnmu = uni(11, 'HNMU', 'Trường Đại học Thủ đô Hà Nội', 'Hà Nội');
    const hnue = uni(12, 'HNUE', 'Trường Đại học Sư phạm Hà Nội', 'Hà Nội');
    const hust = uni(1, 'HUST', 'Đại học Bách khoa Hà Nội', 'Hà Nội');
    const spToanUed = major(10, 'Sư phạm Toán và Khoa học Tự nhiên', 'Giáo dục');
    const spToanHnmu = major(11, 'Sư phạm Toán học', 'Giáo dục');
    const spToanHnue = major(12, 'Sư phạm Toán học', 'Giáo dục');
    const keToan = major(13, 'Kế toán', 'Kinh tế');
    return [
        um(201, vnuUed, spToanUed, [cutoff(10, 2024, 26.58, 'A00')]),
        um(202, hnmu, spToanHnmu, [cutoff(11, 2025, 27.34, 'A00')]),
        um(203, hnue, spToanHnue, [cutoff(12, 2025, 28.27, 'A00')]),
        um(204, hust, keToan, [cutoff(13, 2025, 24.5, 'A00')]),
    ];
}
function buildB01CnttRegressionFixture() {
    const hust = uni(1, 'HUST', 'Đại học Bách khoa Hà Nội', 'Hà Nội');
    const ptit = uni(2, 'PTIT', 'Học viện Công nghệ Bưu chính Viễn thông', 'Hà Nội');
    const humg = uni(3, 'HUMG', 'Trường Đại học Mỏ - Địa chất', 'Hà Nội');
    const neu = uni(4, 'NEU', 'Đại học Kinh tế Quốc dân', 'Hà Nội');
    const rmit = uni(5, 'RMIT', 'RMIT Vietnam', 'TP.HCM');
    const cnttHust = major(1, 'Công nghệ thông tin', 'CNTT');
    const cnttPtit = major(2, 'CNTT', 'CNTT');
    const cnttHumg = major(3, 'Công nghệ thông tin', 'CNTT');
    const kinhTe = major(4, 'Kinh tế', 'Kinh tế');
    return [
        um(101, hust, cnttHust, [cutoff(1, 2025, 24, 'B01')]),
        um(102, ptit, cnttPtit, [cutoff(2, 2025, 26, 'B01')]),
        um(103, humg, cnttHumg, [cutoff(3, 2025, 28, 'B01')]),
        um(104, neu, kinhTe, [cutoff(4, 2025, 23, 'B01')]),
        um(105, rmit, cnttHust, [cutoff(5, 2025, 20, 'B01')]),
    ];
}
//# sourceMappingURL=recommendations-regression.fixture.js.map