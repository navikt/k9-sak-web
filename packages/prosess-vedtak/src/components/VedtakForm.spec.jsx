import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import BehandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import vedtaksbrevtype from '@fpsak-frontend/kodeverk/src/vedtaksbrevtype';
import { buildInitialValues, VedtakForm } from './VedtakForm';
import VedtakInnvilgetPanel from './VedtakInnvilgetPanel';
import VedtakAvslagPanel from './VedtakAvslagPanel';
import VedtakCheckbox from './VedtakCheckbox';
import shallowWithIntl, { intlMock } from '../../i18n';

describe('<VedtakForm>', () => {
  const sprakkode = {
    kode: 'NO',
  };
  const aksjonspunktKoder = [
    {
      navn: 'annen ytelse',
      kode: aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
    },
  ];

  const ingenTilgjengeligeVedtaksbrev = { vedtaksbrevmaler: [] };
  const alleTilgjengeligeVedtaksbrev = {
    vedtaksbrevmaler: {
      [vedtaksbrevtype.AUTOMATISK]: dokumentMalType.INNVILGELSE,
      [vedtaksbrevtype.FRITEKST]: dokumentMalType.FRITKS,
    },
  };

  const initialValues = {
    skalBrukeOverstyrendeFritekstBrev: false,
    aksjonspunktKoder,
    sprakkode,
    tilgjengeligeVedtaksbrev: ingenTilgjengeligeVedtaksbrev,
  };

  it('skal vise at vedtak er innvilget, beløp og antall barn når en har et beregningsresultat', () => {
    const previewCallback = sinon.spy();
    const behandlingsresultat = {
      id: 1,
      type: {
        kode: BehandlingResultatType.INNVILGET,
        navn: 'test',
      },
    };
    const aksjonspunkter = [];

    const vedtakVarsel = {
      avslagsarsak: null,
      avslagsarsakFritekst: null,
      vedtaksbrev: {
        kode: 'FRITEKST',
      },
    };

    const wrapper = shallowWithIntl(
      <VedtakForm
        {...reduxFormPropsMock}
        intl={intlMock}
        antallBarn={2}
        previewCallback={previewCallback}
        behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
        behandlingresultat={behandlingsresultat}
        aksjonspunkter={aksjonspunkter}
        aksjonspunktKoder={aksjonspunktKoder}
        kanOverstyre
        readOnly={false}
        behandlingPaaVent={false}
        isBehandlingReadOnly
        skalBrukeOverstyrendeFritekstBrev={false}
        sprakkode={sprakkode}
        erBehandlingEtterKlage={false}
        initialValues={initialValues}
        ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
        alleKodeverk={{}}
        personopplysninger={{}}
        arbeidsgiverOpplysningerPerId={{}}
        beregningErManueltFastsatt={false}
        vilkar={[]}
        vedtakVarsel={vedtakVarsel}
        tilgjengeligeVedtaksbrev={ingenTilgjengeligeVedtaksbrev}
      />,
    );

    const vedtakInnvilgetPanel = wrapper.find(VedtakInnvilgetPanel);
    expect(vedtakInnvilgetPanel).to.have.length(1);
    expect(wrapper.find('VedtakAvslagPanel')).to.have.length(0);

    expect(vedtakInnvilgetPanel.prop('antallBarn')).is.eql(2);
  });

  it('skal ikke vise et element når en ikke har et beregningsresultat', () => {
    const previewCallback = sinon.spy();
    const behandlingsresultat = {
      id: 1,
      type: {
        kode: BehandlingResultatType.AVSLATT,
        navn: 'test',
      },
    };
    const aksjonspunkter = [
      {
        id: 1,
        definisjon: {
          navn: 'annen ytelse',
          kode: aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
        },
        status: {
          navn: 'Opprettet',
          kode: aksjonspunktStatus.OPPRETTET,
        },
        kanLoses: true,
        erAktivt: true,
      },
    ];
    const vedtakVarsel = {
      avslagsarsak: {
        kode: '1019',
        navn: 'Manglende dokumentasjon',
      },
      avslagsarsakFritekst: null,
      vedtaksbrev: {
        kode: 'FRITEKST',
      },
    };
    const wrapper = shallowWithIntl(
      <VedtakForm
        {...reduxFormPropsMock}
        intl={intlMock}
        antallBarn={2}
        behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
        behandlingresultat={behandlingsresultat}
        aksjonspunkter={aksjonspunkter}
        behandlingPaaVent={false}
        previewCallback={previewCallback}
        aksjonspunktKoder={aksjonspunktKoder}
        readOnly={false}
        initialValues={initialValues}
        isBehandlingReadOnly
        sprakkode={sprakkode}
        skalBrukeOverstyrendeFritekstBrev
        erBehandlingEtterKlage={false}
        ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
        alleKodeverk={{}}
        personopplysninger={{}}
        arbeidsgiverOpplysningerPerId={{}}
        beregningErManueltFastsatt={false}
        vilkar={[]}
        vedtakVarsel={vedtakVarsel}
        tilgjengeligeVedtaksbrev={ingenTilgjengeligeVedtaksbrev}
      />,
    );
    const label = wrapper.find('Element');
    expect(label).to.have.length(0);
  });

  it('skal vise Engangsstønad ikke innvilget når en ikke har et beregningsresultat', () => {
    const previewCallback = sinon.spy();
    const behandlingsresultat = {
      id: 1,
      type: {
        kode: BehandlingResultatType.AVSLATT,
        navn: 'test',
      },
    };
    const aksjonspunkter = [
      {
        id: 1,
        definisjon: {
          navn: 'annen ytelse',
          kode: aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
        },
        status: {
          navn: 'Opprettet',
          kode: aksjonspunktStatus.OPPRETTET,
        },
        kanLoses: true,
        erAktivt: true,
      },
    ];
    const vedtakVarsel = {
      avslagsarsak: {
        kode: '1019',
        navn: 'Manglende dokumentasjon',
      },
      avslagsarsakFritekst: null,
      vedtaksbrev: {
        kode: 'FRITEKST',
      },
    };
    const wrapper = shallowWithIntl(
      <VedtakForm
        {...reduxFormPropsMock}
        intl={intlMock}
        behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
        behandlingresultat={behandlingsresultat}
        aksjonspunkter={aksjonspunkter}
        behandlingPaaVent={false}
        previewCallback={previewCallback}
        aksjonspunktKoder={aksjonspunktKoder}
        readOnly={false}
        isBehandlingReadOnly
        kanOverstyre
        sprakkode={sprakkode}
        skalBrukeOverstyrendeFritekstBrev={false}
        initialValues={initialValues}
        erBehandlingEtterKlage={false}
        ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
        alleKodeverk={{}}
        personopplysninger={{}}
        arbeidsgiverOpplysningerPerId={{}}
        beregningErManueltFastsatt={false}
        vilkar={[]}
        vedtakVarsel={vedtakVarsel}
        tilgjengeligeVedtaksbrev={ingenTilgjengeligeVedtaksbrev}
      />,
    );

    expect(wrapper.find(VedtakAvslagPanel)).to.have.length(1);
    expect(wrapper.find(VedtakInnvilgetPanel)).to.have.length(0);
  });

  it('skal vise avslagsgrunn for søknadsfristvilkåret', () => {
    const previewCallback = sinon.spy();

    const behandlingsresultat = {
      id: 1,
      type: {
        kode: BehandlingResultatType.AVSLATT,
        navn: 'test',
      },
    };
    const aksjonspunkter = [
      {
        id: 1,
        definisjon: {
          navn: 'annen ytelse',
          kode: aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
        },
        status: {
          navn: 'Opprettet',
          kode: aksjonspunktStatus.OPPRETTET,
        },
        kanLoses: true,
        erAktivt: true,
      },
    ];
    const vedtakVarsel = {
      avslagsarsak: {
        kode: '1019',
        navn: 'Søkt for sent',
      },
      avslagsarsakFritekst: null,
      vedtaksbrev: {
        kode: 'FRITEKST',
      },
    };
    const wrapper = shallowWithIntl(
      <VedtakForm
        {...reduxFormPropsMock}
        intl={intlMock}
        behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
        behandlingresultat={behandlingsresultat}
        aksjonspunkter={aksjonspunkter}
        behandlingPaaVent={false}
        previewCallback={previewCallback}
        aksjonspunktKoder={aksjonspunktKoder}
        readOnly={false}
        isBehandlingReadOnly
        kanOverstyre
        sprakkode={sprakkode}
        skalBrukeOverstyrendeFritekstBrev={false}
        erBehandlingEtterKlage={false}
        initialValues={initialValues}
        ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
        alleKodeverk={{}}
        personopplysninger={{}}
        arbeidsgiverOpplysningerPerId={{}}
        beregningErManueltFastsatt={false}
        vilkar={[]}
        vedtakVarsel={vedtakVarsel}
        tilgjengeligeVedtaksbrev={ingenTilgjengeligeVedtaksbrev}
      />,
    );

    expect(wrapper.find(VedtakAvslagPanel)).to.have.length(1);
    expect(wrapper.find(VedtakInnvilgetPanel)).to.have.length(0);
  });

  it('skal vise knapper for å avslutt behandling då behandlingen er innvilget', () => {
    const previewCallback = sinon.spy();
    const behandlingsresultat = {
      id: 1,
      type: {
        kode: BehandlingResultatType.INNVILGET,
        navn: 'test',
      },
    };
    const aksjonspunkter = [
      {
        id: 1,
        definisjon: {
          navn: 'annen ytelse',
          kode: aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
        },
        status: {
          navn: 'Opprettet',
          kode: aksjonspunktStatus.OPPRETTET,
        },
        toTrinnsBehandling: true,
        kanLoses: true,
        erAktivt: true,
      },
    ];
    const vedtakVarsel = {
      avslagsarsak: null,
      avslagsarsakFritekst: null,
      vedtaksbrev: {
        kode: 'FRITEKST',
      },
    };
    const wrapper = shallowWithIntl(
      <VedtakForm
        {...reduxFormPropsMock}
        intl={intlMock}
        antallBarn={2}
        behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
        behandlingresultat={behandlingsresultat}
        aksjonspunkter={aksjonspunkter}
        behandlingPaaVent={false}
        previewCallback={previewCallback}
        aksjonspunktKoder={aksjonspunktKoder}
        readOnly={false}
        isBehandlingReadOnly
        sprakkode={sprakkode}
        skalBrukeOverstyrendeFritekstBrev={false}
        initialValues={initialValues}
        erBehandlingEtterKlage={false}
        ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
        alleKodeverk={{}}
        personopplysninger={{}}
        arbeidsgiverOpplysningerPerId={{}}
        beregningErManueltFastsatt={false}
        vilkar={[]}
        vedtakVarsel={vedtakVarsel}
        tilgjengeligeVedtaksbrev={ingenTilgjengeligeVedtaksbrev}
      />,
    );
    const hovedknapp = wrapper.find('Hovedknapp');
    expect(hovedknapp).to.have.length(1);
    expect(hovedknapp.childAt(0).text()).to.eql('Til godkjenning');
  });

  it('skal ikke vise knapper for å avslutt behandling når behandlingen er avvist med årsakkode 1099', () => {
    const previewCallback = sinon.spy();
    const behandlingsresultat = {
      id: 1,
      type: {
        kode: BehandlingResultatType.INNVILGET,
        navn: 'test',
      },
    };
    const aksjonspunkter = [
      {
        id: 1,
        definisjon: {
          navn: 'annen ytelse',
          kode: aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
        },
        status: {
          navn: 'Opprettet',
          kode: aksjonspunktStatus.OPPRETTET,
        },
        toTrinnsBehandling: true,
        kanLoses: true,
        erAktivt: true,
      },
    ];
    const vedtakVarsel = {
      avslagsarsak: { kode: '1099' },
      avslagsarsakFritekst: null,
      vedtaksbrev: {
        kode: 'FRITEKST',
      },
    };
    const wrapper = shallowWithIntl(
      <VedtakForm
        {...reduxFormPropsMock}
        intl={intlMock}
        antallBarn={2}
        behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
        behandlingresultat={behandlingsresultat}
        aksjonspunkter={aksjonspunkter}
        behandlingPaaVent={false}
        previewCallback={previewCallback}
        aksjonspunktKoder={aksjonspunktKoder}
        readOnly={false}
        isBehandlingReadOnly
        sprakkode={sprakkode}
        skalBrukeOverstyrendeFritekstBrev={false}
        initialValues={initialValues}
        erBehandlingEtterKlage={false}
        ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
        alleKodeverk={{}}
        personopplysninger={{}}
        arbeidsgiverOpplysningerPerId={{}}
        beregningErManueltFastsatt={false}
        vilkar={[]}
        vedtakVarsel={vedtakVarsel}
        tilgjengeligeVedtaksbrev={ingenTilgjengeligeVedtaksbrev}
      />,
    );

    const hovedknapp = wrapper.find('Hovedknapp');
    expect(hovedknapp).to.have.length(1);
    expect(hovedknapp.childAt(0).text()).to.eql('Til godkjenning');
  });

  it('skal vise knapper for å fatte vedtak når foreslå avslag', () => {
    const previewCallback = sinon.spy();

    const behandlingsresultat = {
      id: 1,
      type: {
        kode: BehandlingResultatType.AVSLATT,
        navn: 'test',
      },
    };
    const aksjonspunkter = [
      {
        id: 1,
        definisjon: {
          navn: 'annen ytelse',
          kode: aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
        },
        status: {
          navn: 'Opprettet',
          kode: aksjonspunktStatus.OPPRETTET,
        },
        toTrinnsBehandling: false,
        kanLoses: true,
        erAktivt: true,
      },
    ];
    const vedtakVarsel = {
      avslagsarsak: {
        kode: '1019',
        navn: 'Manglende dokumentasjon',
      },
      avslagsarsakFritekst: null,
      vedtaksbrev: {
        kode: 'FRITEKST',
      },
    };
    const wrapper = shallowWithIntl(
      <VedtakForm
        {...reduxFormPropsMock}
        intl={intlMock}
        behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
        behandlingresultat={behandlingsresultat}
        aksjonspunkter={aksjonspunkter}
        behandlingPaaVent={false}
        previewCallback={previewCallback}
        aksjonspunktKoder={aksjonspunktKoder}
        readOnly={false}
        isBehandlingReadOnly
        sprakkode={sprakkode}
        skalBrukeOverstyrendeFritekstBrev={false}
        initialValues={initialValues}
        erBehandlingEtterKlage={false}
        ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
        alleKodeverk={{}}
        personopplysninger={{}}
        arbeidsgiverOpplysningerPerId={{}}
        beregningErManueltFastsatt={false}
        vilkar={[]}
        vedtakVarsel={vedtakVarsel}
        tilgjengeligeVedtaksbrev={ingenTilgjengeligeVedtaksbrev}
      />,
    );

    const hovedknapp = wrapper.find('Hovedknapp');
    expect(hovedknapp).to.have.length(1);
    expect(hovedknapp.childAt(0).text()).to.eql('Fatt vedtak');
  });

  it('skal ikke vise knapper når status er avsluttet', () => {
    const previewCallback = sinon.spy();

    const behandlingsresultat = {
      id: 1,
      type: {
        kode: BehandlingResultatType.INNVILGET,
        navn: 'test',
      },
    };
    const aksjonspunkter = [
      {
        id: 1,
        definisjon: {
          navn: 'annen ytelse',
          kode: aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
        },
        status: {
          navn: 'Opprettet',
          kode: aksjonspunktStatus.OPPRETTET,
        },
        kanLoses: true,
        erAktivt: true,
      },
    ];

    const vedtakVarsel = {
      avslagsarsak: null,
      avslagsarsakFritekst: null,
      vedtaksbrev: {
        kode: 'FRITEKST',
      },
    };
    const wrapper = shallowWithIntl(
      <VedtakForm
        {...reduxFormPropsMock}
        intl={intlMock}
        antallBarn={2}
        behandlingStatusKode={behandlingStatus.AVSLUTTET}
        behandlingresultat={behandlingsresultat}
        aksjonspunkter={aksjonspunkter}
        behandlingPaaVent={false}
        previewCallback={previewCallback}
        aksjonspunktKoder={aksjonspunktKoder}
        readOnly={false}
        isBehandlingReadOnly
        sprakkode={sprakkode}
        skalBrukeOverstyrendeFritekstBrev={false}
        initialValues={initialValues}
        erBehandlingEtterKlage={false}
        ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
        alleKodeverk={{}}
        personopplysninger={{}}
        arbeidsgiverOpplysningerPerId={{}}
        beregningErManueltFastsatt={false}
        vilkar={[]}
        vedtakVarsel={vedtakVarsel}
        tilgjengeligeVedtaksbrev={ingenTilgjengeligeVedtaksbrev}
      />,
    );

    const hovedknapp = wrapper.find('Hovedknapp');
    expect(hovedknapp).to.have.length(0);
    const button = wrapper.find('button');
    expect(button).to.have.length(0);
  });

  it('skal ikke vise knapper når status er iverksetter vedtak', () => {
    const behandlingsresultat = {
      id: 1,
      type: {
        kode: BehandlingResultatType.INNVILGET,
        navn: 'test',
      },
    };
    const aksjonspunkter = [
      {
        id: 1,
        definisjon: {
          navn: 'annen ytelse',
          kode: aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
        },
        status: {
          navn: 'Opprettet',
          kode: aksjonspunktStatus.OPPRETTET,
        },
        kanLoses: true,
        erAktivt: true,
      },
    ];
    const vedtakVarsel = {
      avslagsarsak: null,
      avslagsarsakFritekst: null,
      vedtaksbrev: {
        kode: 'FRITEKST',
      },
    };
    const previewCallback = sinon.spy();
    const wrapper = shallowWithIntl(
      <VedtakForm
        {...reduxFormPropsMock}
        intl={intlMock}
        antallBarn={2}
        behandlingStatusKode={behandlingStatus.IVERKSETTER_VEDTAK}
        behandlingresultat={behandlingsresultat}
        aksjonspunkter={aksjonspunkter}
        behandlingPaaVent={false}
        previewCallback={previewCallback}
        erBehandlingEtterKlage={false}
        aksjonspunktKoder={aksjonspunktKoder}
        readOnly={false}
        isBehandlingReadOnly
        sprakkode={sprakkode}
        skalBrukeOverstyrendeFritekstBrev={false}
        initialValues={initialValues}
        ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
        alleKodeverk={{}}
        personopplysninger={{}}
        arbeidsgiverOpplysningerPerId={{}}
        beregningErManueltFastsatt={false}
        vilkar={[]}
        vedtakVarsel={vedtakVarsel}
        tilgjengeligeVedtaksbrev={ingenTilgjengeligeVedtaksbrev}
      />,
    );

    const hovedknapp = wrapper.find('Hovedknapp');
    expect(hovedknapp).to.have.length(0);
    const button = wrapper.find('button');
    expect(button).to.have.length(0);
  });

  it('skal ikke vise knapper når status er fatter vedtak', () => {
    const previewCallback = sinon.spy();

    const behandlingsresultat = {
      id: 1,
      type: {
        kode: BehandlingResultatType.INNVILGET,
        navn: 'test',
      },
    };
    const aksjonspunkter = [
      {
        id: 1,
        definisjon: {
          navn: 'annen ytelse',
          kode: aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
        },
        status: {
          navn: 'Opprettet',
          kode: aksjonspunktStatus.OPPRETTET,
        },
        kanLoses: true,
        erAktivt: true,
      },
    ];
    const vedtakVarsel = {
      avslagsarsak: null,
      avslagsarsakFritekst: null,
      vedtaksbrev: {
        kode: 'FRITEKST',
      },
    };
    const wrapper = shallowWithIntl(
      <VedtakForm
        {...reduxFormPropsMock}
        intl={intlMock}
        antallBarn={2}
        behandlingStatusKode={behandlingStatus.FATTER_VEDTAK}
        behandlingresultat={behandlingsresultat}
        aksjonspunkter={aksjonspunkter}
        behandlingPaaVent={false}
        previewCallback={previewCallback}
        aksjonspunktKoder={aksjonspunktKoder}
        readOnly={false}
        isBehandlingReadOnly
        sprakkode={sprakkode}
        skalBrukeOverstyrendeFritekstBrev
        initialValues={initialValues}
        erBehandlingEtterKlage={false}
        ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
        alleKodeverk={{}}
        personopplysninger={{}}
        arbeidsgiverOpplysningerPerId={{}}
        beregningErManueltFastsatt={false}
        vilkar={[]}
        vedtakVarsel={vedtakVarsel}
        tilgjengeligeVedtaksbrev={ingenTilgjengeligeVedtaksbrev}
      />,
    );

    const hovedknapp = wrapper.find('Hovedknapp');
    expect(hovedknapp).to.have.length(0);
    const button = wrapper.find('button');
    expect(button).to.have.length(0);
  });

  it('skal sette opp initialvalues når en ikke har beregningsresultat og vedtaksbrev ikke er overstyrt', () => {
    const aksjonspunkter = [
      {
        id: 0,
        definisjon: {
          navn: 'vedtak',
          kode: aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL,
        },
        status: {
          navn: 'Opprettet',
          kode: aksjonspunktStatus.OPPRETTET,
        },
        kanLoses: true,
      },
      {
        id: 1,
        definisjon: {
          navn: 'annen ytelse',
          kode: aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
        },
        status: {
          navn: 'Opprettet',
          kode: aksjonspunktStatus.OPPRETTET,
        },
        kanLoses: true,
        erAktivt: true,
      },
    ];
    const behandlingsresultat = {
      id: 1,
      type: {
        kode: BehandlingResultatType.INNVILGET,
        navn: 'test',
      },
    };
    const vedtakVarsel = {
      vedtaksbrev: {
        kode: 'AUTOMATISK',
      },
      avslagsarsak: null,
      avslagsarsakFritekst: null,
    };
    const dokumentdata = {
      VEDTAKSBREV_TYPE: 'AUTOMATISK',
    };

    const readOnly = false;

    // eslint-disable-next-line
    const model = buildInitialValues.resultFunc(
      behandlingStatus.BEHANDLING_UTREDES,
      undefined,
      aksjonspunkter,
      { kode: 'ES' },
      behandlingsresultat,
      sprakkode,
      vedtakVarsel,
      dokumentdata,
      alleTilgjengeligeVedtaksbrev,
      readOnly,
    );

    expect(model).to.eql({
      aksjonspunktKoder: ['5018', '5033'],
      sprakkode,
      brødtekst: undefined,
      overskrift: undefined,
      begrunnelse: undefined,
      overstyrtMottaker: undefined,
      skalBrukeOverstyrendeFritekstBrev: false,
      skalUndertrykkeBrev: false,
      isEngangsstonad: false,
      antallBarn: undefined,
      BEREGNING_25_PROSENT_AVVIK: undefined,
      KONTINUERLIG_TILSYN: undefined,
      OMSORGEN_FOR: undefined,
      OVER_18_AAR: undefined,
      REVURDERING_ENDRING: undefined,
      UNNTAK_FRA_TILSYNSORDNING: undefined,
      VILKAR_FOR_TO: undefined,
    });
  });

  it('skal sette opp initialvalues når en har beregningsresultat og vedtaksbrev er overstyrt', () => {
    const aksjonspunkter = [
      {
        id: 1,
        definisjon: {
          navn: 'annen ytelse',
          kode: aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
        },
        status: {
          navn: 'Opprettet',
          kode: aksjonspunktStatus.OPPRETTET,
        },
        kanLoses: true,
        erAktivt: true,
      },
    ];

    const beregningResultat = {
      beregnetTilkjentYtelse: '10000',
      antallBarn: 2,
      vedtaksbrev: {
        kode: 'FRITEKST',
      },
    };
    const behandlingsresultat = {
      id: 1,
      type: {
        kode: BehandlingResultatType.INNVILGET,
        navn: 'test',
      },
    };

    const vedtakVarsel = {
      vedtaksbrev: {
        kode: 'FRITEKST',
      },
      avslagsarsak: null,
      avslagsarsakFritekst: null,
      overskrift: 'Overskrift',
      fritekstbrev: 'Brødtekst',
    };
    const dokumentdata = {
      VEDTAKSBREV_TYPE: 'FRITEKST',
      FRITEKSTBREV: {
        overskrift: 'Overskrift',
        brødtekst: 'Brødtekst',
      },
    };

    const readOnly = false;

    const model = buildInitialValues.resultFunc(
      behandlingStatus.BEHANDLING_UTREDES,
      beregningResultat,
      aksjonspunkter,
      'ES',
      behandlingsresultat,
      sprakkode,
      vedtakVarsel,
      dokumentdata,
      alleTilgjengeligeVedtaksbrev,
      readOnly,
    );
    expect(model).to.eql({
      aksjonspunktKoder: ['5033'],
      BEREGNING_25_PROSENT_AVVIK: undefined,
      KONTINUERLIG_TILSYN: undefined,
      OMSORGEN_FOR: undefined,
      OVER_18_AAR: undefined,
      REVURDERING_ENDRING: undefined,
      UNNTAK_FRA_TILSYNSORDNING: undefined,
      VILKAR_FOR_TO: undefined,
      sprakkode,
      antallBarn: 2,
      isEngangsstonad: true,
      skalBrukeOverstyrendeFritekstBrev: true,
      skalUndertrykkeBrev: false,
      overskrift: 'Overskrift',
      brødtekst: 'Brødtekst',
      overstyrtMottaker: undefined,
      begrunnelse: undefined,
    });
  });

  const previewCallback = sinon.spy();
  const behandlingsresultat = {
    id: 1,
    type: {
      kode: BehandlingResultatType.INNVILGET,
      navn: 'test',
    },
  };
  const aksjonspunkter = [
    {
      id: 1,
      definisjon: {
        navn: 'annen ytelse',
        kode: aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
      },
      status: {
        navn: 'Opprettet',
        kode: aksjonspunktStatus.OPPRETTET,
      },
      kanLoses: true,
      erAktivt: true,
    },
  ];
  const vedtakVarsel = {
    avslagsarsak: null,
    avslagsarsakFritekst: null,
    vedtaksbrev: {
      kode: 'FRITEKST',
    },
  };

  const dokumentdata = {
    VEDTAKSBREV_TYPE: 'FRITEKST',
    FRITEKSTBREV: {
      overskrift: 'Overskrift',
      brødtekst: 'Brødtekst',
    },
  };

  it('skal vise avkrysningsboks i lesemodus for rolle med overstyringstilgang', () => {
    const wrapper = shallowWithIntl(
      <VedtakForm
        {...reduxFormPropsMock}
        intl={intlMock}
        antallBarn={2}
        behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
        behandlingresultat={behandlingsresultat}
        aksjonspunkter={aksjonspunkter}
        behandlingPaaVent={false}
        previewCallback={previewCallback}
        aksjonspunktKoder={aksjonspunktKoder}
        readOnly
        isBehandlingReadOnly
        sprakkode={sprakkode}
        kanOverstyre
        skalBrukeOverstyrendeFritekstBrev={false}
        initialValues={initialValues}
        erBehandlingEtterKlage={false}
        ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
        alleKodeverk={{}}
        personopplysninger={{}}
        arbeidsgiverOpplysningerPerId={{}}
        beregningErManueltFastsatt={false}
        vilkar={[]}
        vedtakVarsel={vedtakVarsel}
        dokumentdata={dokumentdata}
        tilgjengeligeVedtaksbrev={alleTilgjengeligeVedtaksbrev}
      />,
    );
    const overstyringsKnapp = wrapper.find(VedtakCheckbox);
    expect(overstyringsKnapp).to.have.length(1);
    expect(overstyringsKnapp.prop('readOnly')).to.eql(true);
    expect(overstyringsKnapp.prop('keyName')).to.eql('skalBrukeOverstyrendeFritekstBrev');
  });

  it('skal vise avkrysningsboks i skrivemodus for rolle med overstyringstilgang', () => {
    const wrapper = shallowWithIntl(
      <VedtakForm
        {...reduxFormPropsMock}
        intl={intlMock}
        antallBarn={2}
        behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
        behandlingresultat={behandlingsresultat}
        aksjonspunkter={aksjonspunkter}
        behandlingPaaVent={false}
        previewCallback={previewCallback}
        aksjonspunktKoder={aksjonspunktKoder}
        readOnly={false}
        isBehandlingReadOnly
        sprakkode={sprakkode}
        kanOverstyre
        skalBrukeOverstyrendeFritekstBrev={false}
        initialValues={initialValues}
        erBehandlingEtterKlage={false}
        ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
        alleKodeverk={{}}
        personopplysninger={{}}
        arbeidsgiverOpplysningerPerId={{}}
        beregningErManueltFastsatt={false}
        vilkar={[]}
        vedtakVarsel={vedtakVarsel}
        dokumentdata={dokumentdata}
        tilgjengeligeVedtaksbrev={alleTilgjengeligeVedtaksbrev}
      />,
    );
    const overstyringsKnapp = wrapper.find(VedtakCheckbox);
    expect(overstyringsKnapp).to.have.length(1);
    expect(overstyringsKnapp.prop('readOnly')).to.eql(false);
    expect(overstyringsKnapp.prop('keyName')).to.eql('skalBrukeOverstyrendeFritekstBrev');
  });

  it('skal vise avkrysningsboks for roller uten overstyringstilgang', () => {
    const wrapper = shallowWithIntl(
      <VedtakForm
        {...reduxFormPropsMock}
        intl={intlMock}
        antallBarn={2}
        behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
        behandlingresultat={behandlingsresultat}
        aksjonspunkter={aksjonspunkter}
        behandlingPaaVent={false}
        previewCallback={previewCallback}
        aksjonspunktKoder={aksjonspunktKoder}
        readOnly={false}
        isBehandlingReadOnly
        sprakkode={sprakkode}
        kanOverstyre={false}
        erBehandlingEtterKlage={false}
        skalBrukeOverstyrendeFritekstBrev={false}
        initialValues={initialValues}
        ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
        alleKodeverk={{}}
        personopplysninger={{}}
        arbeidsgiverOpplysningerPerId={{}}
        beregningErManueltFastsatt={false}
        vilkar={[]}
        vedtakVarsel={vedtakVarsel}
        dokumentdata={dokumentdata}
        tilgjengeligeVedtaksbrev={alleTilgjengeligeVedtaksbrev}
      />,
    );
    const overstyringsKnapp = wrapper.find('VedtakOverstyrendeKnapp');
    expect(overstyringsKnapp).to.have.length(1);
  });
});
