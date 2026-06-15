import { CutoffScore } from '../cutoff-scores/cutoff-score.entity';
import { Major } from '../majors/major.entity';
import { UniversityMajor } from '../majors/university-major.entity';
import { University } from '../universities/university.entity';
import { RecommendRequestDto } from './recommendation.dto';
import type { AdmissionTier } from './recommendation.response';

/** Input chuẩn regression — đổi trọng số trong calculateMatchScore thì cập nhật EXPECTED_* bên dưới. */
export const CANONICAL_RECOMMEND_REQUEST: RecommendRequestDto = {
  expected_score: 25,
  subject_combination: 'B01',
  interests: 'CNTT',
};

export type ExpectedRankingRow = {
  short_name: string;
  majorKeyword: string;
  matchScore: number;
  admissionTier: AdmissionTier;
  referenceCutoff: number;
};

/**
 * Thứ hạng kỳ vọng với trọng số hiện tại (điểm 35% / sở thích 30% / khu vực 15% / tài chính 15% / nghề 5%).
 * Không chọn phường: khu vực +10 (trung tính), tài chính +10, nghề +3.
 * Fixture tổng hợp — không phụ thuộc PostgreSQL import.
 */
export const CANONICAL_SUPHAM_TOAN_REQUEST: RecommendRequestDto = {
  expected_score: 25,
  subject_combination: 'A00',
  interests: 'Sư phạm Toán học',
};

export const EXPECTED_A00_SUPHAM_TOAN_25_RANKING: ExpectedRankingRow[] = [
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

export const EXPECTED_B01_CNTT_25_RANKING: ExpectedRankingRow[] = [
  {
    short_name: 'HUST',
    majorKeyword: 'công nghệ thông tin',
    matchScore: 88,
    admissionTier: 'safety',
    referenceCutoff: 24,
  },
  {
    short_name: 'PTIT',
    majorKeyword: 'cntt',
    matchScore: 68,
    admissionTier: 'match',
    referenceCutoff: 26,
  },
  {
    short_name: 'HUMG',
    majorKeyword: 'công nghệ thông tin',
    matchScore: 53,
    admissionTier: 'reach',
    referenceCutoff: 28,
  },
];

function cutoff(
  id: number,
  year: number,
  score: number,
  combo: string,
): CutoffScore {
  return {
    id,
    year,
    score,
    subject_combination: combo,
    admission_method: 'THPT Quốc gia',
    note: null,
    created_at: new Date(),
  } as unknown as CutoffScore;
}

function uni(
  id: number,
  short_name: string,
  name: string,
  location: string,
): University {
  return {
    id,
    short_name,
    name,
    location,
    type: 'public',
    tuition_fee_min: 20_000_000,
    tuition_fee_max: 35_000_000,
  } as unknown as University;
}

function major(id: number, name: string, field_group: string): Major {
  return {
    id,
    name,
    field_group,
    career_orientation: 'Lập trình viên, kỹ sư phần mềm',
  } as unknown as Major;
}

function um(
  id: number,
  university: University,
  majorEntity: Major,
  cutoffs: CutoffScore[],
): UniversityMajor {
  return {
    id,
    university,
    major: majorEntity,
    cutoffScores: cutoffs,
    tuition_fee: 25_000_000,
  } as unknown as UniversityMajor;
}

/** Bộ dữ liệu tối thiểu cho case 25 điểm / A00 / Sư phạm Toán học. */
export function buildA00SuphamToanRegressionFixture(): UniversityMajor[] {
  const vnuUed = uni(
    10,
    'VNU-UED',
    'Trường Đại học Giáo dục, Đại học Quốc gia Hà Nội',
    'Hà Nội',
  );
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

/** Bộ dữ liệu tối thiểu cho case 25 điểm / B01 / CNTT. */
export function buildB01CnttRegressionFixture(): UniversityMajor[] {
  const hust = uni(1, 'HUST', 'Đại học Bách khoa Hà Nội', 'Hà Nội');
  const ptit = uni(
    2,
    'PTIT',
    'Học viện Công nghệ Bưu chính Viễn thông',
    'Hà Nội',
  );
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
