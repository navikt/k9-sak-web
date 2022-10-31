import moment from 'moment';
import behandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';

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

const erMars2020 = dato => dato.month() === 2 && dato.year() === 2020;

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
  if (!Array.isArray(frisinnPerioder)) {
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

export const finnFrisinnperioderSomSkalVises = (beregningsgrunnlag, behandling) => {
  const { frisinnPerioder } = beregningsgrunnlag.ytelsesspesifiktGrunnlag;
  if (!Array.isArray(frisinnPerioder)) {
    return null;
  }
  if (behandling && behandling.behandlingÅrsaker && frisinnPerioder.length > 1) {
    const årsaker = behandling.behandlingÅrsaker;
    const eropprettetGrunetEndring = årsaker.some(
      årsak => årsak.behandlingArsakType.kode === behandlingArsakType.RE_ENDRING_FRA_BRUKER,
    );
    if (eropprettetGrunetEndring) {
      // Skal kun vise siste søknadsperiode
      const kronologiskePerioder = [...frisinnPerioder].sort((a, b) => moment(a.fom) - moment(b.fom));
      const sistePeriode = kronologiskePerioder[kronologiskePerioder.length - 1];
      const sisteTom = moment(sistePeriode.tom);
      if (sisteTom.month() === 3 && sisteTom.year() === 2020) {
        // Spesialbehandling for første søknadsmåned
        // Returner alle periuoder som starter i mars eller april
        return kronologiskePerioder.filter(p => moment(p.fom).month() === 3 || moment(p.fom).month() === 2);
      }
      // Returner alle perioder som starter i samme måned og år
      return kronologiskePerioder.filter(p => moment(p.fom).month() === sisteTom.month() &&
        moment(p.fom).year() === sisteTom.year());
    }
  }
  return frisinnPerioder;
};
