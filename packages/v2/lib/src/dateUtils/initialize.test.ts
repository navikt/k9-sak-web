import dayjs from 'dayjs';
import { describe, expect, it } from 'vitest';
import { dateToday, initializeDate } from './initializeDate';

describe('initializeDate', () => {
  it('should initialize date with default format and start of day', () => {
    const dateString = '2023-10-05';
    const result = initializeDate(dateString);
    expect(result.isSame(dayjs(dateString).utc(true).startOf('day'))).toBe(true);
  });

  it('should initialize date with custom format and start of day', () => {
    const dateString = '05.10.2023';
    const customFormat = 'DD.MM.YYYY';
    const result = initializeDate(dateString, customFormat);
    expect(result.isSame(dayjs(dateString, customFormat).utc(true).startOf('day'))).toBe(true);
  });

  it('should initialize date with strict parsing', () => {
    const dateString = '2023-10-05';
    const result = initializeDate(dateString, undefined, true);
    expect(result.isValid()).toBe(true);
  });

  it('should initialize date and keep hours and minutes', () => {
    const dateString = '2023-10-05T15:30:00Z';
    const result = initializeDate(dateString, undefined, false, true);
    expect(result.isSame(dayjs(dateString).utc(true))).toBe(true);
  });

  it('should return invalid date for incorrect format with strict parsing', () => {
    const dateString = '05-10-2023';
    const result = initializeDate(dateString, undefined, true);
    expect(result.isValid()).toBe(false);
  });
});

describe('dateToday', () => {
  it("should return today's date at start of day", () => {
    const result = dateToday();
    expect(result.isSame(dayjs().utc(true).startOf('day'))).toBe(true);
  });
});
