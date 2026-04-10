import { isSameOrBefore, isValidDate, prettifyDateString } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';

export class Period {
  fom: string;

  tom: string;

  constructor(fom: string, tom: string) {
    this.fom = fom;

    this.tom = tom;
  }

  prettifyPeriod() {
    return `${prettifyDateString(this.fom)} - ${prettifyDateString(this.tom)}`;
  }

  includesDate(dateString: string) {
    const dateInQuestion = initializeDate(dateString);
    const fomDayjs = initializeDate(this.fom);
    const tomDayjs = initializeDate(this.tom);
    return (
      (dateInQuestion.isSame(fomDayjs) || dateInQuestion.isAfter(fomDayjs)) &&
      (dateInQuestion.isSame(tomDayjs) || dateInQuestion.isBefore(tomDayjs))
    );
  }

  covers(otherPeriod: Period) {
    return this.includesDate(otherPeriod.fom) && this.includesDate(otherPeriod.tom);
  }

  overlapsLeft(otherPeriod: Period) {
    return this.includesDate(otherPeriod.fom) && !this.includesDate(otherPeriod.tom);
  }

  overlapsRight(otherPeriod: Period) {
    return this.includesDate(otherPeriod.tom) && !this.includesDate(otherPeriod.fom);
  }

  overlapsWith(otherPeriod: Period) {
    return this.covers(otherPeriod) || this.overlapsLeft(otherPeriod) || this.overlapsRight(otherPeriod);
  }

  startsBefore(otherPeriod: Period) {
    const dateInQuestion = initializeDate(otherPeriod.fom);
    const periodFom = initializeDate(this.fom);
    return periodFom.isBefore(dateInQuestion);
  }

  endsAfter(otherPeriod: Period) {
    const dateInQuestion = initializeDate(otherPeriod.tom);
    const periodTom = initializeDate(this.tom);
    return periodTom.isAfter(dateInQuestion);
  }

  overlapsWithSomePeriodInList(periodList: Period[]) {
    return periodList.some(currentPeriod => this.overlapsWith(currentPeriod));
  }

  fomIsBeforeOrSameAsTom() {
    const fomDate = initializeDate(this.fom);
    const tomDate = initializeDate(this.tom);
    return fomDate.isBefore(tomDate) || fomDate.isSame(tomDate);
  }

  asListOfDays() {
    const fomDayjs = initializeDate(this.fom);
    const tomDayjs = initializeDate(this.tom);

    const list = [];
    for (let currentDate = fomDayjs; isSameOrBefore(currentDate, tomDayjs); currentDate = currentDate.add(1, 'day')) {
      list.push(currentDate.format('YYYY-MM-DD'));
    }

    return list;
  }

  isValid() {
    return isValidDate(this.fom) && isValidDate(this.tom);
  }

  asInternationalPeriod() {
    return {
      from: this.fom,
      to: this.tom,
    };
  }
}

export const sortPeriodsByFomDate = (period1: Period, period2: Period): number => {
  if (period1.startsBefore(period2)) {
    return -1;
  }
  if (period2.startsBefore(period1)) {
    return 1;
  }
  return 0;
};
