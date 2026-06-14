import {
  canonicalFieldGroup,
  canonicalMajorName,
  groupToSlug,
  majorMatchesGroupSlug,
  normalizeGroupSlug,
  resolveGroupSlug,
} from './major-normalization';
import { classifyMajor } from './major-classification';

describe('major-normalization', () => {
  it('canonicalFieldGroup maps An toàn thông tin before CNTT', () => {
    expect(canonicalFieldGroup('An toàn thông tin', null)).toBe(
      'An toàn thông tin',
    );
    expect(canonicalFieldGroup('An ninh mạng', null)).toBe('An toàn thông tin');
    expect(canonicalFieldGroup('Công nghệ thông tin', null)).toBe(
      'Công nghệ thông tin',
    );
    expect(canonicalFieldGroup('Phần mềm', 'Khác')).toBe('Công nghệ thông tin');
  });

  it('classifyMajor separates IT security from law enforcement', () => {
    const cyber = classifyMajor('An toàn thông tin', null);
    expect(cyber.group_ids).toContain('an-toan-thong-tin');
    expect(cyber.group_ids).not.toContain('an-ninh-quoc-phong');

    const police = classifyMajor(
      'Ngành An ninh mạng và phòng chống tội phạm công nghệ cao',
      null,
    );
    expect(police.group_ids).toContain('an-ninh-quoc-phong');
    expect(police.group_ids).not.toContain('an-toan-thong-tin');

    const border = classifyMajor('Biên phòng (Quân khu 4)', null);
    expect(border.group_ids).toEqual(['an-ninh-quoc-phong']);
  });

  it('canonicalFieldGroup maps Nông nghiệp and Hóa học - Sinh học', () => {
    expect(canonicalFieldGroup('Thủy sản', null)).toBe('Nông nghiệp');
    expect(canonicalFieldGroup('Sinh học', null)).toBe('Hóa học - Sinh học');
  });

  it('groupToSlug and resolveGroupSlug round-trip', () => {
    expect(groupToSlug('An toàn thông tin')).toBe('an-toan-thong-tin');
    expect(groupToSlug('Du lịch - Dịch vụ')).toBe('du-lich-dich-vu');
    expect(resolveGroupSlug('an-toan-thong-tin')).toBe('An toàn thông tin');
    expect(resolveGroupSlug('du-lich-dich-vu')).toBe('Du lịch - Dịch vụ');
    expect(resolveGroupSlug('unknown-slug')).toBeNull();
  });

  it('normalizeGroupSlug collapses legacy triple-dash slugs', () => {
    expect(normalizeGroupSlug('hoa-hoc---sinh-hoc')).toBe('hoa-hoc-sinh-hoc');
    expect(majorMatchesGroupSlug('Sinh học', null, 'hoa-hoc---sinh-hoc')).toBe(
      true,
    );
  });

  it('majorMatchesGroupSlug matches legacy field_group labels', () => {
    expect(
      majorMatchesGroupSlug(
        'Chương trình X',
        'Công nghệ',
        'cong-nghe-thong-tin',
      ),
    ).toBe(true);
  });

  it('canonicalFieldGroup keeps explicit group when no keyword match', () => {
    expect(canonicalFieldGroup('Văn học', 'Ngôn ngữ - Xã hội')).toBe(
      'Ngôn ngữ - Xã hội',
    );
  });

  it('canonicalFieldGroup maps aerospace / satellite majors', () => {
    expect(
      canonicalFieldGroup('Khoa học Vũ trụ và Công nghệ Vệ tinh', 'Khác'),
    ).toBe('Khoa học vũ trụ - Hàng không');
  });

  it('canonicalFieldGroup falls back to Khác', () => {
    expect(canonicalFieldGroup('Chương trình đặc thù', null)).toBe('Khác');
  });

  it('canonicalFieldGroup maps insurance, CNKT, and military majors', () => {
    expect(canonicalFieldGroup('Bảo hiểm', 'Khác')).toBe(
      'Kinh tế - Kinh doanh',
    );
    expect(canonicalFieldGroup('CNKT Cơ điện tử', 'Khác')).toBe(
      'Kỹ thuật - Công nghiệp',
    );
    expect(canonicalFieldGroup('Biên phòng (Quân khu 4)', 'Khác')).toBe(
      'An ninh - Quốc phòng',
    );
    expect(canonicalFieldGroup('Bác sĩ đa khoa', 'Khác')).toBe(
      'Y dược - Sức khỏe',
    );
    expect(canonicalFieldGroup('Công nghệ bán dẫn', 'Khác')).toBe(
      'Kỹ thuật - Công nghiệp',
    );
  });

  it('canonicalMajorName normalizes diacritics', () => {
    expect(canonicalMajorName('Ngôn ngữ Anh')).toBe(
      canonicalMajorName('Ngon ngu Anh'),
    );
  });

  it('canonicalFieldGroup normalizes đ and punctuation in major names', () => {
    expect(
      canonicalFieldGroup('Điều dưỡng chương trình tiên tiến', 'Khác'),
    ).toBe('Y dược - Sức khỏe');
    expect(canonicalFieldGroup('Công nghệ Dệt - May', 'Khác')).toBe(
      'Kỹ thuật - Công nghiệp',
    );
    expect(canonicalFieldGroup('Tâm lí học', 'Khác')).toBe('Ngôn ngữ - Xã hội');
    expect(canonicalFieldGroup('QHS03', 'Khác')).toBe('Ngôn ngữ - Xã hội');
  });

  it('classifies former Khác majors into canonical groups', () => {
    const cases: Array<[string, string]> = [
      ['Bất động sản', 'Kinh tế - Kinh doanh'],
      ['Quan hệ quốc tế', 'Ngôn ngữ - Xã hội'],
      ['Quản lý thông tin', 'Công nghệ thông tin'],
      ['Quản lý bệnh viện', 'Y dược - Sức khỏe'],
      ['Công nghệ chế biến lâm sản', 'Nông nghiệp'],
      ['Địa tin học', 'Ngôn ngữ - Xã hội'],
      ['Biến đổi khí hậu và Phát triển bền vững', 'Kỹ thuật - Công nghiệp'],
      ['Gốm', 'Kiến trúc - Thiết kế'],
      ['Thư viện và thiết bị trường học', 'Giáo dục - Sư phạm'],
      ['POHE-Quản lý thị trường', 'Kinh tế - Kinh doanh'],
    ];
    for (const [name, expected] of cases) {
      expect(canonicalFieldGroup(name, 'Khác')).toBe(expected);
    }
  });
});
