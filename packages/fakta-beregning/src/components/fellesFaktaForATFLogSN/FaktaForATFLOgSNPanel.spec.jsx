import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import avklaringsbehovCodes from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { FaktaForATFLOgSNPanelImpl, transformValues, transformValuesFaktaForATFLOgSN } from './FaktaForATFLOgSNPanel';
import TidsbegrensetArbeidsforholdForm from './tidsbegrensetArbeidsforhold/TidsbegrensetArbeidsforholdForm';
import NyIArbeidslivetSNForm from './nyIArbeidslivet/NyIArbeidslivetSNForm';
import { erNyoppstartetFLField } from './vurderOgFastsettATFL/forms/NyoppstartetFLForm';
import VurderOgFastsettATFL from './vurderOgFastsettATFL/VurderOgFastsettATFL';
import { INNTEKT_FIELD_ARRAY_NAME } from './BgFordelingUtils';

const { VURDER_FAKTA_FOR_ATFL_SN } = avklaringsbehovCodes;

const avklaringsbehov = [
  {
    definisjon: VURDER_FAKTA_FOR_ATFL_SN,
    status: 'OPPR',
  },
];

const showTableCallback = sinon.spy();

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
  faktaOmBeregning: {},
});

describe('<FaktaForATFLOgSNPanel>', () => {
  it('skal vise TidsbegrensetArbeidsforholdForm', () => {
    const aktivertePaneler = [faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD];
    const wrapper = shallow(
      <FaktaForATFLOgSNPanelImpl
        fieldArrayID="dummyId"
        readOnly={false}
        aktivePaneler={aktivertePaneler}
        isAvklaringsbehovClosed={false}
        showTableCallback={showTableCallback}
        faktaOmBeregning={{}}
        beregningsgrunnlag={{}}
        alleKodeverk={{}}
        arbeidsgiverOpplysningerPerId={{}}
        avklaringsbehov={avklaringsbehov}
        behandlingVersjon={1}
        behandlingId={1}
        erOverstyrer={false}
        vilkaarPeriodeFieldArrayIndex={0}
      />,
    );
    const tidsbegrensetArbeidsforhold = wrapper.find(TidsbegrensetArbeidsforholdForm);
    expect(tidsbegrensetArbeidsforhold).to.have.length(1);
  });

  it('skal vise NyIArbeidslivetSNForm', () => {
    const aktivertePaneler = [faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET];
    const wrapper = shallow(
      <FaktaForATFLOgSNPanelImpl
        fieldArrayID="dummyId"
        readOnly={false}
        aktivePaneler={aktivertePaneler}
        isAvklaringsbehovClosed={false}
        showTableCallback={showTableCallback}
        faktaOmBeregning={{}}
        beregningsgrunnlag={{}}
        alleKodeverk={{}}
        arbeidsgiverOpplysningerPerId={{}}
        avklaringsbehov={avklaringsbehov}
        behandlingVersjon={1}
        behandlingId={1}
        erOverstyrer={false}
        vilkaarPeriodeFieldArrayIndex={0}
      />,
    );
    const nyIArbeidslivet = wrapper.find(NyIArbeidslivetSNForm);
    expect(nyIArbeidslivet).to.have.length(1);
  });

  it('skal vise NyoppstartetFLForm', () => {
    const aktivertePaneler = [faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL];
    const wrapper = shallow(
      <FaktaForATFLOgSNPanelImpl
        fieldArrayID="dummyId"
        readOnly={false}
        aktivePaneler={aktivertePaneler}
        isAvklaringsbehovClosed={false}
        showTableCallback={showTableCallback}
        faktaOmBeregning={{}}
        beregningsgrunnlag={{}}
        alleKodeverk={{}}
        arbeidsgiverOpplysningerPerId={{}}
        avklaringsbehov={avklaringsbehov}
        behandlingVersjon={1}
        behandlingId={1}
        erOverstyrer={false}
        vilkaarPeriodeFieldArrayIndex={0}
      />,
    );
    const vurderATFL = wrapper.find(VurderOgFastsettATFL);
    expect(vurderATFL).to.have.length(1);
  });

  it('skal kunne transform values nyoppstartet fl og lønnsendring', () => {
    const aktivePaneler = [
      faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL,
      faktaOmBeregningTilfelle.VURDER_LONNSENDRING,
    ];
    const forholdMedAtOgFl = {
      andelsnr: 2,
      inntektskategori: {
        navn: 'Arbeidstaker',
      },
      arbeidsforhold: {
        arbeidsgiverId: '123',
        arbeidsforholdId: 'abc',
        startdato: '2018-01-01',
      },
    };

    const forholdMedLonnsendringUtenIM = {
      andelsnr: 2,
      inntektskategori: 'ARBEIDSTAKER',
      arbeidsforhold: {
        arbeidsgiverId: '123',
        arbeidsforholdId: 'abc',
        startdato: '2018-01-01',
      },
    };

    const frilansAndel = {
      inntektskategori: {
        navn: 'Frilans',
      },
      arbeidsforhold: {
        startdato: '2018-01-01',
        opphoersdato: '2018-06-01',
      },
      andelsnr: 1,
      arbeidsforholdType: {
        navn: 'Frilans',
      },
      aktivitetStatus: aktivitetStatus.FRILANSER,
    };

    const faktaOmBeregning = {
      faktaOmBeregningTilfeller: aktivePaneler,
      arbeidsforholdMedLønnsendringUtenIM: [forholdMedLonnsendringUtenIM],
      arbeidstakerOgFrilanserISammeOrganisasjonListe: [forholdMedAtOgFl],
      frilansAndel,
    };
    const beregningsgrunnlag = lagBeregningsgrunnlag([forholdMedLonnsendringUtenIM, frilansAndel]);
    const values = {
      tilfeller: aktivePaneler,
      vurderMottarYtelse: undefined,
      faktaOmBeregning,
      beregningsgrunnlag,
    };
    values[erNyoppstartetFLField] = true;
    values[INNTEKT_FIELD_ARRAY_NAME] = [
      {
        fastsattBelop: '10 000',
        inntektskategori: 'ARBEIDSTAKER',
        andelsnr: forholdMedLonnsendringUtenIM.andelsnr,
        skalRedigereInntekt: true,
      },
      {
        fastsattBelop: '20 000',
        inntektskategori: 'FRILANS',
        andelsnr: frilansAndel.andelsnr,
        aktivitetStatus: aktivitetStatus.FRILANSER,
        skalRedigereInntekt: true,
      },
    ];
    const transformedValues = transformValuesFaktaForATFLOgSN(values);
    expect(transformedValues.fakta.faktaOmBeregningTilfeller).to.have.length(3);
    expect(
      transformedValues.fakta.faktaOmBeregningTilfeller.includes(
        faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING,
      ),
    ).is.eql(true);
    expect(
      transformedValues.fakta.faktaOmBeregningTilfeller.includes(faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL),
    ).is.eql(true);
    expect(
      transformedValues.fakta.faktaOmBeregningTilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL),
    ).is.eql(true);
    expect(transformedValues.fakta.fastsattUtenInntektsmelding.andelListe).to.have.length(1);
    expect(transformedValues.fakta.fastsattUtenInntektsmelding.andelListe[0].andelsnr).to.eql(2);
    expect(transformedValues.fakta.fastsattUtenInntektsmelding.andelListe[0].fastsattBeløp).to.eql(10000);
    expect(transformedValues.fakta.fastsettMaanedsinntektFL.maanedsinntekt).to.eql(20000);
  });

  it('skal transform values for nyIArbeidslivet om kun ny i arbeidslivet', () => {
    const nyIArbTransform = sinon.spy();
    const kortvarigTransform = sinon.spy();
    const nyoppstartetTransform = sinon.spy();
    const lonnsendringTransform = sinon.spy();
    const etterlonnTransform = sinon.spy();
    const mottarYtelseTransform = sinon.spy();

    const aktivePaneler = [faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET];
    transformValues(
      aktivePaneler,
      nyIArbTransform,
      kortvarigTransform,
      nyoppstartetTransform,
      lonnsendringTransform,
      etterlonnTransform,
      mottarYtelseTransform,
    )({}, {});
    expect(nyIArbTransform).to.have.property('callCount', 1);
    expect(kortvarigTransform).to.have.property('callCount', 0);
    expect(nyoppstartetTransform).to.have.property('callCount', 0);
    expect(lonnsendringTransform).to.have.property('callCount', 0);
    expect(etterlonnTransform).to.have.property('callCount', 0);
    expect(mottarYtelseTransform).to.have.property('callCount', 0);
  });

  it('skal transform values for nyIArbeidslivet og kortvarig om kun ny i arbeidslivet og kortvarig', () => {
    const nyIArbTransform = sinon.spy();
    const kortvarigTransform = sinon.spy();
    const nyoppstartetTransform = sinon.spy();
    const lonnsendringTransform = sinon.spy();
    const etterlonnTransform = sinon.spy();
    const mottarYtelseTransform = sinon.spy();

    const aktivePaneler = [
      faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET,
      faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD,
    ];
    transformValues(
      aktivePaneler,
      nyIArbTransform,
      kortvarigTransform,
      nyoppstartetTransform,
      lonnsendringTransform,
      etterlonnTransform,
      mottarYtelseTransform,
    )({}, {});
    expect(nyIArbTransform).to.have.property('callCount', 1);
    expect(kortvarigTransform).to.have.property('callCount', 1);
    expect(nyoppstartetTransform).to.have.property('callCount', 0);
    expect(lonnsendringTransform).to.have.property('callCount', 0);
    expect(etterlonnTransform).to.have.property('callCount', 0);
    expect(mottarYtelseTransform).to.have.property('callCount', 0);
  });
});
