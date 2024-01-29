import { isSameOrBefore } from '../date-utils/dateComparison';
import { prettifyDateString } from '../date-utils/format';
import initializeDate from '../date-utils/initialize';
import isValid from '../date-utils/isValid';

class Period {
  fom: string;

  tom: string;

  constructor(fom: string, tom: string) {
    this.fom = fom;

    this.tom = tom;
  }

  prettifyPeriod() {
    return `${prettifyDateString(this.fom)} - ${prettifyDateString(this.tom)}`;
  }

  prettifyPeriodYears() {
    const fomYear = initializeDate(this.fom).year();
    const tomYear = initializeDate(this.tom).year();
    if (fomYear === tomYear) {
      return `${fomYear}`;
    }
    return `${fomYear} - ${tomYear}`;
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

  overlapsRight(otherPeriod) {
    return this.includesDate(otherPeriod.tom) && !this.includesDate(otherPeriod.fom);
  }

  overlapsWith(otherPeriod) {
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
    return isValid(this.fom) && isValid(this.tom);
  }

  asInternationalPeriod() {
    return {
      from: this.fom,
      to: this.tom,
    };
  }
}

export default Period;
