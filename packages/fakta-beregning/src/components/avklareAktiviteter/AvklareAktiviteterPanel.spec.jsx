import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import avklaringsbehovCodes from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import opptjeningAktivitetType from '@fpsak-frontend/kodeverk/src/opptjeningAktivitetType';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { CheckboxField } from '@fpsak-frontend/form';
import { AksjonspunktHelpText, BorderBox } from '@fpsak-frontend/shared-components';
import { FaktaSubmitButton } from '@k9-sak-web/fakta-felles';
import { lagStateMedAvklaringsbehovOgBeregningsgrunnlag } from '../beregning-test-helper';
import { erAvklartAktivitetEndret, transformValues } from './AvklareAktiviteterPanel';
import AvklareAktiviteterPanelContent, {
  BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME,
  buildInitialValuesAvklarAktiviteter,
  MANUELL_OVERSTYRING_FIELD,
} from './AvklareAktiviteterPanelContent';
import VurderAktiviteterPanel from './VurderAktiviteterPanel';
import { formNameAvklarAktiviteter } from '../BeregningFormUtils';
import { intlMock } from '../../../i18n/index';

const { AVKLAR_AKTIVITETER, OVERSTYRING_AV_BEREGNINGSAKTIVITETER, VURDER_FAKTA_FOR_ATFL_SN } = avklaringsbehovCodes;

const behandlingProps = {
  behandlingId: 1000051,
  behandlingVersjon: 1,
};

const alleKodeverk = {
  [kodeverkTyper.OPPTJENING_AKTIVITET_TYPE]: [
    {
      kode: opptjeningAktivitetType.ARBEID,
      navn: 'Arbeid',
    },
    {
      kode: opptjeningAktivitetType.FRILANS,
      navn: 'Frilans',
    },
    {
      kode: opptjeningAktivitetType.DAGPENGER,
      navn: 'Dagpenger',
    },
    {
      kode: opptjeningAktivitetType.NARING,
      navn: 'Næring',
    },
  ],
};

const apsAvklarAktiviteter = [{ definisjon: { kode: AVKLAR_AKTIVITETER } }];

const lagStateMedAvklarAktitiveter = (
  avklarAktiviteter,
  values = {},
  initial = {},
  avklaringsbehov = apsAvklarAktiviteter,
) => {
  const faktaOmBeregning = {
    avklarAktiviteter,
  };
  return lagStateMedAvklaringsbehovOgBeregningsgrunnlag(
    avklaringsbehov,
    { faktaOmBeregning },
    formNameAvklarAktiviteter,
    values,
    initial,
  );
};

