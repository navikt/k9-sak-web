import { expect } from 'chai';
import aktivitetStatuser from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import organisasjonstyper from '@fpsak-frontend/kodeverk/src/organisasjonstype';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { erNyoppstartetFLField } from './vurderOgFastsettATFL/forms/NyoppstartetFLForm';
import {
  mapAndelToField,
  mapToBelop,
  setArbeidsforholdInitialValues,
  setGenerellAndelsinfo,
  setGenerellAndelsinfoUtenNavn,
  skalRedigereInntektForAndel,
  skalRedigereInntektskategoriForAndel,
} from './BgFordelingUtils';
import {
  finnFrilansFieldName,
  utledArbeidsforholdFieldName,
} from './vurderOgFastsettATFL/forms/VurderMottarYtelseUtils';
import { MANUELL_OVERSTYRING_BEREGNINGSGRUNNLAG_FIELD } from './InntektstabellPanel';

const arbeidsgiver = {
  arbeidsgiverIdent: '3284788923',
  startdato: '2017-01-01',
  opphoersdato: '2018-01-01',
};

const arbeidstakerIkkeFastsatt = {
  lagtTilAvSaksbehandler: false,
  aktivitetStatus: { kode: aktivitetStatuser.ARBEIDSTAKER },
  inntektskategori: { kode: 'ARBEIDSTAKER' },
};

const arbeidstakerAndel1 = {
  arbeidsforhold: {
    ...arbeidsgiver,
    arbeidsforholdId: '6765756g5',
  },
  andelsnr: 1,
  ...arbeidstakerIkkeFastsatt,
};

const alleKodeverk = {
  [kodeverkTyper.AKTIVITET_STATUS]: [
    {
      kode: aktivitetStatuser.ARBEIDSTAKER,
      navn: 'Arbeidstaker',
    },
    {
      kode: aktivitetStatuser.SELVSTENDIG_NAERINGSDRIVENDE,
      navn: 'Selvstendig næringsdrivende',
    },
    {
      kode: aktivitetStatuser.DAGPENGER,
      navn: 'Dagpenger',
    },
    {
      kode: aktivitetStatuser.ARBEIDSAVKLARINGSPENGER,
      navn: 'Arbeidsavklaringspenger',
    },
  ],
};

const arbeidsgiverOpplysningerPerId = {
  1231414: {
    navn: 'Arbeidsgiveren',
    arbeidsforholdreferanser: [],
  },
  3284788923: {
    navn: 'Virksomheten',
    arbeidsforholdreferanser: [
      {
        internArbeidsforholdId: '321378huda7e2',
        eksternArbeidsforholdId: '321378huda7e2',

      },
      {
        internArbeidsforholdId: '6765756g5',
        eksternArbeidsforholdId: '98ujruih32'
      }
    ],
  },
};

