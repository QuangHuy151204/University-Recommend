import {
  filterMajorIdsBySelectionName,
  majorNameMatchesSelection,
  majorsRelatedForUniversityFilter,
} from './major-name-match';

describe('majorNameMatchesSelection', () => {
  it('matches exact and program variants of CNTT', () => {
    const selected = 'Công nghệ Thông tin';
    expect(
      majorNameMatchesSelection('Công nghệ Thông tin (Việt-Pháp)', selected),
    ).toBe(true);
    expect(
      majorNameMatchesSelection('Công nghệ thông tin - Truyền thông', selected),
    ).toBe(true);
    expect(
      majorNameMatchesSelection(
        'Hệ thống thông tin (Công nghệ thông tin)',
        selected,
      ),
    ).toBe(true);
    expect(majorNameMatchesSelection('Kế toán', selected)).toBe(false);
  });

  it('filterMajorIdsBySelectionName returns all variant ids', () => {
    const ids = filterMajorIdsBySelectionName(
      [
        { id: 234, name: 'Công nghệ Thông tin' },
        { id: 238, name: 'Công nghệ Thông tin (Việt-Pháp)' },
        { id: 100, name: 'Kế toán' },
      ],
      'Công nghệ Thông tin',
    );
    expect(ids.sort()).toEqual([234, 238]);
  });
});

describe('majorsRelatedForUniversityFilter', () => {
  it('links CNTT and Hệ thống thông tin via shared field group token', () => {
    expect(
      majorsRelatedForUniversityFilter(
        'Hệ thống thông tin',
        'Công nghệ Thông tin',
      ),
    ).toBe(true);
    expect(
      majorsRelatedForUniversityFilter(
        'Công nghệ Thông tin',
        'Hệ thống thông tin',
      ),
    ).toBe(true);
  });

  it('does not link unrelated majors in the same broad business group', () => {
    expect(
      majorsRelatedForUniversityFilter('Kế toán', 'Quản trị Kinh doanh'),
    ).toBe(false);
    expect(majorsRelatedForUniversityFilter('Marketing', 'Kế toán')).toBe(
      false,
    );
  });

  it('links kinh tế / marketing siblings and finance / kế toán siblings', () => {
    expect(
      majorsRelatedForUniversityFilter('Marketing', 'Quản trị Kinh doanh'),
    ).toBe(true);
    expect(
      majorsRelatedForUniversityFilter('Kế toán', 'Tài chính Ngân hàng'),
    ).toBe(true);
    expect(majorsRelatedForUniversityFilter('Y khoa', 'Dược')).toBe(true);
  });

  it('filterMajorIdsBySelectionName includes HTTT when CNTT is selected', () => {
    const ids = filterMajorIdsBySelectionName(
      [
        { id: 234, name: 'Công nghệ Thông tin' },
        { id: 301, name: 'Hệ thống thông tin' },
        { id: 100, name: 'Kế toán' },
      ],
      'Công nghệ Thông tin',
    );
    expect(ids.sort()).toEqual([234, 301]);
  });
});
