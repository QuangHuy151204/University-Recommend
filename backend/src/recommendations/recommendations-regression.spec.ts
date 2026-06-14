import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AdmissionMethodsService } from '../admission-methods/admission-methods.service';
import { CutoffScore } from '../cutoff-scores/cutoff-score.entity';
import { UniversityMajor } from '../majors/university-major.entity';
import { Recommendation } from './recommendation.entity';
import {
  buildA00SuphamToanRegressionFixture,
  buildB01CnttRegressionFixture,
  CANONICAL_RECOMMEND_REQUEST,
  CANONICAL_SUPHAM_TOAN_REQUEST,
  EXPECTED_A00_SUPHAM_TOAN_25_RANKING,
  EXPECTED_B01_CNTT_25_RANKING,
} from './recommendations-regression.fixture';
import { RecommendationsService } from './recommendations.service';

describe('recommendations regression (canonical 25 / B01 / CNTT)', () => {
  let service: RecommendationsService;
  const fixture = buildB01CnttRegressionFixture();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecommendationsService,
        {
          provide: getRepositoryToken(Recommendation),
          useValue: { delete: jest.fn(), create: jest.fn(), save: jest.fn() },
        },
        {
          provide: getRepositoryToken(UniversityMajor),
          useValue: {
            find: jest.fn().mockResolvedValue(fixture),
          },
        },
        {
          provide: getRepositoryToken(CutoffScore),
          useValue: {},
        },
        {
          provide: AdmissionMethodsService,
          useValue: {
            resolveLabel: jest.fn().mockResolvedValue('THPT Quốc gia'),
          },
        },
      ],
    }).compile();

    service = module.get(RecommendationsService);
  });

  it('returns ranked CNTT programs for 25 điểm / B01 / sở thích CNTT', async () => {
    const response = await service.recommend(CANONICAL_RECOMMEND_REQUEST);

    expect(response.meta.emptyReason).toBeNull();
    expect(response.results.length).toBeGreaterThanOrEqual(3);

    const topShortNames = response.results
      .slice(0, EXPECTED_B01_CNTT_25_RANKING.length)
      .map((r) => r.university.short_name);

    expect(topShortNames).toEqual(
      EXPECTED_B01_CNTT_25_RANKING.map((e) => e.short_name),
    );
  });

  it('keeps expected matchScore, tier, and reference cutoff per rank', async () => {
    const response = await service.recommend(CANONICAL_RECOMMEND_REQUEST);

    for (let i = 0; i < EXPECTED_B01_CNTT_25_RANKING.length; i++) {
      const expected = EXPECTED_B01_CNTT_25_RANKING[i];
      const actual = response.results[i];

      expect(actual.university.short_name).toBe(expected.short_name);
      expect(actual.major.name?.toLowerCase()).toContain(expected.majorKeyword);
      expect(actual.matchScore).toBe(expected.matchScore);
      expect(actual.admissionTier).toBe(expected.admissionTier);
      expect(actual.referenceCutoff).toBe(expected.referenceCutoff);
    }
  });

  it('excludes non-Hanoi universities from scope', async () => {
    const response = await service.recommend(CANONICAL_RECOMMEND_REQUEST);
    const shortNames = response.results.map((r) => r.university.short_name);
    expect(shortNames).not.toContain('RMIT');
  });

  it('filters out majors that do not match interests=CNTT', async () => {
    const response = await service.recommend(CANONICAL_RECOMMEND_REQUEST);
    const shortNames = response.results.map((r) => r.university.short_name);
    expect(shortNames).not.toContain('NEU');
    for (const row of response.results) {
      const name = (row.major.name ?? '').toLowerCase();
      const field = (row.major.field_group ?? '').toLowerCase();
      expect(name.includes('cntt') || field.includes('cntt')).toBe(true);
    }
  });

  it('matches CNTT majors when interests use synonym lập trình', async () => {
    const response = await service.recommend({
      ...CANONICAL_RECOMMEND_REQUEST,
      interests: 'lập trình',
    });

    expect(response.meta.emptyReason).toBeNull();
    expect(response.results.length).toBeGreaterThanOrEqual(3);
    for (const row of response.results) {
      const name = (row.major.name ?? '').toLowerCase();
      const field = (row.major.field_group ?? '').toLowerCase();
      expect(name.includes('cntt') || field.includes('cntt')).toBe(true);
    }
  });

  it('includes score trend reason when multi-year cutoffs exist', async () => {
    const fixture = buildB01CnttRegressionFixture().map((um) => {
      if (um.university?.short_name !== 'HUST') return um;
      return {
        ...um,
        cutoffScores: [
          {
            id: 1,
            year: 2023,
            score: 22,
            subject_combination: 'B01',
            admission_method: 'THPT Quốc gia',
          },
          {
            id: 2,
            year: 2024,
            score: 23,
            subject_combination: 'B01',
            admission_method: 'THPT Quốc gia',
          },
          {
            id: 3,
            year: 2025,
            score: 24,
            subject_combination: 'B01',
            admission_method: 'THPT Quốc gia',
          },
        ],
      };
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecommendationsService,
        {
          provide: getRepositoryToken(Recommendation),
          useValue: { delete: jest.fn(), create: jest.fn(), save: jest.fn() },
        },
        {
          provide: getRepositoryToken(UniversityMajor),
          useValue: { find: jest.fn().mockResolvedValue(fixture) },
        },
        {
          provide: getRepositoryToken(CutoffScore),
          useValue: {},
        },
        {
          provide: AdmissionMethodsService,
          useValue: {
            resolveLabel: jest.fn().mockResolvedValue('THPT Quốc gia'),
          },
        },
      ],
    }).compile();

    const isolated = module.get(RecommendationsService);
    const response = await isolated.recommend(CANONICAL_RECOMMEND_REQUEST);
    const hust = response.results.find(
      (r) => r.university.short_name === 'HUST',
    );

    expect(hust).toBeDefined();
    expect(
      hust!.reason.some((r) => r.includes('2023') && r.includes('2025')),
    ).toBe(true);
  });

  it('returns no_subject_combination when B01 has no matching programs', async () => {
    const onlyA00 = fixture.map((um) => ({
      ...um,
      cutoffScores: um.cutoffScores.map((c) => ({
        ...c,
        subject_combination: 'A00',
      })),
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecommendationsService,
        {
          provide: getRepositoryToken(Recommendation),
          useValue: { delete: jest.fn(), create: jest.fn(), save: jest.fn() },
        },
        {
          provide: getRepositoryToken(UniversityMajor),
          useValue: { find: jest.fn().mockResolvedValue(onlyA00) },
        },
        {
          provide: getRepositoryToken(CutoffScore),
          useValue: {},
        },
        {
          provide: AdmissionMethodsService,
          useValue: {
            resolveLabel: jest.fn().mockResolvedValue('THPT Quốc gia'),
          },
        },
      ],
    }).compile();

    const isolated = module.get(RecommendationsService);
    const response = await isolated.recommend(CANONICAL_RECOMMEND_REQUEST);

    expect(response.results).toHaveLength(0);
    expect(response.meta.emptyReason).toBe('no_subject_combination');
  });
});