const aktivitet1 = {
  arbeidsgiverIdent: '384723894723',
  fom: '2019-01-01',
  tom: null,
  skalBrukes: null,
  arbeidsforholdType: { kode: 'ARBEID', navn: 'Arbeid', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
};

const aktivitet2 = {
  arbeidsgiverIdent: '334534623342',
  eksternArbeidsforholdId: 'efj8343f34f',
  fom: '2019-01-01',
  tom: '2019-02-02',
  skalBrukes: true,
  arbeidsforholdType: { kode: 'ARBEID', navn: 'Arbeid', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
};

const aktivitet3 = {
  arbeidsgiverIdent: '324234234234',
  eksternArbeidsforholdId: 'efj8343f34f',
  fom: '2019-01-01',
  tom: '2019-02-02',
  skalBrukes: false,
  arbeidsforholdType: { kode: 'ARBEID', navn: 'Arbeid', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
};

const aktivitetAAP = {
  arbeidsgiverIdent: null,
  arbeidsforholdType: { kode: 'AAP', navn: 'Arbeidsavklaringspenger', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
  fom: '2019-01-01',
  tom: '2020-02-02',
  skalBrukes: null,
};

const aktiviteter = [aktivitet1, aktivitet2, aktivitet3, aktivitetAAP];

const arbeidsgiverOpplysningerPerId = {
  384723894723: {
    identifikator: '384723894723',
    referanse: '384723894723',
    navn: 'Arbeidsgiveren',
    fødselsdato: null,
  },
  334534623342: {
    identifikator: '334534623342',
    referanse: '334534623342',
    navn: 'Arbeidsgiveren2',
    fødselsdato: null,
  },
  324234234234: {
    identifikator: 324234234234,
    referanse: 324234234234,
    navn: 'Arbeidsgiveren3',
    fødselsdato: "1960.01.01",
  },
};

const id1 = '3847238947232019-01-01';
const id2 = '334534623342efj8343f34f2019-01-01';
const id3 = '324234234234efj8343f34f2019-01-01';
const idAAP = 'AAP2019-01-01';

describe('<AvklareAktiviteterPanel>', () => {
  it('skal vise VurderAktiviteterPanel', () => {
    const avklarAktiviteter = {
      aktiviteterTomDatoMapping: [{ tom: '2019-02-02', aktiviteter }],
    };
    const avklaringsbehov = [{ definisjon: { kode: AVKLAR_AKTIVITETER }, status: { kode: 'OPPR' } }];
    const beregningsgrunnlag = {
      avklaringsbehov,
      faktaOmBeregning: {
        avklarAktiviteter,
        andelerForFaktaOmBeregning: [{ skalKunneEndreAktivitet: true, lagtTilAvSaksbehandler: true }],
      },
    };
    const wrapper = shallow(
      <AvklareAktiviteterPanelContent.WrappedComponent
        {...reduxFormPropsMock}
        intl={intlMock}
        readOnly={false}
        isAvklaringsbehovClosed={false}
        hasBegrunnelse={false}
        submittable
        isDirty
        submitEnabled
        helpText={[]}
        harAndreAvklaringsbehovIPanel={false}
        erEndret={false}
        kanOverstyre={false}
        avklaringsbehov={avklaringsbehov}
        erOverstyrt={false}
        erBgOverstyrt={false}
        behandlingFormPrefix="test"
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        reduxFormInitialize={sinon.spy()}
        aktivtBeregningsgrunnlagIndex={0}
        beregningsgrunnlag={beregningsgrunnlag}
        alleBeregningsgrunnlag={[beregningsgrunnlag]}
        fields={[]}
        {...behandlingProps}
      />,
    );
    const vurderAktivitetPanel = wrapper.find(VurderAktiviteterPanel);
    expect(vurderAktivitetPanel).has.length(1);
  });

  it('skal ikkje vise VurderAktiviteterPanel panel', () => {
    const avklarAktiviteter = {
      aktiviteterTomDatoMapping: null,
    };
    const avklaringsbehov = [];
    const wrapper = shallow(
      <AvklareAktiviteterPanelContent.WrappedComponent
        {...reduxFormPropsMock}
        intl={intlMock}
        readOnly={false}
        isAvklaringsbehovClosed={false}
        hasBegrunnelse={false}
        submittable
        isDirty
        submitEnabled
        helpText={[]}
        harAndreAvklaringsbehovIPanel={false}
        erEndret={false}
        kanOverstyre={false}
        avklaringsbehov={avklaringsbehov}
        erOverstyrt={false}
        erBgOverstyrt={false}
        behandlingFormPrefix="test"
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        beregningsgrunnlag={{
          avklaringsbehov,
          faktaOmBeregning: {
            avklarAktiviteter,
            andelerForFaktaOmBeregning: [{ skalKunneEndreAktivitet: true, lagtTilAvSaksbehandler: true }],
          },
        }}
        aktivtBeregningsgrunnlagIndex={0}
        reduxFormInitialize={sinon.spy()}
        fields={[]}
        {...behandlingProps}
      />,
    );
    const radio = wrapper.find(VurderAktiviteterPanel);
    expect(radio).has.length(0);
  });

  it('skal vise overstyringsknapp', () => {
    const avklarAktiviteter = {
      aktiviteterTomDatoMapping: [{ tom: '2019-02-02', aktiviteter }],
    };
    const avklaringsbehov = [{ definisjon: { kode: OVERSTYRING_AV_BEREGNINGSAKTIVITETER }, status: { kode: 'OPPR' } }];

    const wrapper = shallow(
      <AvklareAktiviteterPanelContent.WrappedComponent
        {...reduxFormPropsMock}
        intl={intlMock}
        readOnly={false}
        isAvklaringsbehovClosed={false}
        hasBegrunnelse={false}
        submittable
        isDirty
        submitEnabled
        helpText={[]}
        harAndreAvklaringsbehovIPanel={false}
        erEndret={false}
        kanOverstyre
        avklaringsbehov={avklaringsbehov}
        aktivtBeregningsgrunnlagIndex={0}
        erOverstyrt={false}
        erBgOverstyrt={false}
        behandlingFormPrefix="test"
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        beregningsgrunnlag={{
          avklaringsbehov,
          faktaOmBeregning: {
            avklarAktiviteter,
            andelerForFaktaOmBeregning: [{ skalKunneEndreAktivitet: true, lagtTilAvSaksbehandler: true }],
          },
        }}
        reduxFormInitialize={sinon.spy()}
        fields={[]}
        {...behandlingProps}
      />,
    );
    const checkbox = wrapper.find(CheckboxField);
    expect(checkbox).has.length(1);
  });

  it('skal ikkje vise AksjonspunktHelpText ved overstyring', () => {
    const avklarAktiviteter = {
      aktiviteterTomDatoMapping: [{ tom: '2019-02-02', aktiviteter }],
    };
    const avklaringsbehov = [{ definisjon: { kode: OVERSTYRING_AV_BEREGNINGSAKTIVITETER }, status: { kode: 'OPPR' } }];

    const wrapper = shallow(
      <AvklareAktiviteterPanelContent.WrappedComponent
        {...reduxFormPropsMock}
        intl={intlMock}
        readOnly={false}
        isAvklaringsbehovClosed={false}
        beregningsgrunnlag={{
          avklaringsbehov,
          faktaOmBeregning: {
            avklarAktiviteter,
            andelerForFaktaOmBeregning: [{ skalKunneEndreAktivitet: true, lagtTilAvSaksbehandler: true }],
          },
        }}
        hasBegrunnelse={false}
        submittable
        isDirty
        submitEnabled
        helpText={[]}
        harAndreAvklaringsbehovIPanel={false}
        erEndret={false}
        kanOverstyre
        avklaringsbehov={avklaringsbehov}
        erOverstyrt
        erBgOverstyrt={false}
        behandlingFormPrefix="test"
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        fields={[]}
        reduxFormInitialize={sinon.spy()}
        {...behandlingProps}
      />,
    );
    const helptext = wrapper.find(AksjonspunktHelpText);
    expect(helptext).has.length(0);
  });

  it('skal vise knapp inne i borderbox når man har andre aksjonspunkt i beregning', () => {
    const avklarAktiviteter = {
      aktiviteterTomDatoMapping: [{ tom: '2019-02-02', aktiviteter }],
    };
    const avklaringsbehov = [
      { definisjon: { kode: AVKLAR_AKTIVITETER }, status: { kode: 'UTFO' } },
      { definisjon: { kode: VURDER_FAKTA_FOR_ATFL_SN }, status: { kode: 'OPPR' } },
    ];

    const beregningsgrunnlag = {
      avklaringsbehov,
      faktaOmBeregning: {
        avklarAktiviteter,
        andelerForFaktaOmBeregning: [{ skalKunneEndreAktivitet: true, lagtTilAvSaksbehandler: true }],
      },
    };
    const wrapper = shallow(
      <AvklareAktiviteterPanelContent.WrappedComponent
        {...reduxFormPropsMock}
        intl={intlMock}
        readOnly={false}
        isAvklaringsbehovClosed={false}
        beregningsgrunnlag={beregningsgrunnlag}
        alleBeregningsgrunnlag={[beregningsgrunnlag]}
        hasBegrunnelse={false}
        submittable
        aktivtBeregningsgrunnlagIndex={0}
        isDirty
        submitEnabled
        helpText={[]}
        harAndreAvklaringsbehovIPanel
        erEndret={false}
        kanOverstyre
        avklaringsbehov={avklaringsbehov}
        erOverstyrt={false}
        erBgOverstyrt={false}
        behandlingFormPrefix="test"
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        reduxFormInitialize={sinon.spy()}
        fields={[]}
        {...behandlingProps}
      />,
    );
    const borderBox = wrapper.find(BorderBox);
    expect(borderBox).has.length(1);
    const submitBtn = borderBox.find(FaktaSubmitButton);
    expect(submitBtn).has.length(1);
  });

  it('skal vise knapp inne i borderbox når man skal overstyre beregningsgrunnlag', () => {
    const avklarAktiviteter = {
      aktiviteterTomDatoMapping: [{ tom: '2019-02-02', aktiviteter }],
    };
    const avklaringsbehov = [{ definisjon: { kode: AVKLAR_AKTIVITETER }, status: { kode: 'UTFO' } }];
    const wrapper = shallow(
      <AvklareAktiviteterPanelContent.WrappedComponent
        {...reduxFormPropsMock}
        intl={intlMock}
        readOnly={false}
        isAvklaringsbehovClosed={false}
        beregningsgrunnlag={{
          avklaringsbehov,
          faktaOmBeregning: {
            avklarAktiviteter,
            andelerForFaktaOmBeregning: [{ skalKunneEndreAktivitet: true, lagtTilAvSaksbehandler: true }],
          },
        }}
        hasBegrunnelse={false}
        submittable
        isDirty
        aktivtBeregningsgrunnlagIndex={0}
        submitEnabled
        helpText={[]}
        harAndreAvklaringsbehovIPanel={false}
        erEndret={false}
        kanOverstyre
        avklaringsbehov={avklaringsbehov}
        erOverstyrt={false}
        erBgOverstyrt
        behandlingFormPrefix="test"
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        reduxFormInitialize={sinon.spy()}
        fields={[]}
        {...behandlingProps}
      />,
    );
    const borderBox = wrapper.find(BorderBox);
    expect(borderBox).has.length(1);
    const submitBtn = borderBox.find(FaktaSubmitButton);
    expect(submitBtn).has.length(1);
  });

  it('skal vise knapp inne i borderbox når man skal overstyre aktiviteter i beregningsgrunnlaget', () => {
    const avklarAktiviteter = {
      aktiviteterTomDatoMapping: [{ tom: '2019-02-02', aktiviteter }],
    };
    const avklaringsbehov = [];

    const wrapper = shallow(
      <AvklareAktiviteterPanelContent.WrappedComponent
        {...reduxFormPropsMock}
        intl={intlMock}
        readOnly={false}
        isAvklaringsbehovClosed={false}
        beregningsgrunnlag={{
          avklaringsbehov,
          faktaOmBeregning: {
            avklarAktiviteter,
            andelerForFaktaOmBeregning: [{ skalKunneEndreAktivitet: true, lagtTilAvSaksbehandler: true }],
          },
        }}
        hasBegrunnelse={false}
        submittable
        isDirty
        aktivtBeregningsgrunnlagIndex={0}
        submitEnabled
        helpText={[]}
        harAndreAvklaringsbehovIPanel={false}
        erEndret={false}
        kanOverstyre
        avklaringsbehov={avklaringsbehov}
        erOverstyrt
        erBgOverstyrt={false}
        behandlingFormPrefix="test"
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        reduxFormInitialize={sinon.spy()}
        fields={[]}
        {...behandlingProps}
      />,
    );
    const borderBox = wrapper.find(BorderBox);
    expect(borderBox).has.length(1);
    const submitBtn = borderBox.find(FaktaSubmitButton);
    expect(submitBtn).has.length(1);
  });

  it('skal ikkje vise knapp inne i borderbox når man har åpent aksjonspunkt i avklar aktiviteter', () => {
    const avklarAktiviteter = {
      aktiviteterTomDatoMapping: [{ tom: '2019-02-02', aktiviteter }],
    };
    const avklaringsbehov = [{ definisjon: { kode: AVKLAR_AKTIVITETER }, status: { kode: 'OPPR' } }];
    const wrapper = shallow(
      <AvklareAktiviteterPanelContent.WrappedComponent
        {...reduxFormPropsMock}
        intl={intlMock}
        readOnly={false}
        isAvklaringsbehovClosed={false}
        beregningsgrunnlag={{
          avklaringsbehov,
          faktaOmBeregning: {
            avklarAktiviteter,
            andelerForFaktaOmBeregning: [{ skalKunneEndreAktivitet: true, lagtTilAvSaksbehandler: true }],
          },
        }}
        hasBegrunnelse={false}
        aktivtBeregningsgrunnlagIndex={0}
        submittable
        isDirty
        submitEnabled
        helpText={[]}
        harAndreAvklaringsbehovIPanel={false}
        erEndret={false}
        kanOverstyre
        avklaringsbehov={avklaringsbehov}
        erOverstyrt
        erBgOverstyrt={false}
        behandlingFormPrefix="test"
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        reduxFormInitialize={sinon.spy()}
        fields={[]}
        {...behandlingProps}
      />,
    );
    const borderBox = wrapper.find(BorderBox);
    expect(borderBox).has.length(1);
    const submitBtn = borderBox.find(FaktaSubmitButton);
    expect(submitBtn).has.length(0);
  });

  it('skal ikkje vise knapp inne i borderbox når man har åpent overstyr aksjonspunkt for aktiviteter', () => {
    const avklarAktiviteter = {
      aktiviteterTomDatoMapping: [{ tom: '2019-02-02', aktiviteter }],
    };
    const avklaringsbehov = [{ definisjon: { kode: OVERSTYRING_AV_BEREGNINGSAKTIVITETER }, status: { kode: 'OPPR' } }];
    const wrapper = shallow(
      <AvklareAktiviteterPanelContent.WrappedComponent
        {...reduxFormPropsMock}
        intl={intlMock}
        readOnly={false}
        isAvklaringsbehovClosed={false}
        beregningsgrunnlag={{
          avklaringsbehov,
          faktaOmBeregning: {
            avklarAktiviteter,
            andelerForFaktaOmBeregning: [{ skalKunneEndreAktivitet: true, lagtTilAvSaksbehandler: true }],
          },
        }}
        aktivtBeregningsgrunnlagIndex={0}
        hasBegrunnelse={false}
        submittable
        isDirty
        submitEnabled
        helpText={[]}
        harAndreAvklaringsbehovIPanel={false}
        erEndret={false}
        kanOverstyre
        avklaringsbehov={avklaringsbehov}
        erOverstyrt
        erBgOverstyrt={false}
        behandlingFormPrefix="test"
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        fields={[]}
        reduxFormInitialize={sinon.spy()}
        {...behandlingProps}
      />,
    );
    const borderBox = wrapper.find(BorderBox);
    expect(borderBox).has.length(1);
    const submitBtn = borderBox.find(FaktaSubmitButton);
    expect(submitBtn).has.length(0);
  });

  it('skal teste at initial values blir bygget', () => {
    const avklarAktiviteter = {
      aktiviteterTomDatoMapping: [{ tom: '2019-02-02', aktiviteter }],
    };

    const beregningsgrunnlag = { 
      avklaringsbehov: apsAvklarAktiviteter,
      faktaOmBeregning: { avklarAktiviteter } 
    };
    const initialValues = buildInitialValuesAvklarAktiviteter(beregningsgrunnlag, {
      aktivtBeregningsgrunnlagIndex: 1,
    });
    expect(initialValues !== null).to.equal(true);
    expect(initialValues[MANUELL_OVERSTYRING_FIELD]).to.equal(false);
  });

  it('skal teste at initial values blir bygget uten aksjonspunkt', () => {
    const avklarAktiviteter = {
      aktiviteterTomDatoMapping: [{ tom: '2019-02-02', aktiviteter }],
    };
    const aps = [];
    const initialValues = buildInitialValuesAvklarAktiviteter(
      { 
        avklaringsbehov: aps,
        faktaOmBeregning: { avklarAktiviteter } },
      {
        aktivtBeregningsgrunnlagIndex: 1
      },
    );
    expect(initialValues !== null).to.equal(true);
    expect(initialValues[MANUELL_OVERSTYRING_FIELD]).to.equal(false);
  });

  it('skal teste at initial values blir bygget med overstyrt aksjonspunkt', () => {
    const avklarAktiviteter = {
      aktiviteterTomDatoMapping: [{ tom: '2019-02-02', aktiviteter }],
    };
    const aps = [{ definisjon: { kode: OVERSTYRING_AV_BEREGNINGSAKTIVITETER } }];
    const initialValues = buildInitialValuesAvklarAktiviteter(
      { 
        avklaringsbehov: aps,
        faktaOmBeregning: { avklarAktiviteter } },
      {
        aktivtBeregningsgrunnlagIndex: 1
      },
    );
    expect(initialValues !== null).to.equal(true);
    expect(initialValues[MANUELL_OVERSTYRING_FIELD]).to.equal(true);
  });

  it('skal transform values for avklar aktiviteter aksjonspunkt', () => {
    const avklarAktiviteter = {
      aktiviteterTomDatoMapping: [{ tom: '2019-02-02', aktiviteter }],
    };
    const values = {
      avklareAktiviteterListe: [{ avklarAktiviteter, avklaringsbehov: apsAvklarAktiviteter }],
      avklarAktiviteter,
    };
    values.avklareAktiviteterListe[0][id1] = { skalBrukes: false };
    values.avklareAktiviteterListe[0][id2] = { skalBrukes: true };
    values.avklareAktiviteterListe[0][id3] = { skalBrukes: true };
    values.avklareAktiviteterListe[0][idAAP] = { skalBrukes: true };
    const vilkårsperioder = [{ periode: { fom: '2019-02-02', tom: '2019-02-05' } }];
    const bg = { 
      avklaringsbehov: apsAvklarAktiviteter,
      skjaeringstidspunktBeregning: '2019-02-02' 
    };
    const transformed = transformValues(values, vilkårsperioder, bg);
    expect(transformed[0].grunnlag.length).to.equal(1);
    expect(transformed[0].grunnlag[0].beregningsaktivitetLagreDtoList[0].arbeidsgiverIdentifikator).to.equal(
      aktivitet1.arbeidsgiverIdent,
    );
  });

  it('skal transform values om for valgt overstyring', () => {
    const avklarAktiviteter = {
      aktiviteterTomDatoMapping: [{ tom: '2019-02-02', aktiviteter }],
    };
    const aps = [];
    const values = {
      avklareAktiviteterListe: [{ avklarAktiviteter, avklaringsbehov: aps }],
      avklarAktiviteter,
    };
    values.avklareAktiviteterListe[0][id1] = { skalBrukes: null };
    values.avklareAktiviteterListe[0][id2] = { skalBrukes: true };
    values.avklareAktiviteterListe[0][id3] = { skalBrukes: false };
    values.avklareAktiviteterListe[0][idAAP] = { skalBrukes: true };
    values.avklareAktiviteterListe[0][BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME] = 'begrunnelse';
    values.avklareAktiviteterListe[0][MANUELL_OVERSTYRING_FIELD] = true;
    const vilkårsperioder = [{ periode: { fom: '2019-02-02', tom: '2019-02-05' } }];
    const bg = { avklaringsbehov: aps, skjaeringstidspunktBeregning: '2019-02-02' };
    const transformed = transformValues(values, vilkårsperioder, bg);
    expect(transformed.length).to.equal(1);
    expect(transformed[0].beregningsaktivitetLagreDtoList[0].arbeidsgiverIdentifikator).to.equal(
      aktivitet3.arbeidsgiverIdent,
    );
    expect(transformed[0].begrunnelse).to.equal('begrunnelse');
    expect(transformed[0].kode).to.equal(OVERSTYRING_AV_BEREGNINGSAKTIVITETER);
  });

  it('skal returnere true for endret begrunnelse', () => {
    const avklarAktiviteter = {
      aktiviteterTomDatoMapping: [{ tom: '2019-02-02', aktiviteter }],
    };
    const values = {};
    values[id1] = { skalBrukes: null };
    values[id2] = { skalBrukes: true };
    values[id3] = { skalBrukes: false };
    values[idAAP] = { skalBrukes: null };
    values[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME] = 'sefiojsiejfise';
    const initial = {};
    initial[id1] = { skalBrukes: null };
    initial[id2] = { skalBrukes: true };
    initial[id3] = { skalBrukes: false };
    initial[idAAP] = { skalBrukes: null };
    initial[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME] = '53451221412412';
    const state = lagStateMedAvklarAktitiveter(avklarAktiviteter, values, initial);
    const erAvklartOgIkkeEndret = erAvklartAktivitetEndret(state, {
      ...behandlingProps,
      alleBeregningsgrunnlag: [ { avklaringsbehov: apsAvklarAktiviteter, faktaOmBeregning: { avklarAktiviteter } } ],
    });
    expect(erAvklartOgIkkeEndret).to.equal(true);
  });

  it('skal returnere true for ikkje endret begrunnelse og endret verdi', () => {
    const avklarAktiviteter = {
      aktiviteterTomDatoMapping: [{ tom: '2019-02-02', aktiviteter }],
    };
    const values = {};
    values[id1] = { skalBrukes: null };
    values[id2] = { skalBrukes: false };
    values[id3] = { skalBrukes: false };
    values[idAAP] = { skalBrukes: null };
    values[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME] = 'sefiojsiejfise';
    const initial = {};
    initial[id1] = { skalBrukes: null };
    initial[id2] = { skalBrukes: true };
    initial[id3] = { skalBrukes: false };
    initial[idAAP] = { skalBrukes: null };
    initial[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME] = 'sefiojsiejfise';
    const state = lagStateMedAvklarAktitiveter(avklarAktiviteter, values, initial);
    const erAvklartOgIkkeEndret = erAvklartAktivitetEndret(state, {
      ...behandlingProps,
      alleBeregningsgrunnlag: [ { avklaringsbehov: apsAvklarAktiviteter, faktaOmBeregning: { avklarAktiviteter } } ],
    });
    expect(erAvklartOgIkkeEndret).to.equal(true);
  });

  it('skal returnere true for endret begrunnelse og endret verdi', () => {
    const avklarAktiviteter = {
      aktiviteterTomDatoMapping: [{ tom: '2019-02-02', aktiviteter }],
    };
    const values = {};
    values[id1] = { skalBrukes: null };
    values[id2] = { skalBrukes: false };
    values[id3] = { skalBrukes: false };
    values[idAAP] = { skalBrukes: null };
    values[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME] = 'sefiojsiejfise';
    const initial = {};
    initial[id1] = { skalBrukes: null };
    initial[id2] = { skalBrukes: true };
    initial[id3] = { skalBrukes: false };
    initial[idAAP] = { skalBrukes: null };
    initial[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME] = '345346123112';
    const state = lagStateMedAvklarAktitiveter(avklarAktiviteter, values, initial);
    const erAvklartOgIkkeEndret = erAvklartAktivitetEndret(state, {
      ...behandlingProps,
      alleBeregningsgrunnlag: [ { avklaringsbehov: apsAvklarAktiviteter, faktaOmBeregning: { avklarAktiviteter } } ],
    });
    expect(erAvklartOgIkkeEndret).to.equal(true);
  });

  it('skal returnere false for ikkje endret begrunnelse og ikkje endret verdi', () => {
    const avklarAktiviteter = {
      aktiviteterTomDatoMapping: [{ tom: '2019-02-02', aktiviteter }],
    };
    const values = {};
    values[id1] = { skalBrukes: null };
    values[id2] = { skalBrukes: true };
    values[id3] = { skalBrukes: false };
    values[idAAP] = { skalBrukes: null };
    values[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME] = 'sefiojsiejfise';
    const state = lagStateMedAvklarAktitiveter(avklarAktiviteter, values, values);
    const erAvklartOgIkkeEndret = erAvklartAktivitetEndret(state, {
      ...behandlingProps,
      alleBeregningsgrunnlag: [ { avklaringsbehov: apsAvklarAktiviteter, faktaOmBeregning: { avklarAktiviteter } } ],
    });
    expect(erAvklartOgIkkeEndret).to.equal(false);
  });
});
