import getPeriodDifference, { convertListOfDaysToPeriods, getPeriodsAsListOfDays } from './getPeriodDifference';
import { periodeIncludesDate } from './utils';

describe('getPeriodsAsListOfDays', () => {
  it('should return a list of date strings based on a provided list of periods', () => {
    const period1 = { fom: '2032-01-01', tom: '2032-01-02' };
    const period2 = { fom: '2032-01-05', tom: '2032-01-07' };

    const result = getPeriodsAsListOfDays([period1, period2]);
    expect(result.length).toBe(5);

    result.forEach(date => expect(periodeIncludesDate(period1, date) || periodeIncludesDate(period2, date)).toBe(true));
  });

  it('should not return any duplicate dates', () => {
    const period1 = { fom: '2032-01-01', tom: '2032-01-02' };
    const period2 = { fom: '2032-01-02', tom: '2032-01-03' };

    const result = getPeriodsAsListOfDays([period1, period2]);
    const numDuplicates = result.filter(day => day === '2032-01-02').length;
    expect(numDuplicates).toBe(1);
  });

  it('should not return days that are only inbetween two periods', () => {
    const period1 = { fom: '2032-01-01', tom: '2032-01-01' };
    const period2 = { fom: '2032-01-03', tom: '2032-01-03' };
    const result = getPeriodsAsListOfDays([period1, period2]);
    const dayInbetween = result.find(day => day === '2032-01-02');
    expect(dayInbetween).toBeUndefined();
  });
});

describe('convertListOfDaysToPeriods', () => {
  it('should return a list of Periods based on a provided list of consecutive date strings', () => {
    const days = ['2032-01-01', '2032-01-02', '2032-01-03', '2032-01-05', '2032-01-07'];
    const result = convertListOfDaysToPeriods(days);
    expect(result.length).toBe(3);

    expect(periodeIncludesDate(result[0]!, '2032-01-01')).toBe(true);
    expect(periodeIncludesDate(result[0]!, '2032-01-02')).toBe(true);
    expect(periodeIncludesDate(result[0]!, '2032-01-03')).toBe(true);

    expect(periodeIncludesDate(result[1]!, '2032-01-05')).toBe(true);
    expect(periodeIncludesDate(result[2]!, '2032-01-07')).toBe(true);
  });
});

describe('periodDifference', () => {
  it('should return basePeriods with days included in periodsToExclude removed', () => {
    const basePeriods = [{ fom: '2032-01-01', tom: '2032-01-05' }];
    const periodsToExclude = [{ fom: '2032-01-04', tom: '2032-01-07' }];
    const result = getPeriodDifference(basePeriods, periodsToExclude);
    expect(result.length).toBe(1);
    expect(result[0]!.fom).toBe('2032-01-01');
    expect(result[0]!.tom).toBe('2032-01-03');
  });
});
