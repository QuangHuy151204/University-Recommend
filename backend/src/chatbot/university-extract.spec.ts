import {
  collectUniversityNames,
  extractUniversitiesFromMessage,
  parseUniversityNameList,
} from './university-extract';

describe('university-extract', () => {
  it('parseUniversityNameList splits comma and và/với', () => {
    expect(parseUniversityNameList('USTH, HUST')).toEqual(['USTH', 'HUST']);
    expect(parseUniversityNameList('NEU và FTU')).toEqual(['NEU', 'FTU']);
    expect(parseUniversityNameList('Bách Khoa với Phenikaa')).toEqual([
      'Bách Khoa',
      'Phenikaa',
    ]);
  });

  it('extractUniversitiesFromMessage finds multiple acronyms', () => {
    expect(
      extractUniversitiesFromMessage(
        'so sánh USTH với HUST về điểm chuẩn CNTT',
      ),
    ).toEqual(expect.arrayContaining(['USTH', 'HUST']));
  });

  it('collectUniversityNames merges message and entity', () => {
    const names = collectUniversityNames(
      'so sánh USTH với HUST về CNTT',
      'NEU, FTU',
    );
    expect(names).toEqual(
      expect.arrayContaining(['USTH', 'HUST', 'NEU', 'FTU']),
    );
  });
});
