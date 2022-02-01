import React from 'react';

import { renderWithIntlAndReduxForm, screen, waitFor } from '@fpsak-frontend/utils-test/src/test-utils';
import sinon from 'sinon';
import userEvent from '@testing-library/user-event';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import BehandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingStatuser from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { intlWithMessages } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import vedtaksbrevtype from '@fpsak-frontend/kodeverk/src/vedtaksbrevtype';
import { VedtakForm } from './VedtakForm';
/* import VedtakInnvilgetPanel from './VedtakInnvilgetPanel';
import VedtakAvslagPanel from './VedtakAvslagPanel'; */
import messages from '../../i18n/nb_NO.json';

describe('<VedtakForm>', () => {
  const sprakkode = {
    kode: 'NO',
    kodeverk: '',
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
      [vedtaksbrevtype.INGEN]: null,
    },
  };

  const behandlingStatusUtredes = { kode: behandlingStatuser.BEHANDLING_UTREDES };

  /*   it('skal vise at vedtak er innvilget, beløp og antall barn når en har et beregningsresultat', () => {
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

    const wrapper = renderWithIntlAndReduxForm(
      <VedtakForm
        intl={intlMock}
        previewCallback={previewCallback}
        behandlingStatus={behandlingStatusUtredes}
        behandlingresultat={behandlingsresultat}
        aksjonspunkter={aksjonspunkter}
        readOnly={false}
        behandlingPaaVent={false}
        sprakkode={sprakkode}
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
    const wrapper = renderWithIntlAndReduxForm(
      <VedtakForm
        {...reduxFormPropsMock}
        intl={intlMock}
        antallBarn={2}
        behandlingStatus={behandlingStatusUtredes}
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
    const wrapper = renderWithIntlAndReduxForm(
      <VedtakForm
        {...reduxFormPropsMock}
        intl={intlMock}
        behandlingStatus={behandlingStatusUtredes}
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
    const wrapper = renderWithIntlAndReduxForm(
      <VedtakForm
        {...reduxFormPropsMock}
        intl={intlMock}
        behandlingStatus={behandlingStatusUtredes}
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
    const wrapper = renderWithIntlAndReduxForm(
      <VedtakForm
        {...reduxFormPropsMock}
        intl={intlMock}
        antallBarn={2}
        behandlingStatus={behandlingStatusUtredes}
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
  }); */

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
    renderWithIntlAndReduxForm(
      <VedtakForm
        intl={intlWithMessages(messages)}
        behandlingStatus={behandlingStatusUtredes}
        behandlingresultat={behandlingsresultat}
        aksjonspunkter={aksjonspunkter}
        behandlingPaaVent={false}
        previewCallback={previewCallback}
        readOnly={false}
        sprakkode={sprakkode}
        ytelseTypeKode={fagsakYtelseType.PLEIEPENGER}
        alleKodeverk={{}}
        personopplysninger={{}}
        arbeidsgiverOpplysningerPerId={{}}
        vilkar={[]}
        vedtakVarsel={vedtakVarsel}
        tilgjengeligeVedtaksbrev={ingenTilgjengeligeVedtaksbrev}
      />,
    );

    const fattVedtakButton = screen.getByRole('button');
    expect(fattVedtakButton).toHaveTextContent('VedtakForm.TilGodkjenning');
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
    renderWithIntlAndReduxForm(
      <VedtakForm
        intl={intlWithMessages(messages)}
        behandlingStatus={behandlingStatusUtredes}
        behandlingresultat={behandlingsresultat}
        aksjonspunkter={aksjonspunkter}
        behandlingPaaVent={false}
        previewCallback={previewCallback}
        readOnly={false}
        sprakkode={sprakkode}
        ytelseTypeKode={fagsakYtelseType.PLEIEPENGER}
        alleKodeverk={{}}
        personopplysninger={{}}
        arbeidsgiverOpplysningerPerId={{}}
        vilkar={[]}
        vedtakVarsel={vedtakVarsel}
        tilgjengeligeVedtaksbrev={ingenTilgjengeligeVedtaksbrev}
      />,
    );

    const fattVedtakButton = screen.getByRole('button');
    expect(fattVedtakButton).toHaveTextContent('VedtakForm.FattVedtak');
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
    renderWithIntlAndReduxForm(
      <VedtakForm
        intl={intlWithMessages(messages)}
        behandlingStatus={{ kode: behandlingStatuser.AVSLUTTET }}
        behandlingresultat={behandlingsresultat}
        aksjonspunkter={aksjonspunkter}
        behandlingPaaVent={false}
        previewCallback={previewCallback}
        readOnly={false}
        sprakkode={sprakkode}
        ytelseTypeKode={fagsakYtelseType.PLEIEPENGER}
        alleKodeverk={{}}
        personopplysninger={{}}
        arbeidsgiverOpplysningerPerId={{}}
        vilkar={[]}
        vedtakVarsel={vedtakVarsel}
        tilgjengeligeVedtaksbrev={ingenTilgjengeligeVedtaksbrev}
      />,
    );

    const hovedknapp = screen.queryByRole('button');
    expect(hovedknapp).toBeNull();
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

    renderWithIntlAndReduxForm(
      <VedtakForm
        intl={intlWithMessages(messages)}
        behandlingStatus={{ kode: behandlingStatuser.IVERKSETTER_VEDTAK }}
        behandlingresultat={behandlingsresultat}
        aksjonspunkter={aksjonspunkter}
        behandlingPaaVent={false}
        previewCallback={previewCallback}
        readOnly={false}
        sprakkode={sprakkode}
        ytelseTypeKode={fagsakYtelseType.PLEIEPENGER}
        alleKodeverk={{}}
        personopplysninger={{}}
        arbeidsgiverOpplysningerPerId={{}}
        vilkar={[]}
        vedtakVarsel={vedtakVarsel}
        tilgjengeligeVedtaksbrev={ingenTilgjengeligeVedtaksbrev}
      />,
    );

    const hovedknapp = screen.queryByRole('button');
    expect(hovedknapp).toBeNull();
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
    renderWithIntlAndReduxForm(
      <VedtakForm
        intl={intlWithMessages(messages)}
        behandlingStatus={{ kode: behandlingStatuser.FATTER_VEDTAK }}
        behandlingresultat={behandlingsresultat}
        aksjonspunkter={aksjonspunkter}
        behandlingPaaVent={false}
        previewCallback={previewCallback}
        readOnly={false}
        sprakkode={sprakkode}
        ytelseTypeKode={fagsakYtelseType.PLEIEPENGER}
        alleKodeverk={{}}
        personopplysninger={{}}
        arbeidsgiverOpplysningerPerId={{}}
        beregningErManueltFastsatt={false}
        vilkar={[]}
        vedtakVarsel={vedtakVarsel}
        tilgjengeligeVedtaksbrev={ingenTilgjengeligeVedtaksbrev}
      />,
      { messages },
    );

    const hovedknapp = screen.queryByRole('button');
    expect(hovedknapp).toBeNull();
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
      kodeverk: 'FRITKST',
    },
  };

  const dokumentdata = {
    VEDTAKSBREV_TYPE: 'FRITEKST',
    FRITEKSTBREV: {
      overskrift: 'Overskrift',
      brødtekst: 'Brødtekst',
    },
  };

  it('skal vise avkrysningsboks for overstyring', () => {
    renderWithIntlAndReduxForm(
      <VedtakForm
        intl={intlWithMessages(messages)}
        behandlingStatus={behandlingStatusUtredes}
        behandlingresultat={behandlingsresultat}
        aksjonspunkter={aksjonspunkter}
        behandlingPaaVent={false}
        previewCallback={previewCallback}
        readOnly={false}
        sprakkode={sprakkode}
        ytelseTypeKode={fagsakYtelseType.PLEIEPENGER}
        alleKodeverk={{}}
        personopplysninger={{}}
        arbeidsgiverOpplysningerPerId={{}}
        beregningErManueltFastsatt={false}
        vilkar={[]}
        vedtakVarsel={vedtakVarsel}
        dokumentdata={dokumentdata}
        tilgjengeligeVedtaksbrev={alleTilgjengeligeVedtaksbrev}
      />,
      { messages },
    );
    const overstyringsCheckbox = screen.getByLabelText('Overstyr automatisk brev');
    expect(overstyringsCheckbox).toBeVisible();
  });

  it('skal vise avkrysningsboks for å hindre brevutsending', () => {
    renderWithIntlAndReduxForm(
      <VedtakForm
        intl={intlWithMessages(messages)}
        behandlingStatus={behandlingStatusUtredes}
        behandlingresultat={behandlingsresultat}
        aksjonspunkter={aksjonspunkter}
        behandlingPaaVent={false}
        previewCallback={previewCallback}
        readOnly={false}
        sprakkode={sprakkode}
        ytelseTypeKode={fagsakYtelseType.PLEIEPENGER}
        alleKodeverk={{}}
        personopplysninger={{}}
        arbeidsgiverOpplysningerPerId={{}}
        beregningErManueltFastsatt={false}
        vilkar={[]}
        vedtakVarsel={vedtakVarsel}
        dokumentdata={dokumentdata}
        tilgjengeligeVedtaksbrev={alleTilgjengeligeVedtaksbrev}
      />,
      { messages },
    );

    const hindreUtsendingCheckbox = screen.getByLabelText('Hindre utsending av brev');
    expect(hindreUtsendingCheckbox).toBeVisible();
  });

  it('skal disable checkboxer i readonly', () => {
    renderWithIntlAndReduxForm(
      <VedtakForm
        intl={intlWithMessages(messages)}
        behandlingStatus={behandlingStatusUtredes}
        behandlingresultat={behandlingsresultat}
        aksjonspunkter={aksjonspunkter}
        behandlingPaaVent={false}
        previewCallback={previewCallback}
        readOnly
        sprakkode={sprakkode}
        ytelseTypeKode={fagsakYtelseType.PLEIEPENGER}
        alleKodeverk={{}}
        personopplysninger={{}}
        arbeidsgiverOpplysningerPerId={{}}
        vilkar={[]}
        vedtakVarsel={vedtakVarsel}
        dokumentdata={dokumentdata}
        tilgjengeligeVedtaksbrev={alleTilgjengeligeVedtaksbrev}
      />,
      { messages },
    );
    const overstyringsCheckbox = screen.getByLabelText('Overstyr automatisk brev');
    const hindreUtsendingCheckbox = screen.getByLabelText('Hindre utsending av brev');

    expect(overstyringsCheckbox).toBeDisabled();
    expect(hindreUtsendingCheckbox).toBeDisabled();
  });

  it('skal ikke kunne avhuke checkbox hvis automatisk brev ikke kan sendes', async () => {
    const vedtaksbrevmalerUtenAutomatisk = {
      vedtaksbrevmaler: { [vedtaksbrevtype.FRITEKST]: dokumentMalType.FRITKS, [vedtaksbrevtype.INGEN]: null },
    };
    renderWithIntlAndReduxForm(
      <VedtakForm
        intl={intlWithMessages(messages)}
        behandlingStatus={behandlingStatusUtredes}
        behandlingresultat={behandlingsresultat}
        aksjonspunkter={aksjonspunkter}
        behandlingPaaVent={false}
        previewCallback={previewCallback}
        aksjonspunktKoder={aksjonspunktKoder}
        sprakkode={sprakkode}
        skalBrukeOverstyrendeFritekstBrev={false}
        erBehandlingEtterKlage={false}
        readOnly={false}
        ytelseTypeKode={fagsakYtelseType.PLEIEPENGER}
        alleKodeverk={{}}
        personopplysninger={{}}
        arbeidsgiverOpplysningerPerId={{}}
        beregningErManueltFastsatt={false}
        vilkar={[]}
        vedtakVarsel={vedtakVarsel}
        dokumentdata={dokumentdata}
        tilgjengeligeVedtaksbrev={vedtaksbrevmalerUtenAutomatisk}
      />,
      { messages },
    );
    const overstyringsCheckbox = screen.getByLabelText('Overstyr automatisk brev');
    const hindreUtsendingCheckbox = screen.getByLabelText('Hindre utsending av brev');

    expect(overstyringsCheckbox).toBeChecked();
    expect(overstyringsCheckbox).toBeDisabled();
    expect(hindreUtsendingCheckbox).toBeEnabled();

    userEvent.click(hindreUtsendingCheckbox);

    await waitFor(() => expect(hindreUtsendingCheckbox).toBeChecked());
    await waitFor(() => expect(hindreUtsendingCheckbox).toBeDisabled());
    await waitFor(() => expect(overstyringsCheckbox).toBeEnabled());
  });
});
