import moment from 'moment';
import { TIDENES_ENDE } from '@fpsak-frontend/utils';

const finnSamletBruttoForStatus = (andeler, status) => {
  if (!andeler) {
    return 0;
  }
  const inntekt = andeler
    .filter(a => a.aktivitetStatus.kode === status)
    .map(({ bruttoPrAar }) => bruttoPrAar)
    .reduce((sum, brutto) => sum + brutto, 0);
  if (!inntekt || inntekt === 0) {
    return 0;
  }
  return inntekt;
};

const erMars2020 = dato => {
  return dato.month() === 2 && dato.year() === 2020;
};

const erSøktForMars2020 = frisinnPeriode => {
  const tom = moment(frisinnPeriode.tom);
  return erMars2020(tom);
};

/**
 Denne metoden sjekker om det er søkt for valgt status i denne beregningsperiode eller i neste dersom den inngår i samme søknadsperiode.
 Hvis to perioder ligger i samme måned ligger de i samme søknadsperiode
 */
const finnFrisinnAndelerISøknadsperiodeForStatus = (status, bgPeriode, ytelsegrunnlag) => {
  const { frisinnPerioder } = ytelsegrunnlag;
  if (!frisinnPerioder) {
    return null;
  }
  const bgFom = moment(bgPeriode.beregningsgrunnlagPeriodeFom);

  // Søkader for mars må spesialhåndteres da disse er de eneste som krysser måneder
  if (erMars2020(bgFom) && frisinnPerioder.some(p => erSøktForMars2020(p))) {
    const aprilSlutt = moment('2020-04-30');
    const periodeVedSisteDagIApril = frisinnPerioder.find(p => moment(p.tom).isSame(aprilSlutt, 'day'));
    if (!periodeVedSisteDagIApril) {
      return null;
    }
    return periodeVedSisteDagIApril.frisinnAndeler.filter(andel => andel.statusSøktFor.kode === status);
  }
  const sisteDatoIMåned = moment(bgPeriode.beregningsgrunnlagPeriodeTom).endOf('month');
  const periodeVedSisteDagIMnd = frisinnPerioder.find(
    p => !moment(p.fom).isBefore(bgFom) && moment(p.tom).isSame(sisteDatoIMåned, 'day'),
  );
  if (!periodeVedSisteDagIMnd) {
    return null;
  }
  return periodeVedSisteDagIMnd.frisinnAndeler.filter(andel => andel.statusSøktFor.kode === status);
};

export const erSøktForAndelISøknadsperiode = (status, bgPeriode, ytelsegrunnlag) => {
  const andeler = finnFrisinnAndelerISøknadsperiodeForStatus(status, bgPeriode, ytelsegrunnlag);
  return !!andeler && andeler.length > 0;
};

/**
 * hvis det er søkt frisinn for samme søknadsperiode som bgPeriode er i (hele måneder), skal man bruke tallet som ligger
 * i første periode. Ellers skal man bruke tallet som ligger i perioden. For arbeidstakere skal man alltid bruke inntekten
 * som ligger i perioden
 */
export const finnBruttoForStatusIPeriode = (status, bg, bgPeriode) => {
  if (!status || !bg || !bgPeriode) {
    return 0;
  }
  if (erSøktForAndelISøknadsperiode(status, bgPeriode, bg.ytelsesspesifiktGrunnlag)) {
    const førstePeriode = bg.beregningsgrunnlagPeriode[0];
    return finnSamletBruttoForStatus(førstePeriode.beregningsgrunnlagPrStatusOgAndel, status);
  }
  return finnSamletBruttoForStatus(bgPeriode.beregningsgrunnlagPrStatusOgAndel, status);
};

