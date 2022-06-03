import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme/build';

import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import avklaringsbehovCodes from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';

import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { AksjonspunktHelpTextHTML } from '@fpsak-frontend/shared-components';
import shallowWithIntl from '../../../i18n';
import { BeregningFormImpl, transformValues } from './BeregningForm';
import AvviksopplysningerPanel from '../fellesPaneler/AvvikopplysningerPanel';
import SkjeringspunktOgStatusPanel2 from '../fellesPaneler/SkjeringspunktOgStatusPanel';
import AksjonspunktBehandler from '../fellesPaneler/AksjonspunktBehandler';
import Beregningsgrunnlag from '../beregningsgrunnlagPanel/Beregningsgrunnlag';
import BeregningsresultatTable from '../beregningsresultatPanel/BeregningsresultatTable';
import { buildInitialValuesForBeregningrunnlag } from '../BeregningFP';

const apFastsettBgATFL = {
  definisjon: {
    kode: avklaringsbehovCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
    navn: 'apNavn1',
  },
  status: {
    kode: 'OPPR',
    navn: 'statusNavn1',
  },
  kanLoses: false,
  erAktivt: false,
};

const apVurderVarigEndretEllerNyoppstartetSN = {
  definisjon: {
    kode: avklaringsbehovCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
    navn: 'apNavn3',
  },
  status: {
    kode: 'OPPR',
    navn: 'statusNavn3',
  },
  kanLoses: true,
  erAktivt: true,
};

const apFastsettBgSnNyIArbeidslivet = {
  definisjon: {
    kode: avklaringsbehovCodes.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
    navn: 'apNavn4',
  },
  status: {
    kode: 'OPPR',
    navn: 'statusNavn4',
  },
  kanLoses: true,
  erAktivt: true,
};

const avklaringsbehovListe = [apFastsettBgATFL];

const atAndel = [
  {
    aktivitetStatus: {
      kode: aktivitetStatus.ARBEIDSTAKER,
    },
    elementNavn: 'arbeidsgiver 1',
    beregnetPrAar: 200000,
    overstyrtPrAar: 100,
    andelsnr: 1,
  },
];

const allAndeler = [
  {
    aktivitetStatus: {
      kode: aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
    },
    elementNavn: 'arbeidsgiver 1',
    beregnetPrAar: 200000,
    overstyrtPrAar: 100,
  },
];
const allPerioder = [
  {
    bruttoPrAar: 300000,
    beregningsgrunnlagPrStatusOgAndel: allAndeler,
  },
];

const relevanteStatuser = {
  isArbeidstaker: true,
  isKombinasjonsstatus: true,
};
const lagPeriode = () => ({
  beregningsgrunnlagPeriodeFom: '2019-09-16',
  beregningsgrunnlagPeriodeTom: undefined,
  beregnetPrAar: 360000,
  bruttoPrAar: 360000,
  bruttoInkludertBortfaltNaturalytelsePrAar: 360000,
  avkortetPrAar: 360000,
  redusertPrAar: 360000,
  beregningsgrunnlagPrStatusOgAndel: [
    {
      aktivitetStatus: {
        kode: 'AT',
        kodeverk: 'AKTIVITET_STATUS',
      },
    },
  ],
  andelerLagtTilManueltIForrige: [],
});
const lagBeregningsgrunnlag = (avvikPromille, årsinntektVisningstall, sammenligningSum, dekningsgrad, tilfeller) => ({
  vilkårsperiodeFom: '2019-09-16',
  beregningsgrunnlagPeriode: [lagPeriode()],
  sammenligningsgrunnlag: {
    avvikPromille,
    rapportertPrAar: sammenligningSum,
  },
  dekningsgrad,
  årsinntektVisningstall,
  faktaOmBeregning: {
    faktaOmBeregningTilfeller: tilfeller,
  },
  aktivitetStatus: [
    {
      kode: 'AT',
    },
  ],
});
const alleKodeverk = {
  test: 'test',
};
const mockVilkar = [
  {
    vilkarType: {
      kode: 'FP_VK_41',
    },
    vilkarStatus: {
      kode: vilkarUtfallType.OPPFYLT,
    },
  },
];
const sammenligningsgrunnlag = kode => ({
  sammenligningsgrunnlagFom: '2018-09-01',
  sammenligningsgrunnlagTom: '2019-10-31',
  rapportertPrAar: 330000,
  avvikPromille: 275,
  avvikProsent: 27.5,
  sammenligningsgrunnlagType: {
    kode,
  },
  differanseBeregnet: 12100,
});
const behandling = {
  id: 1,
  versjon: 1,
  behandlingÅrsaker: [],
  sprakkode: {
    kode: 'NB',
    kodeverk: 'Språkkode',
  },
};

