import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import aktivitetStatuser from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import inntektskategorier from '@fpsak-frontend/kodeverk/src/inntektskategorier';
import VurderOgFastsettATFL, {
  skalFastsettInntektForArbeidstaker,
  skalFastsettInntektForFrilans,
} from './VurderOgFastsettATFL';
import { INNTEKT_FIELD_ARRAY_NAME } from '../BgFordelingUtils';
import LonnsendringTekst from './forms/LonnsendringTekst';
import NyoppstartetFLForm, { erNyoppstartetFLField } from './forms/NyoppstartetFLForm';
import VurderMottarYtelseForm from './forms/VurderMottarYtelseForm';
import InntektstabellPanel from '../InntektstabellPanel';

const {
  VURDER_MOTTAR_YTELSE,
  VURDER_LONNSENDRING,
  VURDER_NYOPPSTARTET_FL,
  FASTSETT_MAANEDSINNTEKT_FL,
  FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING,
} = faktaOmBeregningTilfelle;

const behandlingId = 1;
const behandlingVersjon = 1;

const lagBeregningsgrunnlag = andeler => ({
  beregningsgrunnlagPeriode: [
    {
      beregningsgrunnlagPrStatusOgAndel: andeler.map(andel => ({
        andelsnr: andel.andelsnr,
        aktivitetStatus: andel.aktivitetStatus,
        inntektskategori: andel.inntektskategori,
        erNyoppstartet: andel.erNyoppstartet,
      })),
    },
  ],
});

const lagFaktaOmBeregning = (
  tilfeller,
  arbeidsforholdMedLønnsendringUtenIM,
  arbeidstakerOgFrilanserISammeOrganisasjonListe,
  vurderMottarYtelse = {},
) => ({
  faktaOmBeregningTilfeller: tilfeller,
  arbeidsforholdMedLønnsendringUtenIM,
  arbeidstakerOgFrilanserISammeOrganisasjonListe,
  vurderMottarYtelse,
});

const lagAndel = (andelsnr, aktivitetStatus, inntektskategori) => ({
  andelsnr,
  aktivitetStatus,
  inntektskategori,
});

const lagAndelValues = (
  andelsnr,
  fastsattBelop,
  inntektskategori,
  aktivitetStatus,
  lagtTilAvSaksbehandler = false,
  nyAndel = false,
  skalRedigereInntekt = true,
) => ({
  nyAndel,
  andelsnr,
  fastsattBelop,
  inntektskategori,
  aktivitetStatus,
  lagtTilAvSaksbehandler,
  skalRedigereInntekt,
});

