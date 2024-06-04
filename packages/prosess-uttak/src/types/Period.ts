import { dateFromString, prettifyDate } from '../util/dateUtils';

export default class Period {
  fom: string;

  tom: string;

  constructor(periodenøkkel: string) {
    const [fomValue, tomValue] = periodenøkkel.split('/');
    this.fom = fomValue;
    this.tom = tomValue;
  }

  prettifyPeriod(): string {
    return `${prettifyDate(this.fom)} - ${prettifyDate(this.tom)}`;
  }

  includesDate(dateString: string): boolean {
    const dateInQuestion = dateFromString(dateString);
    const fomDayjs = dateFromString(this.fom);
    const tomDayjs = dateFromString(this.tom);
    return (
      (dateInQuestion.isSame(fomDayjs) || dateInQuestion.isAfter(fomDayjs)) &&
      (dateInQuestion.isSame(tomDayjs) || dateInQuestion.isBefore(tomDayjs))
    );
  }

  covers(otherPeriod: Period): boolean {
    return this.includesDate(otherPeriod.fom) && this.includesDate(otherPeriod.tom);
  }

  overlapsLeft(otherPeriod: Period): boolean {
    return this.includesDate(otherPeriod.fom) && !this.includesDate(otherPeriod.tom);
  }

  overlapsRight(otherPeriod: Period): boolean {
    return this.includesDate(otherPeriod.tom) && !this.includesDate(otherPeriod.fom);
  }

  overlapsWith(otherPeriod: Period): boolean {
    return this.covers(otherPeriod) || this.overlapsLeft(otherPeriod) || this.overlapsRight(otherPeriod);
  }

  startsBefore(otherPeriod: Period): boolean {
    const dateInQuestion = dateFromString(otherPeriod.fom);
    const periodFom = dateFromString(this.fom);
    return periodFom.isBefore(dateInQuestion);
  }

  endsAfter(otherPeriod: Period): boolean {
    const dateInQuestion = dateFromString(otherPeriod.tom);
    const periodTom = dateFromString(this.tom);
    return periodTom.isAfter(dateInQuestion);
  }

  overlapsWithSomePeriodInList(periodList: Period[]): boolean {
    return periodList.some(currentPeriod => this.overlapsWith(currentPeriod));
  }

  fomIsBeforeOrSameAsTom(): boolean {
    const fomDate = dateFromString(this.fom);
    const tomDate = dateFromString(this.tom);
    return fomDate.isBefore(tomDate) || fomDate.isSame(tomDate);
  }

  getFirstAndLastWeek(): number | string {
    const fomWeek = dateFromString(this.fom).week();
    const tomWeek = dateFromString(this.tom).week();

    if (fomWeek === tomWeek) {
      return fomWeek;
    }

    return `${fomWeek}-${tomWeek}`;
  }
}
