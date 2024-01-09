import dayjs from 'dayjs';

export class Period {
  fom: string;

  tom: string;

  constructor(fom: string, tom: string) {
    this.fom = fom;
    this.tom = tom;
  }

  dateFromString(dateString: string) {
    return dayjs(dateString, ['YYYY-MM-DD', 'DD.MM.YYYY']).utc(true);
  }

  includesDate(dateString: string) {
    const dateInQuestion = this.dateFromString(dateString);
    const fomDayjs = this.dateFromString(this.fom);
    const tomDayjs = this.dateFromString(this.tom);
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
    const dateInQuestion = this.dateFromString(otherPeriod.fom);
    const periodFom = this.dateFromString(this.fom);
    return periodFom.isBefore(dateInQuestion);
  }

  endsAfter(otherPeriod: Period) {
    const dateInQuestion = this.dateFromString(otherPeriod.tom);
    const periodTom = this.dateFromString(this.tom);
    return periodTom.isAfter(dateInQuestion);
  }
}
