import { dateFromString } from '../util/dateUtils';

export class Period {
  fom: string;

  tom: string;

  constructor(fom: string, tom: string) {
    this.fom = fom;
    this.tom = tom;
  }

  includesDate(dateString: string) {
    const dateInQuestion = dateFromString(dateString);
    const fomDayjs = dateFromString(this.fom);
    const tomDayjs = dateFromString(this.tom);
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
    const dateInQuestion = dateFromString(otherPeriod.fom);
    const periodFom = dateFromString(this.fom);
    return periodFom.isBefore(dateInQuestion);
  }

  endsAfter(otherPeriod: Period) {
    const dateInQuestion = dateFromString(otherPeriod.tom);
    const periodTom = dateFromString(this.tom);
    return periodTom.isAfter(dateInQuestion);
  }
}