describe('recommendations regression (25 / A00 / Sư phạm Toán học)', () => {
  let service: RecommendationsService;
  const fixture = buildA00SuphamToanRegressionFixture();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecommendationsService,
        {
          provide: getRepositoryToken(Recommendation),
          useValue: { delete: jest.fn(), create: jest.fn(), save: jest.fn() },
        },
        {
          provide: getRepositoryToken(UniversityMajor),
          useValue: {
            find: jest.fn().mockResolvedValue(fixture),
          },
        },
        {
          provide: getRepositoryToken(CutoffScore),
          useValue: {},
        },
        {
          provide: AdmissionMethodsService,
          useValue: {
            resolveLabel: jest.fn().mockResolvedValue('THPT Quốc gia'),
          },
        },
      ],
    }).compile();

    service = module.get(RecommendationsService);
  });

  it('returns pedagogy math programs, not unrelated majors like Kế toán', async () => {
    const response = await service.recommend(CANONICAL_SUPHAM_TOAN_REQUEST);

    expect(response.meta.emptyReason).toBeNull();
    expect(response.results.length).toBeGreaterThanOrEqual(2);

    const shortNames = response.results.map((r) => r.university.short_name);
    expect(shortNames).not.toContain('HUST');

    for (const row of response.results) {
      const name = (row.major.name ?? '').toLowerCase();
      expect(name.includes('sư phạm') || name.includes('su pham')).toBe(true);
      expect(name.includes('toán') || name.includes('toan')).toBe(true);
    }
  });

  it('keeps expected ranking for VNU-UED / HNMU / HNUE', async () => {
    const response = await service.recommend(CANONICAL_SUPHAM_TOAN_REQUEST);

    const topShortNames = response.results
      .slice(0, EXPECTED_A00_SUPHAM_TOAN_25_RANKING.length)
      .map((r) => r.university.short_name);

    expect(topShortNames).toEqual(
      EXPECTED_A00_SUPHAM_TOAN_25_RANKING.map((e) => e.short_name),
    );
  });
});