describe('<VurderOgFastsettATFL>', () => {
  it('skal fastsette inntekt for nyoppstartetFL og arbeidstaker uten inntektsmelding med lønnsendring', () => {
    const values = {};
    values[erNyoppstartetFLField] = true;
    values[INNTEKT_FIELD_ARRAY_NAME] = [
      lagAndelValues(1, '10 000', inntektskategorier.ARBEIDSTAKER, aktivitetStatuser.ARBEIDSTAKER),
      lagAndelValues(2, '30 000', inntektskategorier.FRILANSER, aktivitetStatuser.FRILANSER),
      lagAndelValues(undefined, '20 000', inntektskategorier.DAGPENGER, aktivitetStatuser.DAGPENGER, true, true),
    ];
    const andelMedLonnsendring = lagAndel(1, aktivitetStatuser.ARBEIDSTAKER, inntektskategorier.ARBEIDSTAKER);
    const andeler = [
      andelMedLonnsendring,
      {
        ...lagAndel(2, aktivitetStatuser.FRILANSER, inntektskategorier.FRILANSER),
        erNyoppstartet: true,
      },
    ];
    const beregningsgrunnlag = lagBeregningsgrunnlag(andeler);
    const faktaOmBeregning = lagFaktaOmBeregning(
      [VURDER_LONNSENDRING, VURDER_NYOPPSTARTET_FL],
      [andelMedLonnsendring],
      undefined,
    );
    const transformed = VurderOgFastsettATFL.transformValues(faktaOmBeregning, beregningsgrunnlag)(values).fakta;
    expect(transformed.fastsattUtenInntektsmelding.andelListe.length).to.equal(1);
    expect(transformed.fastsattUtenInntektsmelding.andelListe[0].andelsnr).to.equal(1);
    expect(transformed.fastsattUtenInntektsmelding.andelListe[0].fastsattBeløp).to.equal(10000);
    expect(transformed.fastsettMaanedsinntektFL.maanedsinntekt).to.equal(30000);
    expect(transformed.faktaOmBeregningTilfeller.length).to.equal(3);
    expect(transformed.faktaOmBeregningTilfeller.includes(VURDER_NYOPPSTARTET_FL)).to.equal(true);
    expect(transformed.faktaOmBeregningTilfeller.includes(FASTSETT_MAANEDSINNTEKT_FL)).to.equal(true);
    expect(
      transformed.faktaOmBeregningTilfeller.includes(FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING),
    ).to.equal(true);
  });

  it('skal vise komponent', () => {
    const tilfeller = [VURDER_LONNSENDRING, VURDER_MOTTAR_YTELSE, VURDER_NYOPPSTARTET_FL];
    const andelMedLonnsendring = lagAndel(1, aktivitetStatuser.ARBEIDSTAKER, inntektskategorier.ARBEIDSTAKER);
    const andeler = [
      andelMedLonnsendring,
      {
        ...lagAndel(2, aktivitetStatuser.FRILANSER, inntektskategorier.FRILANSER),
        erNyoppstartet: true,
      },
    ];
    const beregningsgrunnlag = lagBeregningsgrunnlag(andeler);
    const wrapper = shallow(
      <VurderOgFastsettATFL.WrappedComponent
        readOnly={false}
        isAvklaringsbehovClosed={false}
        tilfeller={tilfeller}
        skalViseTabell={false}
        skalFastsetteAT
        skalFastsetteFL={false}
        harKunstigArbeid={false}
        manglerInntektsmelding
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        alleKodeverk={{}}
        arbeidsgiverOpplysningerPerId={{}}
        avklaringsbehov={[]}
        erOverstyrer={false}
        beregningsgrunnlag={beregningsgrunnlag}
        fieldArrayID="dummyId"
        vilkaarPeriodeFieldArrayIndex={0}
      />,
    );

    const inntektstabellPanel = wrapper.find(InntektstabellPanel);
    const lonnsendringForm = inntektstabellPanel.find(LonnsendringTekst);
    expect(lonnsendringForm.length).to.equal(1);

    const nyoppstartetFLForm = inntektstabellPanel.find(NyoppstartetFLForm);
    expect(nyoppstartetFLForm.length).to.equal(1);

    const vurderMottarYtelseForm = inntektstabellPanel.find(VurderMottarYtelseForm);
    expect(vurderMottarYtelseForm.length).to.equal(1);
  });

  it('skal returnere true for fastsetting av FL-inntekt når FL-inntekt skal fastsettes', () => {
    const values = {};
    values[INNTEKT_FIELD_ARRAY_NAME] = [
      lagAndelValues(1, 10000, inntektskategorier.FRILANSER, aktivitetStatuser.FRILANSER),
      lagAndelValues(2, 20000, inntektskategorier.ARBEIDSTAKER, aktivitetStatuser.ARBEIDSTAKER),
    ];
    const skalFastsetteInntektMock = andel => andel.aktivitetStatus === aktivitetStatuser.FRILANSER;
    const skalFastsetteFL = skalFastsettInntektForFrilans.resultFunc(values, skalFastsetteInntektMock);
    expect(skalFastsetteFL).to.equal(true);
  });

  it('skal returnere false for fastsetting av FL-inntekt når FL-inntekt ikkje skal fastsettes', () => {
    const values = {};
    values[INNTEKT_FIELD_ARRAY_NAME] = [
      lagAndelValues(1, 10000, inntektskategorier.FRILANSER, aktivitetStatuser.FRILANSER),
      lagAndelValues(2, 20000, inntektskategorier.ARBEIDSTAKER, aktivitetStatuser.ARBEIDSTAKER),
    ];
    const skalFastsetteInntektMock = andel => andel.aktivitetStatus !== aktivitetStatuser.FRILANSER;
    const skalFastsetteFL = skalFastsettInntektForFrilans.resultFunc(values, skalFastsetteInntektMock);
    expect(skalFastsetteFL).to.equal(false);
  });

  it('skal returnere true for fastsetting av AT-inntekt når AT-inntekt skal fastsettes', () => {
    const values = {};
    const fieldArrayID = '123';
    values[[`${fieldArrayID}.${INNTEKT_FIELD_ARRAY_NAME}`]] = [
      lagAndelValues(1, 10000, inntektskategorier.FRILANSER, aktivitetStatuser.FRILANSER),
      lagAndelValues(2, 20000, inntektskategorier.ARBEIDSTAKER, aktivitetStatuser.ARBEIDSTAKER),
    ];
    const skalFastsetteInntektMock = andel => andel.aktivitetStatus === aktivitetStatuser.ARBEIDSTAKER;
    const skalFastsetteAT = skalFastsettInntektForArbeidstaker.resultFunc(
      values,
      skalFastsetteInntektMock,
      fieldArrayID,
    );
    expect(skalFastsetteAT).to.equal(true);
  });

  it('skal returnere false for fastsetting av AT-inntekt når AT-inntekt ikkje skal fastsettes', () => {
    const values = {};
    const fieldArrayID = '123';
    values[[`${fieldArrayID}.${INNTEKT_FIELD_ARRAY_NAME}`]] = [
      lagAndelValues(1, 10000, inntektskategorier.FRILANSER, aktivitetStatuser.FRILANSER),
      lagAndelValues(2, 20000, inntektskategorier.ARBEIDSTAKER, aktivitetStatuser.ARBEIDSTAKER),
    ];
    const skalFastsetteInntektMock = andel => andel.aktivitetStatus !== aktivitetStatuser.ARBEIDSTAKER;
    const skalFastsetteAT = skalFastsettInntektForArbeidstaker.resultFunc(
      values,
      skalFastsetteInntektMock,
      fieldArrayID,
    );
    expect(skalFastsetteAT).to.equal(false);
  });
});
