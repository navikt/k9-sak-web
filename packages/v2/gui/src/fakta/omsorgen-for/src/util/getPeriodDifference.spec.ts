import getPeriodDifference from './getPeriodDifference.js';

describe('periodDifference', () => {
  it('should return basePeriods with days included in periodsToExclude removed', () => {
    const basePeriods = [{ fom: '2032-01-01', tom: '2032-01-05' }];
    const periodsToExclude = [{ fom: '2032-01-04', tom: '2032-01-07' }];
    const result = getPeriodDifference(basePeriods, periodsToExclude);
    expect(result.length).toBe(1);
    expect(result[0]!.fom).toBe('2032-01-01');
    expect(result[0]!.tom).toBe('2032-01-03');
  });

  it('should preserve gaps across multiple base periods', () => {
    const basePeriods = [
      { fom: '2032-01-01', tom: '2032-01-03' },
      { fom: '2032-01-05', tom: '2032-01-07' },
    ];
    const periodsToExclude = [
      { fom: '2032-01-02', tom: '2032-01-02' },
      { fom: '2032-01-06', tom: '2032-01-06' },
    ];

    expect(getPeriodDifference(basePeriods, periodsToExclude)).toEqual([
      { fom: '2032-01-01', tom: '2032-01-01' },
      { fom: '2032-01-03', tom: '2032-01-03' },
      { fom: '2032-01-05', tom: '2032-01-05' },
      { fom: '2032-01-07', tom: '2032-01-07' },
    ]);
  });
});