describe('<BgFordelingUtils>', () => {
  const dagpengerAndel = {
    aktivitetStatus: { kode: aktivitetStatuser.DAGPENGER, kodeverk: 'AKTIVITET_STATUS' },
    andelsnr: 1,
    skalKunneEndreAktivitet: false,
    lagtTilAvSaksbehandler: true,
    inntektskategori: { kode: 'DAGPENGER' },
    beregnetPrAar: 240000,
    fastsattBelop: 20000,
    belopReadOnly: 0,
    belopFraMeldekortPrMnd: 0,
  };

  const dagpengeField = mapAndelToField(dagpengerAndel, alleKodeverk, arbeidsgiverOpplysningerPerId);

  it('skal mappe dagpengerandel til feltverdier', () => {
    expect(dagpengeField.aktivitetStatus).to.equal('DP');
    expect(dagpengeField.andelsnr).to.equal(1);
    expect(dagpengeField.nyAndel).to.equal(false);
    expect(dagpengeField.lagtTilAvSaksbehandler).to.equal(true);
    expect(dagpengeField.skalKunneEndreAktivitet).to.equal(false);
    expect(dagpengeField.inntektskategori).to.equal('DAGPENGER');
    expect(dagpengeField.fastsattBelop).to.equal('20 000');
    expect(dagpengeField.belopReadOnly).to.equal('0');
    expect(dagpengeField.refusjonskrav).to.equal('');
  });

  it('skal mappe AAP-andel til feltverdier', () => {
    const AAPAndel = {
      aktivitetStatus: { kode: aktivitetStatuser.ARBEIDSAVKLARINGSPENGER, kodeverk: 'AKTIVITET_STATUS' },
      andelsnr: 1,
      skalKunneEndreAktivitet: false,
      lagtTilAvSaksbehandler: false,
      inntektskategori: { kode: 'AAP' },
      beregnetPrAar: null,
      fastsattBelop: null,
      belopReadOnly: 10000,
      belopFraMeldekortPrMnd: 10000,
    };
    const aapField = mapAndelToField(AAPAndel, alleKodeverk, arbeidsgiverOpplysningerPerId);
    expect(aapField.aktivitetStatus).to.equal('AAP');
    expect(aapField.andelsnr).to.equal(1);
    expect(aapField.nyAndel).to.equal(false);
    expect(aapField.lagtTilAvSaksbehandler).to.equal(false);
    expect(aapField.skalKunneEndreAktivitet).to.equal(false);
    expect(aapField.inntektskategori).to.equal('AAP');
    expect(aapField.fastsattBelop).to.equal('');
    expect(aapField.belopReadOnly).to.equal('10 000');
    expect(aapField.refusjonskrav).to.equal('');
  });

  it('skal mappe AT uten inntektsmelding med FL i samme org til feltverdier', () => {
    const ATAndel = {
      aktivitetStatus: { kode: aktivitetStatuser.ARBEIDSTAKER, kodeverk: 'AKTIVITET_STATUS' },
      andelsnr: 1,
      skalKunneEndreAktivitet: false,
      lagtTilAvSaksbehandler: false,
      inntektskategori: { kode: 'AT' },
      beregnetPrAar: null,
      belopFraMeldekortPrMnd: null,
      arbeidsforhold: {
        arbeidsgiverIdent: '1231414',
      },
    };
    const atField = mapAndelToField(ATAndel, alleKodeverk, arbeidsgiverOpplysningerPerId);
    expect(atField.aktivitetStatus).to.equal('AT');
    expect(atField.andelsnr).to.equal(1);
    expect(atField.nyAndel).to.equal(false);
    expect(atField.lagtTilAvSaksbehandler).to.equal(false);
    expect(atField.skalKunneEndreAktivitet).to.equal(false);
    expect(atField.inntektskategori).to.equal('AT');
    expect(atField.fastsattBelop).to.equal('');
    expect(atField.belopReadOnly).to.equal('');
    expect(atField.refusjonskrav).to.equal('');
  });

  it('skal mappe FL med AT i samme org til feltverdier', () => {
    const FLAndel = {
      aktivitetStatus: { kode: aktivitetStatuser.FRILANSER, navn: 'Frilanser', kodeverk: 'AKTIVITET_STATUS' },
      andelsnr: 1,
      skalKunneEndreAktivitet: false,
      lagtTilAvSaksbehandler: false,
      inntektskategori: { kode: 'FL' },
      beregnetPrAar: null,
      belopFraMeldekortPrMnd: null,
    };
    const atField = mapAndelToField(FLAndel, alleKodeverk, arbeidsgiverOpplysningerPerId);
    expect(atField.aktivitetStatus).to.equal('FL');
    expect(atField.andelsnr).to.equal(1);
    expect(atField.nyAndel).to.equal(false);
    expect(atField.lagtTilAvSaksbehandler).to.equal(false);
    expect(atField.skalKunneEndreAktivitet).to.equal(false);
    expect(atField.inntektskategori).to.equal('FL');
    expect(atField.fastsattBelop).to.equal('');
    expect(atField.belopReadOnly).to.equal('');
    expect(atField.refusjonskrav).to.equal('');
  });

  it('skal mappe AT med inntektsmelding til feltverdier', () => {
    const ATAndel = {
      aktivitetStatus: { kode: aktivitetStatuser.ARBEIDSTAKER, navn: 'Arbeidstaker', kodeverk: 'AKTIVITET_STATUS' },
      andelsnr: 1,
      skalKunneEndreAktivitet: false,
      lagtTilAvSaksbehandler: false,
      inntektskategori: { kode: 'AT' },
      beregnetPrAar: null,
      belopFraMeldekortPrMnd: null,
      fastsattBelop: null,
      belopReadOnly: 20000,
      arbeidsforhold: {
        belopFraInntektsmeldingPrMnd: 20000,
        arbeidsgiverIdent: '1231414',
      },
    };
    const atField = mapAndelToField(ATAndel, alleKodeverk, arbeidsgiverOpplysningerPerId);
    expect(atField.aktivitetStatus).to.equal('AT');
    expect(atField.andelsnr).to.equal(1);
    expect(atField.nyAndel).to.equal(false);
    expect(atField.lagtTilAvSaksbehandler).to.equal(false);
    expect(atField.skalKunneEndreAktivitet).to.equal(false);
    expect(atField.inntektskategori).to.equal('AT');
    expect(atField.fastsattBelop).to.equal('');
    expect(atField.belopReadOnly).to.equal('20 000');
    expect(atField.refusjonskrav).to.equal('');
  });

  it('skal sette initial values for generell andelinfo med arbeidsforhold', () => {
    const andelValueFromState = {
      arbeidsforhold: {
        arbeidsgiverIdent: '3284788923',
        arbeidsforholdId: '321378huda7e2',
        eksternArbeidsforholdId: '321378huda7e2',
      },
      aktivitetStatus: { kode: aktivitetStatuser.ARBEIDSTAKER, kodeverk: 'AKTIVITET_STATUS' },
      andelsnr: 3,
      lagtTilAvSaksbehandler: false,
      inntektskategori: { kode: 'ARBEIDSTAKER' },
    };

    const andelsInfo = setGenerellAndelsinfo(andelValueFromState, alleKodeverk, arbeidsgiverOpplysningerPerId);
    expect(andelsInfo.andel).to.equal('Virksomheten (3284788923)...a7e2');
    expect(andelsInfo.aktivitetStatus).to.equal('AT');
    expect(andelsInfo.andelsnr).to.equal(3);
    expect(andelsInfo.nyAndel).to.equal(false);
    expect(andelsInfo.lagtTilAvSaksbehandler).to.equal(false);
    expect(andelsInfo.inntektskategori).to.equal('ARBEIDSTAKER');
  });

  it('skal sette initial values for generell andelinfo uten arbeidsforhold', () => {
    const andelValueFromState = {
      aktivitetStatus: { kode: aktivitetStatuser.SELVSTENDIG_NAERINGSDRIVENDE, kodeverk: 'AKTIVITET_STATUS' },
      andelsnr: 2,
      lagtTilAvSaksbehandler: true,
      inntektskategori: { kode: 'SN' },
    };
    const andelsInfo = setGenerellAndelsinfo(andelValueFromState, alleKodeverk, arbeidsgiverOpplysningerPerId);
    expect(andelsInfo.andel).to.equal('Selvstendig næringsdrivende');
    expect(andelsInfo.aktivitetStatus).to.equal('SN');
    expect(andelsInfo.andelsnr).to.equal(2);
    expect(andelsInfo.nyAndel).to.equal(false);
    expect(andelsInfo.lagtTilAvSaksbehandler).to.equal(true);
    expect(andelsInfo.inntektskategori).to.equal('SN');
  });

  it('skal ikkje sette arbeidsforhold initial values for andel uten arbeidsforhold', () => {
    const andelValueFromState = {
      aktivitetStatus: { kode: aktivitetStatuser.SELVSTENDIG_NAERINGSDRIVENDE, kodeverk: 'AKTIVITET_STATUS' },
      andelsnr: 2,
      lagtTilAvSaksbehandler: true,
      inntektskategori: { kode: 'SN' },
    };
    const arbeidsforholdIV = setArbeidsforholdInitialValues(
      andelValueFromState,
      alleKodeverk,
      arbeidsgiverOpplysningerPerId,
    );
    expect(arbeidsforholdIV.arbeidsforholdId).to.equal(null);
    expect(arbeidsforholdIV.arbeidsperiodeFom).to.equal('');
    expect(arbeidsforholdIV.arbeidsperiodeTom).to.equal('');
  });

  const andelsnrKunstigArbeid = 241;

  const kunstigArbeidsgiver = {
    arbeidsgiverIdent: '42672364432',
    startdato: '2017-01-01',
    opphoersdato: '2018-01-01',
    organisasjonstype: { kode: organisasjonstyper.KUNSTIG },
  };

  const kunstigArbeidstakerAndel = {
    arbeidsforhold: {
      ...kunstigArbeidsgiver,
      arbeidsforholdId: null,
    },
    andelsnr: andelsnrKunstigArbeid,
    ...arbeidstakerIkkeFastsatt,
  };

  const arbeidstakerAndel3 = {
    arbeidsforhold: {
      ...arbeidsgiver,
      arbeidsforholdId: '321378huda7e2',
      eksternArbeidsforholdId: '321378huda7e2',
    },
    andelsnr: 3,
    ...arbeidstakerIkkeFastsatt,
  };

  it('skal sette arbeidsforhold initial values for andel med arbeidsforhold', () => {
    const arbeidsforholdIV = setArbeidsforholdInitialValues(arbeidstakerAndel3);
    expect(arbeidsforholdIV.arbeidsforholdId).to.equal('321378huda7e2');
    expect(arbeidsforholdIV.arbeidsperiodeFom).to.equal('2017-01-01');
    expect(arbeidsforholdIV.arbeidsperiodeTom).to.equal('2018-01-01');
  });

  const arbeidstakerAndel4 = {
    arbeidsforhold: {
      ...arbeidsgiver,
      arbeidsforholdId: '546546g54',
    },
    andelsnr: 4,
    ...arbeidstakerIkkeFastsatt,
  };

  const frilansAndel = {
    aktivitetStatus: { kode: aktivitetStatuser.FRILANSER, navn: 'Frilans' },
    andelsnr: 2,
  };

  const beregningsgrunnlag = {
    beregningsgrunnlagPeriode: [
      {
        beregningsgrunnlagPrStatusOgAndel: [
          arbeidstakerAndel1,
          arbeidstakerAndel3,
          frilansAndel,
          arbeidstakerAndel4,
          kunstigArbeidstakerAndel,
        ],
      },
    ],
  };

  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: [],
    vurderMottarYtelse: {
      erFrilans: true,
      frilansMottarYtelse: null,
      frilansInntektPrMnd: 20000,
      arbeidstakerAndelerUtenIM: [arbeidstakerAndel3, arbeidstakerAndel1],
    },
  };

  const values = {};
  values[utledArbeidsforholdFieldName(arbeidstakerAndel3)] = true;
  values[finnFrilansFieldName()] = true;

  const andelValuesUtenInntektsmelding = {
    fordelingForrigeBehandling: '',
    fastsattBelop: '',
    readOnlyBelop: 25000,
    skalRedigereInntekt: false,
    refusjonskrav: '',
    belopFraInntektsmelding: null,
    refusjonskravFraInntektsmelding: null,
  };

  const andelValuesMedInntektsmelding = {
    fordelingForrigeBehandling: 25000,
    fastsattBelop: 25000,
    readOnlyBelop: 25000,
    skalRedigereInntekt: false,
    refusjonskrav: '',
    belopFraInntektsmelding: 25000,
    refusjonskravFraInntektsmelding: null,
  };

  it('skal redigere inntektskategori for kunstig arbeid', () => {
    const andelFieldValue = {
      ...andelValuesUtenInntektsmelding,
      ...setArbeidsforholdInitialValues(kunstigArbeidstakerAndel),
      ...setGenerellAndelsinfoUtenNavn(kunstigArbeidstakerAndel),
    };
    const vals = {};
    const skalRedigereInntektskategori = skalRedigereInntektskategoriForAndel(
      vals,
      beregningsgrunnlag,
    )(andelFieldValue);
    expect(skalRedigereInntektskategori).to.equal(true);
  });

  it('skal redigere inntekt ved overstyring', () => {
    const andelFieldValue = {
      ...andelValuesMedInntektsmelding,
      ...setGenerellAndelsinfoUtenNavn(arbeidstakerAndel4),
    };
    const copyValues = { ...values };
    copyValues[MANUELL_OVERSTYRING_BEREGNINGSGRUNNLAG_FIELD] = true;
    const skalRedigereInntekt = skalRedigereInntektForAndel(
      copyValues,
      faktaOmBeregning,
      beregningsgrunnlag,
    )(andelFieldValue);
    expect(skalRedigereInntekt).to.equal(true);
  });

  it('skal redigere inntekt for arbeidstakerandel som mottar ytelse', () => {
    const andelFieldValue = {
      ...andelValuesUtenInntektsmelding,
      ...setGenerellAndelsinfoUtenNavn(arbeidstakerAndel3),
    };
    const skalRedigereInntekt = skalRedigereInntektForAndel(
      values,
      faktaOmBeregning,
      beregningsgrunnlag,
    )(andelFieldValue);
    expect(skalRedigereInntekt).to.equal(true);
  });

  it('skal redigere inntekt for arbeidstakerandel som ikke mottar ytelse, men har lonnsendring', () => {
    const andelFieldValue = {
      ...andelValuesUtenInntektsmelding,
      ...setGenerellAndelsinfoUtenNavn(arbeidstakerAndel1),
    };
    faktaOmBeregning.arbeidsforholdMedLønnsendringUtenIM = [arbeidstakerAndel1];
    const skalRedigereInntekt = skalRedigereInntektForAndel(
      values,
      faktaOmBeregning,
      beregningsgrunnlag,
    )(andelFieldValue);
    expect(skalRedigereInntekt).to.equal(true);
  });

  it('skal redigere inntekt for kun ytelse', () => {
    const brukersAndel = {
      andelsnr: 1,
      aktivitetStatus: 'BA',
    };
    const fakta = {
      ...faktaOmBeregning,
      faktaOmBeregningTilfeller: [{ kode: faktaOmBeregningTilfelle.FASTSETT_BG_KUN_YTELSE }],
    };
    const skalRedigereInntekt = skalRedigereInntektForAndel(values, fakta, beregningsgrunnlag)(brukersAndel);
    expect(skalRedigereInntekt).to.equal(true);
  });

  it('skal ikkje redigere inntekt for arbeidstakerandel med inntektsmelding i samme org som frilans', () => {
    const andelFieldValue = {
      ...andelValuesUtenInntektsmelding,
      ...setGenerellAndelsinfoUtenNavn(arbeidstakerAndel4),
    };
    const faktaOmBeregningCopy = { ...faktaOmBeregning };
    arbeidstakerAndel4.inntektPrMnd = 30000;
    faktaOmBeregningCopy.arbeidstakerOgFrilanserISammeOrganisasjonListe = [arbeidstakerAndel4];
    const skalRedigereInntekt = skalRedigereInntektForAndel(
      values,
      faktaOmBeregningCopy,
      beregningsgrunnlag,
    )(andelFieldValue);
    expect(skalRedigereInntekt).to.equal(false);
  });

  it('skal redigere inntekt for arbeidstakerandel uten inntektsmelding i samme org som frilans', () => {
    const andelFieldValue = {
      ...andelValuesMedInntektsmelding,
      ...setGenerellAndelsinfoUtenNavn(arbeidstakerAndel4),
    };
    const faktaOmBeregningCopy = { ...faktaOmBeregning };
    arbeidstakerAndel4.inntektPrMnd = null;
    faktaOmBeregningCopy.arbeidstakerOgFrilanserISammeOrganisasjonListe = [arbeidstakerAndel4];
    const skalRedigereInntekt = skalRedigereInntektForAndel(
      values,
      faktaOmBeregningCopy,
      beregningsgrunnlag,
    )(andelFieldValue);
    expect(skalRedigereInntekt).to.equal(true);
  });

  it('skal redigere inntekt for frilansandel som mottar ytelse', () => {
    const andelFieldValue = {
      ...andelValuesUtenInntektsmelding,
      ...setGenerellAndelsinfoUtenNavn(frilansAndel),
    };
    const skalRedigereInntekt = skalRedigereInntektForAndel(
      values,
      faktaOmBeregning,
      beregningsgrunnlag,
    )(andelFieldValue);
    expect(skalRedigereInntekt).to.equal(true);
  });

  it('skal redigere inntekt for frilansandel som ikke mottar ytelse, men er nyoppstartet', () => {
    const valuesLocalCopy = { ...values };
    valuesLocalCopy[finnFrilansFieldName()] = false;
    valuesLocalCopy[erNyoppstartetFLField] = true;
    const andelFieldValue = {
      ...andelValuesUtenInntektsmelding,
      ...setGenerellAndelsinfoUtenNavn(frilansAndel),
    };
    const skalRedigereInntekt = skalRedigereInntektForAndel(
      valuesLocalCopy,
      faktaOmBeregning,
      beregningsgrunnlag,
    )(andelFieldValue);
    expect(skalRedigereInntekt).to.equal(true);
  });

  it('skal ikke redigere inntekt for frilansandel som ikke mottar ytelse og ikke er nyoppstartet', () => {
    const valuesLocalCopy = { ...values };
    valuesLocalCopy[finnFrilansFieldName()] = false;
    valuesLocalCopy[erNyoppstartetFLField] = false;
    const andelFieldValue = {
      ...andelValuesUtenInntektsmelding,
      ...setGenerellAndelsinfoUtenNavn(frilansAndel),
    };
    const skalRedigereInntekt = skalRedigereInntektForAndel(
      valuesLocalCopy,
      faktaOmBeregning,
      beregningsgrunnlag,
    )(andelFieldValue);
    expect(skalRedigereInntekt).to.equal(false);
  });
  it('skal redigere inntekt for frilansandel i samme org som arbeidstaker', () => {
    const andelFieldValue = {
      ...andelValuesUtenInntektsmelding,
      ...setGenerellAndelsinfoUtenNavn(frilansAndel),
    };
    faktaOmBeregning.arbeidstakerOgFrilanserISammeOrganisasjonListe = [arbeidstakerAndel4];
    const skalRedigereInntekt = skalRedigereInntektForAndel(
      values,
      faktaOmBeregning,
      beregningsgrunnlag,
    )(andelFieldValue);
    expect(skalRedigereInntekt).to.equal(true);
  });

  it('skal mappe fastsattBeløp til beløp om skalRedigereInntekt er udefinert', () => {
    const andel = {
      fastsattBelop: '10 000',
      readOnlyBelop: '20 000',
    };
    const belop = mapToBelop(undefined)(andel);
    expect(belop).to.equal(10000);
  });

  it('skal mappe fastsattBeløp til beløp om skalRedigereInntekt returnerer true', () => {
    const andel = {
      fastsattBelop: '10 000',
      readOnlyBelop: '20 000',
    };
    const belop = mapToBelop(() => true)(andel);
    expect(belop).to.equal(10000);
  });

  it('skal mappe readOnlyBelop til beløp om skalRedigereInntekt returnerer false', () => {
    const andel = {
      fastsattBelop: '10 000',
      readOnlyBelop: '20 000',
    };
    const belop = mapToBelop(() => false)(andel);
    expect(belop).to.equal(20000);
  });
});
