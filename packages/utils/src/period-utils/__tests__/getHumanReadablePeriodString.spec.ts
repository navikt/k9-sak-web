import Period from '../Period';
import getHumanReadablePeriodString from '../getHumanReadablePeriodString';

describe('getHumanReadablePeriodString', () => {
  it('should return a string of periods', () => {
    const singlePeriod = [new Period('2032-01-01', '2032-01-05')];
    const resultSinglePeriod = getHumanReadablePeriodString(singlePeriod);
    expect(resultSinglePeriod).toBe('01.01.2032 - 05.01.2032');

    const multiplePeriods = [new Period('2032-01-01', '2032-01-05'), new Period('2032-01-10', '2032-01-15')];
    const resultMultiplePeriods = getHumanReadablePeriodString(multiplePeriods);
    expect(resultMultiplePeriods).toBe('01.01.2032 - 05.01.2032 og 10.01.2032 - 15.01.2032');
  });
});
