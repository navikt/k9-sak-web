import Period from '../Period';
import sortPeriodsByFomDate from '../sortPeriodsByFomDate';

describe('sortPeriodsByFomDate', () => {
  it('should sort periods by fom date', () => {
    const periods = [
      new Period('2032-01-10', '2032-01-15'),
      new Period('2032-01-01', '2032-01-05'),
      new Period('2032-01-06', '2032-01-09'),
      new Period('2032-01-16', '2032-01-20'),
      new Period('2032-01-16', '2032-01-20'),
    ];
    const result = periods.sort(sortPeriodsByFomDate);
    expect(result).toEqual([
      new Period('2032-01-01', '2032-01-05'),
      new Period('2032-01-06', '2032-01-09'),
      new Period('2032-01-10', '2032-01-15'),
      new Period('2032-01-16', '2032-01-20'),
      new Period('2032-01-16', '2032-01-20'),
    ]);
  });
});