export const finnOppgittInntektForAndelIPeriode = (status, bgPeriode, ytelsegrunnlag) => {
  const matchendeAndeler = finnFrisinnAndelerISøknadsperiodeForStatus(status, bgPeriode, ytelsegrunnlag);
  if (!matchendeAndeler || matchendeAndeler.length < 1) {
    return 0;
  }
  const inntekt = matchendeAndeler.map(({ oppgittInntekt }) => oppgittInntekt).reduce((sum, brutto) => sum + brutto, 0);
  if (!inntekt || inntekt === 0) {
    return 0;
  }
  return inntekt;
};

const overlapperMedFrisinnPeriode = (bgPeriode, frisinnPerioder) => {
  const bgFom = moment(bgPeriode.beregningsgrunnlagPeriodeFom);
  const bgTom = moment(bgPeriode.beregningsgrunnlagPeriodeTom);
  return frisinnPerioder.some(p => !moment(p.fom).isBefore(bgFom) && !moment(p.tom).isAfter(bgTom));
};

const finnPerioderSomTilhørerSisteSøknadsperiode = (bgPerioder, frisinnGrunnlag) => {
  const { frisinnPerioder } = frisinnGrunnlag;
  if (!frisinnPerioder || frisinnPerioder.length < 1) {
    return null;
  }
  if (frisinnPerioder.length === 1) {
    return frisinnPerioder[0];
  }
  const kronologiskePerioder = frisinnPerioder.sort((a, b) => moment(a.fom) - moment(b.fom));
  const sistePeriode = kronologiskePerioder[kronologiskePerioder.length - 1];
  const nestSistePeriode = kronologiskePerioder[kronologiskePerioder.length - 2];
  const tomSiste = moment(sistePeriode.tom);
  const tomNestSiste = moment(nestSistePeriode.tom);

  // Mars må spesialbehandles, skal alltid slutte i april
  if (erMars2020(tomNestSiste)) {
    return [nestSistePeriode, sistePeriode];
  }

  return tomSiste.month === tomNestSiste.month() && tomSiste.year() === tomNestSiste.year()
    ? [nestSistePeriode, sistePeriode]
    : [sistePeriode];
};

const førsteDato = moment('2020-03-30');

/**
 *
 * @param bgPerioder - alle beregningsgrunnlagperioder
 * @param frisinnGrunnlag - grunnlag med alle frisinnperioder
 * @param behandlingÅrsaker - alle årsaker til at behandlingen er opprettet
 * @returns {[bgperioder]} en liste med alle bgperioder vi skal vise dagsatsberegning og inntektstakberegning for
 * Henter kun ut perioder som avsluttes på siste dag i en måned, da dette er de som skal vises for FRISINN.
 * De må også overlappe med frisinnperiode
 * Hvis behandlingen er opprettet pga endring fra bruker skal kun siste søknadsperiode vises
 */
export const finnAlleBGPerioderÅViseDetaljerFor = (bgPerioder, frisinnGrunnlag, behandlingÅrsaker) => {
  const opprettetGrunnetEndring =
    behandlingÅrsaker &&
    behandlingÅrsaker.some(
      årsak => årsak.behandlingArsakType && årsak.behandlingArsakType.kode === 'RE-END-FRA-BRUKER',
    );
  const perioder = [];
  for (let i = 0; i < bgPerioder.length; i += 1) {
    const periode = bgPerioder[i];
    const frisinnPerioder = opprettetGrunnetEndring
      ? finnPerioderSomTilhørerSisteSøknadsperiode(bgPerioder, frisinnGrunnlag)
      : frisinnGrunnlag.frisinnPerioder;
    if (overlapperMedFrisinnPeriode(periode, frisinnPerioder)) {
      const tom = moment(periode.beregningsgrunnlagPeriodeTom);
      const sisteDatoIMåned = moment(periode.beregningsgrunnlagPeriodeTom).endOf('month');
      if (
        tom.isAfter(førsteDato) &&
        tom.isSame(sisteDatoIMåned, 'day') &&
        periode.beregningsgrunnlagPeriodeTom !== TIDENES_ENDE
      ) {
        perioder.push(periode);
      }
    }
  }
  return perioder;
};
