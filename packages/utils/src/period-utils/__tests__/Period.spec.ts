import Period from '../Period';

const firstDayOf2028 = '2028-01-01';
const tenthDayOf2028 = '2028-01-10';
const first10DaysOf2028 = new Period(firstDayOf2028, tenthDayOf2028);

const lastDayOf2027 = '2027-12-31';
const secondDayOf2028 = '2028-01-02';
const fifthDayOf2028 = '2028-01-05';
const ninthDayOf2028 = '2028-01-09';
const eleventhDayOf2028 = '2028-01-11';

describe('Period tests', () => {
  describe('prettifyPeriod', () => {
    it('should prettify the period on the format DD.MM.YYYY - DD.MM.YYYY', () => {
      const prettifiedPeriod = first10DaysOf2028.prettifyPeriod();
      expect(prettifiedPeriod).toEqual('01.01.2028 - 10.01.2028');
    });
  });

  describe('prettifyPeriodYears', () => {
    it('should prettify the period if it is within same year', () => {
      const prettifiedYear = new Period(firstDayOf2028, tenthDayOf2028).prettifyPeriodYears();
      expect(prettifiedYear).toEqual('2028');
    });
    it('should prettify the period if it spans several years', () => {
      const prettifiedYear = new Period(lastDayOf2027, fifthDayOf2028).prettifyPeriodYears();
      expect(prettifiedYear).toEqual('2027 - 2028');
    });
  });

  describe('includesDate', () => {
    it('should return true if the period includes the date in question', () => {
      expect(first10DaysOf2028.includesDate(firstDayOf2028)).toBe(true);
      expect(first10DaysOf2028.includesDate(tenthDayOf2028)).toBe(true);
      expect(first10DaysOf2028.includesDate(fifthDayOf2028)).toBe(true);
    });

    it('should return false if the date in question occurs before the period starts', () => {
      expect(first10DaysOf2028.includesDate(lastDayOf2027)).toBe(false);
    });

    it('should return false if the date in question occurs after the period ends', () => {
      expect(first10DaysOf2028.includesDate(eleventhDayOf2028)).toBe(false);
    });
  });

  describe('covers', () => {
    it('should return true if the period covers the entire period in question', () => {
      let periodInQuestion = new Period(firstDayOf2028, tenthDayOf2028);
      expect(first10DaysOf2028.covers(periodInQuestion)).toBe(true);

      periodInQuestion = new Period(secondDayOf2028, ninthDayOf2028);
      expect(first10DaysOf2028.covers(periodInQuestion)).toBe(true);
    });

    it('should return false if the period only in part covers the period in question', () => {
      let periodInQuestion = new Period(lastDayOf2027, fifthDayOf2028);
      expect(first10DaysOf2028.covers(periodInQuestion)).toBe(false);

      periodInQuestion = new Period(fifthDayOf2028, eleventhDayOf2028);
      expect(first10DaysOf2028.covers(periodInQuestion)).toBe(false);
    });

    it("should return false if the period doesn't cover the period in question at all", () => {
      let periodInQuestion = new Period(lastDayOf2027, lastDayOf2027);
      expect(first10DaysOf2028.covers(periodInQuestion)).toBe(false);

      periodInQuestion = new Period(eleventhDayOf2028, eleventhDayOf2028);
      expect(first10DaysOf2028.covers(periodInQuestion)).toBe(false);
    });
  });

  describe('overlapsLeft', () => {
    it("should return true if 'fom' of the period in question is included in the base period", () => {
      const periodInQuestion = new Period(tenthDayOf2028, eleventhDayOf2028);
      expect(first10DaysOf2028.overlapsLeft(periodInQuestion)).toBe(true);
    });
  });

  describe('overlapsRight', () => {
    it("should return true if 'tom' of the period in question is included in the base period", () => {
      const periodInQuestion = new Period(lastDayOf2027, firstDayOf2028);
      expect(first10DaysOf2028.overlapsRight(periodInQuestion)).toBe(true);
    });
  });

  describe('overlapsWith', () => {
    it('should return true if the two periods overlap in any way', () => {
      const rightOverlap = new Period(lastDayOf2027, firstDayOf2028);
      expect(first10DaysOf2028.overlapsWith(rightOverlap)).toBe(true);

      const leftOverlap = new Period(lastDayOf2027, firstDayOf2028);
      expect(first10DaysOf2028.overlapsWith(leftOverlap)).toBe(true);

      const completeOverlap = new Period(firstDayOf2028, tenthDayOf2028);
      expect(first10DaysOf2028.overlapsWith(completeOverlap)).toBe(true);

      const innerOverlap = new Period(fifthDayOf2028, fifthDayOf2028);
      expect(first10DaysOf2028.overlapsWith(innerOverlap)).toBe(true);
    });

    it('should return false if the two periods do not overlap at all', () => {
      let periodInQuestion = new Period(lastDayOf2027, lastDayOf2027);
      expect(first10DaysOf2028.overlapsWith(periodInQuestion)).toBe(false);

      periodInQuestion = new Period(eleventhDayOf2028, eleventhDayOf2028);
      expect(first10DaysOf2028.overlapsWith(periodInQuestion)).toBe(false);
    });
  });

  describe('startsBefore', () => {
    it('should return true if the base period starts before the period in question', () => {
      const periodInQuestion = new Period(secondDayOf2028, secondDayOf2028);
      expect(first10DaysOf2028.startsBefore(periodInQuestion)).toBe(true);
    });

    it('should return false if the base period does not start before the period in question', () => {
      let periodInQuestion = new Period(firstDayOf2028, firstDayOf2028);
      expect(first10DaysOf2028.startsBefore(periodInQuestion)).toBe(false);

      periodInQuestion = new Period(lastDayOf2027, firstDayOf2028);
      expect(first10DaysOf2028.startsBefore(periodInQuestion)).toBe(false);
    });
  });

  describe('endsAfter', () => {
    it('should return true if the base period ends after the period in question', () => {
      const periodInQuestion = new Period(ninthDayOf2028, ninthDayOf2028);
      expect(first10DaysOf2028.endsAfter(periodInQuestion)).toBe(true);
    });

    it('should return false if the base period does not start before the period in question', () => {
      let periodInQuestion = new Period(tenthDayOf2028, eleventhDayOf2028);
      expect(first10DaysOf2028.endsAfter(periodInQuestion)).toBe(false);

      periodInQuestion = new Period(eleventhDayOf2028, eleventhDayOf2028);
      expect(first10DaysOf2028.endsAfter(periodInQuestion)).toBe(false);
    });
  });

  describe('overlapsWithSomePeriodInList', () => {
    it('should return true if the base period overlaps with at least one of the periods specified', () => {
      const periodsInQuestion = [new Period(lastDayOf2027, lastDayOf2027), new Period(lastDayOf2027, firstDayOf2028)];
      expect(first10DaysOf2028.overlapsWithSomePeriodInList(periodsInQuestion)).toBe(true);
    });

    it('should return false if the base period overlaps none of the periods specified', () => {
      const periodsInQuestion = [
        new Period(lastDayOf2027, lastDayOf2027),
        new Period(eleventhDayOf2028, eleventhDayOf2028),
      ];
      expect(first10DaysOf2028.overlapsWithSomePeriodInList(periodsInQuestion)).toBe(false);
    });
  });

  describe('fomIsBeforeOrSameAsTom', () => {
    it('should return true if fom-date is before or same as tom-date', () => {
      expect(first10DaysOf2028.fomIsBeforeOrSameAsTom()).toBe(true);
      const oneDayPeriod = new Period(firstDayOf2028, firstDayOf2028);
      expect(oneDayPeriod.fomIsBeforeOrSameAsTom()).toBe(true);
    });

    it('should return false if tom-date is before fom-date', () => {
      const period = new Period(secondDayOf2028, firstDayOf2028);
      expect(period.fomIsBeforeOrSameAsTom()).toBe(false);
    });
  });

  describe('asListOfDays', () => {
    it('should return a list of date strings, containing one date string for each day that the period covers', () => {
      const result = first10DaysOf2028.asListOfDays();
      expect(result.length).toBe(10);
      const includesAllDates = result.every(day => first10DaysOf2028.includesDate(day));
      expect(includesAllDates).toBe(true);
    });
  });

  describe('isValid', () => {
    it('should return true so long as the fom and tom dates are valid dates', () => {
      expect(first10DaysOf2028.isValid()).toBe(true);
    });

    it('should return false if either the fom or tom date of the Period are not valid dates', () => {
      let invalidPeriodInquestion = new Period('notadate', firstDayOf2028);
      expect(invalidPeriodInquestion.isValid()).toBe(false);
      invalidPeriodInquestion = new Period(firstDayOf2028, 'notadate');
      expect(invalidPeriodInquestion.isValid()).toBe(false);
      invalidPeriodInquestion = new Period('notadate', 'notadate');
      expect(invalidPeriodInquestion.isValid()).toBe(false);
    });
  });

  describe('asInternationalPeriod', () => {
    it("should return an object containing the values of fom and tom, only named as 'from' and 'to' instead", () => {
      const internationalPeriod = first10DaysOf2028.asInternationalPeriod();
      expect(internationalPeriod).toHaveProperty('from');
      expect(internationalPeriod).toHaveProperty('to');
    });
  });

  it('should create a period with util functions', () => {
    const period = new Period('2028-01-01', '2028-01-10');
    expect(period.fomIsBeforeOrSameAsTom()).toBe(true);
    expect(period.prettifyPeriod()).toBe('01.01.2028 - 10.01.2028');

    const overlappingPeriod = new Period('2028-01-07', '2028-01-12');
    expect(period.overlapsWithSomePeriodInList([overlappingPeriod])).toBe(true);
    expect(period.overlapsRight(overlappingPeriod)).toBe(false);
    expect(period.endsAfter(overlappingPeriod)).toBe(false);
  });
});