const getBGVilkar = vilkar =>
  vilkar ? vilkar.find(v => v.vilkarType && v.vilkarType.kode === vilkarType.BEREGNINGSGRUNNLAGVILKARET) : undefined;
describe('<BeregningForm>', () => {
  it('skal teste at AvviksopplysningerPanel får korrekte props fra BeregningFP', () => {
    const beregningsgrunnlag = lagBeregningsgrunnlag(0, 100000, 100000, 100, []);
    const sammenligningsgrunnlagPrStatus = sammenligningsgrunnlag('SAMMENLIGNING_ATFL_SN');
    beregningsgrunnlag.sammenligningsgrunnlagPrStatus = [sammenligningsgrunnlagPrStatus];
    const wrapper = shallow(
      <BeregningFormImpl
        fieldArrayID="dummyId"
        readOnly={false}
        erAktiv
        beregningsgrunnlag={beregningsgrunnlag}
        avklaringsbehov={avklaringsbehovListe}
        relevanteStatuser={relevanteStatuser}
        submitCallback={sinon.spy}
        readOnlySubmitButton
        behandling={behandling}
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={{}}
        vilkaarBG={getBGVilkar(mockVilkar)}
        {...reduxFormPropsMock}
      />,
    );
    const avvikPanel = wrapper.find(AvviksopplysningerPanel);
    expect(avvikPanel.props().sammenligningsgrunnlagPrStatus[0]).to.have.equal(sammenligningsgrunnlagPrStatus);
    expect(avvikPanel.props().relevanteStatuser).to.have.equal(relevanteStatuser);
    const expectedPerioder = lagPeriode();
    expect(avvikPanel.props().allePerioder[0]).to.eql(expectedPerioder);
  });
  it('skal teste at AksjonspunktHjelp rendrer fra BeregningFP', () => {
    const wrapper = shallow(
      <BeregningFormImpl
        fieldArrayID="dummyId"
        readOnly={false}
        erAktiv
        avklaringsbehov={avklaringsbehovListe}
        beregningsgrunnlag={lagBeregningsgrunnlag(0, 120000, 100000, 100, [])}
        behandling={behandling}
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={{}}
        relevanteStatuser={relevanteStatuser}
        submitCallback={sinon.spy}
        readOnlySubmitButton
        vilkaarBG={getBGVilkar(mockVilkar)}
        {...reduxFormPropsMock}
      />,
    );
    const aksjonspunktHelpTextHTML = wrapper.find(AksjonspunktHelpTextHTML);
    expect(aksjonspunktHelpTextHTML.length).to.equal(1);
  });
  it('skal teste at SkjeringspunktOgStatusPanel får korrekte props fra BeregningFP', () => {
    const wrapper = shallow(
      <BeregningFormImpl
        fieldArrayID="dummyId"
        readOnly={false}
        erAktiv
        avklaringsbehov={avklaringsbehovListe}
        beregningsgrunnlag={lagBeregningsgrunnlag(0, 120000, 100000, 100, [])}
        behandling={behandling}
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={{}}
        relevanteStatuser={relevanteStatuser}
        submitCallback={sinon.spy}
        readOnlySubmitButton
        vilkaarBG={getBGVilkar(mockVilkar)}
        {...reduxFormPropsMock}
      />,
    );
    const skjeringspunktOgStatusPanel = wrapper.find(SkjeringspunktOgStatusPanel2);
    expect(skjeringspunktOgStatusPanel.props().aktivitetStatusList).to.deep.equal([
      {
        kode: 'AT',
        kodeverk: 'AKTIVITET_STATUS',
      },
    ]);
  });

  it('skal teste at Aksjonspunktbehandler får korrekte props fra BeregningFP', () => {
    const wrapper = shallow(
      <BeregningFormImpl
        fieldArrayID="dummyId"
        readOnly={false}
        erAktiv
        avklaringsbehov={avklaringsbehovListe}
        beregningsgrunnlag={lagBeregningsgrunnlag(0, 120000, 100000, 100, [])}
        behandling={behandling}
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={{}}
        relevanteStatuser={relevanteStatuser}
        submitCallback={sinon.spy}
        readOnlySubmitButton
        vilkaarBG={getBGVilkar(mockVilkar)}
        {...reduxFormPropsMock}
      />,
    );
    const aksjonspunktBehandler = wrapper.find(AksjonspunktBehandler);
    expect(aksjonspunktBehandler.props().readOnly).to.have.equal(false);
    const expectedPerioder = lagPeriode();
    expect(aksjonspunktBehandler.props().allePerioder[0]).to.eql(expectedPerioder);
    expect(aksjonspunktBehandler.props().avklaringsbehov).to.eql(avklaringsbehovListe);
  });

  it('skal teste at Beregningsgrunnlag får korrekte props fra BeregningFP', () => {
    relevanteStatuser.skalViseBeregningsgrunnlag = true;
    const wrapper = shallow(
      <BeregningFormImpl
        fieldArrayID="dummyId"
        readOnly={false}
        erAktiv
        avklaringsbehov={avklaringsbehovListe}
        beregningsgrunnlag={lagBeregningsgrunnlag(0, 100000, 100000, 100, [])}
        behandling={behandling}
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={{}}
        relevanteStatuser={relevanteStatuser}
        submitCallback={sinon.spy}
        readOnlySubmitButton
        vilkaarBG={getBGVilkar(mockVilkar)}
        {...reduxFormPropsMock}
      />,
    );
    const formName = 'BeregningForm';
    const beregningsgrunnlag = wrapper.find(Beregningsgrunnlag);
    expect(beregningsgrunnlag.props().relevanteStatuser).to.have.equal(relevanteStatuser);
    expect(beregningsgrunnlag.props().readOnly).to.have.equal(false);
    expect(beregningsgrunnlag.props().formName).to.have.equal(formName);
    expect(beregningsgrunnlag.props().readOnlySubmitButton).to.have.equal(true);
    expect(beregningsgrunnlag.props().submitCallback).to.have.equal(sinon.spy);
    const expectedPerioder = lagPeriode();
    expect(beregningsgrunnlag.props().allePerioder[0]).to.eql(expectedPerioder);
  });

  it('skal teste at Beregningsgrunnlag ikke blir vist', () => {
    relevanteStatuser.skalViseBeregningsgrunnlag = false;
    const wrapper = shallow(
      <BeregningFormImpl
        fieldArrayID="dummyId"
        erAktiv
        readOnly={false}
        avklaringsbehov={avklaringsbehovListe}
        beregningsgrunnlag={lagBeregningsgrunnlag(0, 100000, 100000, 100, [])}
        behandling={behandling}
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={{}}
        relevanteStatuser={relevanteStatuser}
        submitCallback={sinon.spy}
        readOnlySubmitButton
        vilkaarBG={getBGVilkar(mockVilkar)}
        {...reduxFormPropsMock}
      />,
    );
    const beregningsgrunnlag = wrapper.find(Beregningsgrunnlag);
    expect(beregningsgrunnlag).to.have.lengthOf(0);
  });

  it('skal teste at BeregningForm rendrer riktige komponenter', () => {
    relevanteStatuser.skalViseBeregningsgrunnlag = false;
    const bg = lagBeregningsgrunnlag(0, 100000, 100000, 100, []);
    const wrapper = shallowWithIntl(
      <BeregningFormImpl
        fieldArrayID="dummyId"
        erAktiv
        readOnly={false}
        avklaringsbehov={avklaringsbehovListe}
        beregningsgrunnlag={bg}
        behandling={behandling}
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={{}}
        relevanteStatuser={relevanteStatuser}
        submitCallback={sinon.spy}
        readOnlySubmitButton
        vilkaarBG={getBGVilkar(mockVilkar)}
        {...reduxFormPropsMock}
      />,
    );
    const avvikspanel = wrapper.find('AvviksopplysningerPanel');
    expect(avvikspanel).to.have.lengthOf(1);
    const aksjonPunktPanel = wrapper.find(AksjonspunktBehandler);
    expect(aksjonPunktPanel).to.have.lengthOf(1);
    const beregningsResultatPanel = wrapper.find(BeregningsresultatTable);
    expect(beregningsResultatPanel).to.have.lengthOf(1);
  });

  it('skal teste at transformValues blir transformert riktig med aksjonspunkt 5039, varigEndring', () => {
    const avklaringsbehov = [apVurderVarigEndretEllerNyoppstartetSN];
    const values = {
      relevanteStatuser,
      avklaringsbehov,
      fellesVurdering: 'bbb',
      bruttoBeregningsgrunnlag: 240000,
      erVarigEndretNaering: true,
    };
    const result = transformValues(values, allAndeler, allPerioder);
    expect(result).to.have.lengthOf(1);
    expect(result[0].kode).to.have.equal('5039');
  });

  it('skal teste at transformValues blir transformert riktig med aksjonspunkt 5039, uten varigEndring', () => {
    const avklaringsbehov = [apVurderVarigEndretEllerNyoppstartetSN];
    const values = {
      relevanteStatuser,
      avklaringsbehov,
      fellesVurdering: 'bbb',
      bruttoBeregningsgrunnlag: 240000,
      erVarigEndretNaering: false,
    };
    const result = transformValues(values, allAndeler, allPerioder);
    expect(result).to.have.lengthOf(1);
    expect(result[0].kode).to.have.equal('5039');
  });
  it('skal teste at transformValues blir transformert riktig med aksjonspunkt 5038', () => {
    const avklaringsbehov = [apFastsettBgATFL];
    const values = {
      relevanteStatuser,
      avklaringsbehov,
      ATFLVurdering: 'bbb',
      inntekt0: 200000,
    };
    const result = transformValues(values, atAndel, allPerioder);
    expect(result).to.have.lengthOf(1);
    expect(result[0].kode).to.have.equal('5038');
  });
  it('skal teste at transformValues blir transformert riktig med aksjonspunkt 5039', () => {
    const avklaringsbehov = [apVurderVarigEndretEllerNyoppstartetSN];
    const values = {
      relevanteStatuser,
      avklaringsbehov,
      fellesVurdering: 'bbb',
      erVarigEndretNaering: true,
      bruttoBeregningsgrunnlag: 240000,
    };
    const result = transformValues(values, allAndeler, allPerioder);
    expect(result).to.have.lengthOf(1);
    expect(result[0].kode).to.have.equal('5039');
  });
  it('skal teste at transformValues blir transformert riktig med aksjonspunkt 5049', () => {
    const avklaringsbehov = [apFastsettBgSnNyIArbeidslivet];
    const values = {
      relevanteStatuser,
      avklaringsbehov,
      fellesVurdering: 'bbb',
      bruttoBeregningsgrunnlag: 240000,
    };
    const result = transformValues(values, allAndeler, allPerioder);
    expect(result).to.have.lengthOf(1);
    expect(result[0].kode).to.have.equal('5049');
  });
  it('skal teste buildInitialValues uten aksjonspunkt', () => {
    const avklaringsbehov = [];
    const beregningsgrunnlag = lagBeregningsgrunnlag(0, 120000, 100000, 100, []);

    beregningsgrunnlag.avklaringsbehov = avklaringsbehov;
    const beregningKoblingerTilVurdering= [
        {
          skjæringstidspunkt: beregningsgrunnlag.vilkårsperiodeFom,
          referanse: '32423-fs34-wrj2i',
          erForlengelse: false,
        }
      ];

    const actualValues = buildInitialValuesForBeregningrunnlag(beregningsgrunnlag, beregningKoblingerTilVurdering);
    const expectedValues = {
      ATFLVurdering: "",
      erTilVurdering: false,
      skjæringstidspunkt: undefined,
      avklaringsbehov,
      relevanteStatuser: {
        isArbeidstaker: true,
        isFrilanser: false,
        isSelvstendigNaeringsdrivende: false,
        harAndreTilstotendeYtelser: false,
        harDagpengerEllerAAP: false,
        isAAP: false,
        isDagpenger: false,
        skalViseBeregningsgrunnlag: true,
        isKombinasjonsstatus: false,
        isMilitaer: false,
      }
    };
    expect(actualValues).to.deep.equal(expectedValues);
  });
  it('skal teste buildInitialValues med aksjonspunkt', () => {
    apFastsettBgATFL.begrunnelse = "En fin begrunnelse";
    const avklaringsbehov = [apFastsettBgATFL];
    const beregningsgrunnlag = lagBeregningsgrunnlag(0, 120000, 100000, 100, []);

    beregningsgrunnlag.avklaringsbehov = avklaringsbehov;
    const beregningKoblingerTilVurdering= [
      {
        skjæringstidspunkt: beregningsgrunnlag.vilkårsperiodeFom,
        referanse: '32423-fs34-wrj2i',
        erForlengelse: false,
      }
    ];

    const actualValues = buildInitialValuesForBeregningrunnlag(beregningsgrunnlag, beregningKoblingerTilVurdering);
    const expectedValues = {
      ATFLVurdering: "En fin begrunnelse",
      erTilVurdering: true,
      skjæringstidspunkt: undefined,
      avklaringsbehov,
      relevanteStatuser: {
        isArbeidstaker: true,
        isFrilanser: false,
        isSelvstendigNaeringsdrivende: false,
        harAndreTilstotendeYtelser: false,
        harDagpengerEllerAAP: false,
        isAAP: false,
        isDagpenger: false,
        skalViseBeregningsgrunnlag: true,
        isKombinasjonsstatus: false,
        isMilitaer: false,
      }
    };
    expect(actualValues).to.deep.equal(expectedValues);
  });
  it('skal teste buildInitialValues med aksjonspunkt for forlengelse', () => {
    apFastsettBgATFL.begrunnelse = "En fin begrunnelse";
    const avklaringsbehov = [apFastsettBgATFL];
    const beregningsgrunnlag = lagBeregningsgrunnlag(0, 120000, 100000, 100, []);

    beregningsgrunnlag.avklaringsbehov = avklaringsbehov;
    const beregningKoblingerTilVurdering= [
      {
        skjæringstidspunkt: beregningsgrunnlag.vilkårsperiodeFom,
        referanse: '32423-fs34-wrj2i',
        erForlengelse: true,
      }
    ];

    const actualValues = buildInitialValuesForBeregningrunnlag(beregningsgrunnlag, beregningKoblingerTilVurdering);
    const expectedValues = {
      ATFLVurdering: "En fin begrunnelse",
      erTilVurdering: false,
      skjæringstidspunkt: undefined,
      avklaringsbehov,
      relevanteStatuser: {
        isArbeidstaker: true,
        isFrilanser: false,
        isSelvstendigNaeringsdrivende: false,
        harAndreTilstotendeYtelser: false,
        harDagpengerEllerAAP: false,
        isAAP: false,
        isDagpenger: false,
        skalViseBeregningsgrunnlag: true,
        isKombinasjonsstatus: false,
        isMilitaer: false,
      }
    };
    expect(actualValues).to.deep.equal(expectedValues);
  });
  it('skal teste buildInitialValues med aksjonspunkt uten kobling til vurdering', () => {
    apFastsettBgATFL.begrunnelse = "En fin begrunnelse";
    const avklaringsbehov = [apFastsettBgATFL];
    const beregningsgrunnlag = lagBeregningsgrunnlag(0, 120000, 100000, 100, []);

    beregningsgrunnlag.avklaringsbehov = avklaringsbehov;
    const beregningKoblingerTilVurdering= [];

    const actualValues = buildInitialValuesForBeregningrunnlag(beregningsgrunnlag, beregningKoblingerTilVurdering);
    const expectedValues = {
      ATFLVurdering: "En fin begrunnelse",
      erTilVurdering: false,
      skjæringstidspunkt: undefined,
      avklaringsbehov,
      relevanteStatuser: {
        isArbeidstaker: true,
        isFrilanser: false,
        isSelvstendigNaeringsdrivende: false,
        harAndreTilstotendeYtelser: false,
        harDagpengerEllerAAP: false,
        isAAP: false,
        isDagpenger: false,
        skalViseBeregningsgrunnlag: true,
        isKombinasjonsstatus: false,
        isMilitaer: false,
      }
    };
    expect(actualValues).to.deep.equal(expectedValues);
  });
});
