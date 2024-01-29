import { prettifyDateString } from '../format';
import initializeDate from '../initialize';
import dateSorter, { dateStringSorter } from '../sort';

describe('Sort tests', () => {
  it('should sort dates', () => {
    const periods = [
      initializeDate('2032-01-10'),
      initializeDate('2032-01-01'),
      initializeDate('2032-01-06'),
      initializeDate('2032-01-16'),
      initializeDate('2032-01-16'),
    ];
    const result = [
      initializeDate('2032-01-01'),
      initializeDate('2032-01-06'),
      initializeDate('2032-01-10'),
      initializeDate('2032-01-16'),
      initializeDate('2032-01-16'),
    ];
    expect(periods.sort(dateSorter)).toEqual(result);
  });

  it('should sort date strings', () => {
    const periods = ['2032-01-10', '2032-01-01', '2032-01-06', '2032-01-16', '2032-01-16'];
    const result = ['2032-01-01', '2032-01-06', '2032-01-10', '2032-01-16', '2032-01-16'];
    expect(periods.sort(dateStringSorter)).toEqual(result);
  });
});
