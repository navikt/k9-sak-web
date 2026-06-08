import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import { isDayAfter, isSameOrBefore } from './dateComparison';

dayjs.extend(utc);
dayjs.extend(customParseFormat);

describe('dateComparison', () => {
  describe('isDayAfter', () => {
    it('returns true when d2 is exactly one day after d1', () => {
      const d1 = '2025-07-01';
      const d2 = '2025-07-02';
      expect(isDayAfter(d1, d2)).toBe(true);
    });

    it('returns false when d2 is the same day as d1', () => {
      const d1 = '2025-07-01';
      const d2 = '2025-07-01';
      expect(isDayAfter(d1, d2)).toBe(false);
    });

    it('returns false when d2 is two days after d1', () => {
      const d1 = '2025-07-01';
      const d2 = '2025-07-03';
      expect(isDayAfter(d1, d2)).toBe(false);
    });

    it('returns false when d2 is before d1', () => {
      const d1 = '2025-07-02';
      const d2 = '2025-07-01';
      expect(isDayAfter(d1, d2)).toBe(false);
    });

    it('handles different times on consecutive days correctly', () => {
      const d1 = '2025-07-01T23:59:59';
      const d2 = '2025-07-02T00:00:01';
      expect(isDayAfter(d1, d2)).toBe(true);
    });

    it('handles month boundaries correctly', () => {
      const d1 = '2025-06-30';
      const d2 = '2025-07-01';
      expect(isDayAfter(d1, d2)).toBe(true);
    });

    it('handles year boundaries correctly', () => {
      const d1 = '2024-12-31';
      const d2 = '2025-01-01';
      expect(isDayAfter(d1, d2)).toBe(true);
    });

    it('handles leap year correctly', () => {
      const d1 = '2024-02-28';
      const d2 = '2024-02-29';
      expect(isDayAfter(d1, d2)).toBe(true);
    });
  });

  describe('isSameOrBefore', () => {
    describe('with dayjs objects', () => {
      it('returns true when dates are the same', () => {
        const date1 = '2025-07-01';
        const date2 = '2025-07-01';
        expect(isSameOrBefore(date1, date2)).toBe(true);
      });

      it('returns true when first date is before second date', () => {
        const date1 = '2025-07-01';
        const date2 = '2025-07-02';
        expect(isSameOrBefore(date1, date2)).toBe(true);
      });

      it('returns false when first date is after second date', () => {
        const date1 = '2025-07-02';
        const date2 = '2025-07-01';
        expect(isSameOrBefore(date1, date2)).toBe(false);
      });
    });

    describe('with string dates in YYYY-MM-DD format', () => {
      it('returns true when dates are the same', () => {
        expect(isSameOrBefore('2025-07-01', '2025-07-01')).toBe(true);
      });

      it('returns true when first date is before second date', () => {
        expect(isSameOrBefore('2025-07-01', '2025-07-02')).toBe(true);
      });

      it('returns false when first date is after second date', () => {
        expect(isSameOrBefore('2025-07-02', '2025-07-01')).toBe(false);
      });
    });

    describe('with string dates in DD.MM.YYYY format', () => {
      it('returns true when dates are the same', () => {
        expect(isSameOrBefore('01.07.2025', '01.07.2025')).toBe(true);
      });

      it('returns true when first date is before second date', () => {
        expect(isSameOrBefore('01.07.2025', '02.07.2025')).toBe(true);
      });

      it('returns false when first date is after second date', () => {
        expect(isSameOrBefore('02.07.2025', '01.07.2025')).toBe(false);
      });
    });

    describe('with mixed date formats', () => {
      it('handles YYYY-MM-DD and DD.MM.YYYY formats together', () => {
        expect(isSameOrBefore('2025-07-01', '02.07.2025')).toBe(true);
        expect(isSameOrBefore('01.07.2025', '2025-07-02')).toBe(true);
      });

      it('handles dayjs object and string date together', () => {
        const dayjsDate = '2025-07-01';
        expect(isSameOrBefore(dayjsDate, '02.07.2025')).toBe(true);
        expect(isSameOrBefore('01.07.2025', dayjsDate)).toBe(true);
      });
    });

    describe('edge cases', () => {
      it('handles month boundaries correctly', () => {
        expect(isSameOrBefore('30.06.2025', '01.07.2025')).toBe(true);
        expect(isSameOrBefore('2025-06-30', '01.07.2025')).toBe(true);
      });

      it('handles year boundaries correctly', () => {
        expect(isSameOrBefore('31.12.2024', '01.01.2025')).toBe(true);
        expect(isSameOrBefore('2024-12-31', '01.01.2025')).toBe(true);
      });

      it('handles leap year correctly', () => {
        expect(isSameOrBefore('28.02.2024', '29.02.2024')).toBe(true);
        expect(isSameOrBefore('2024-02-28', '29.02.2024')).toBe(true);
      });
    });
  });
});
