import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import { Period } from '../types/Period';

const dateFormats = ['YYYY-MM-DD', 'DD.MM.YYYY'];

dayjs.extend(utc);
dayjs.extend(customParseFormat);

export function isSameOrBefore(date, otherDate) {
  const dateInQuestion = dayjs(date, dateFormats).utc(true);
  const formattedOtherDate = dayjs(otherDate, dateFormats).utc(true);
  return dateInQuestion.isBefore(formattedOtherDate) || dateInQuestion.isSame(formattedOtherDate);
}

export function dateFromString(dateString: string) {
  return dayjs(dateString, dateFormats).utc(true);
}

export function getPeriodAsListOfDays(period: Period) {
  const fom = dayjs(period.fom).utc(true);
  const tom = dayjs(period.tom).utc(true);

  const list = [];
  for (let currentDate = fom; isSameOrBefore(currentDate, tom); currentDate = currentDate.add(1, 'day')) {
    list.push(currentDate.format('YYYY-MM-DD'));
  }

  return list;
}

function getDaySequencesAsListOfPeriods(daySequences: string[][]): Period[] {
  return daySequences.map(daySequence => {
    const firstDay = daySequence[0];
    const lastDay = daySequence[daySequence.length - 1];
    return new Period(firstDay, lastDay);
  });
}

export function getPeriodDifference(basePeriod: Period, periods: Period[]) {
  const baseListOfDays = getPeriodAsListOfDays(basePeriod);

  const listOfDaysToExclude = periods.map(period => getPeriodAsListOfDays(period)).flat();

  const daysToInclude = [];
  let index = 0;

  baseListOfDays.forEach(currentDay => {
    const currentDayShouldBeIncluded = !listOfDaysToExclude.includes(currentDay);
    if (currentDayShouldBeIncluded) {
      if (Array.isArray(daysToInclude[index])) {
        daysToInclude[index].push(currentDay);
      } else {
        daysToInclude[index] = [currentDay];
      }
    } else if (daysToInclude[index]) {
      index += 1;
    }
  });

  return getDaySequencesAsListOfPeriods(daysToInclude);
}

export function isValidDate(date: any) {
  return !Number.isNaN(new Date(date) as any);
}

export function isValidPeriod({ fom, tom }: Period) {
  return isValidDate(fom) && isValidDate(tom);
}

export function hanteringAvDatoForDatoVelger(soknadsdato) {
  const antallÅrFramITid = 10;
  const maxDato = new Date(soknadsdato);
  maxDato.setFullYear(maxDato.getFullYear() + antallÅrFramITid);

  const startDato = new Date(maxDato.getFullYear() - antallÅrFramITid, 12, 1);
  const invalidDateRanges = [];

  for (let i = 0; i < antallÅrFramITid; i += 1) {
    invalidDateRanges.push({
      from: `${(startDato.getFullYear() + i).toString()}-01-01`,
      to: `${(startDato.getFullYear() + i).toString()}-12-30`,
    });
  }

  return {
    invalidDateRanges,
    minDate: startDato.toISOString().substring(0, 10),
    maxDate: maxDato.toISOString().substring(0, 10),
  };
}
