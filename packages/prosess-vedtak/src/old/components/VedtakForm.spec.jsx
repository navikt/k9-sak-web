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
import messages from '../../../i18n/nb_NO.json';

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

    renderWithIntlAndReduxForm(
      <VedtakForm
        intl={intlWithMessages(messages)}
        previewCallback={previewCallback}
        behandlingStatus={behandlingStatusUtredes}
        behandlingresultat={behandlingsresultat}
        aksjonspunkter={aksjonspunkter}
        readOnly={false}
        behandlingPaaVent={false}
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

    expect(screen.getByTestId('innvilget')).toBeDefined();
    expect(screen.queryByTestId('avslaatt')).toBeNull();
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

    expect(screen.getByTestId('avslaatt')).toBeDefined();
    expect(screen.queryByTestId('innvilget')).toBeNull();
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
        ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
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
        readOnly={false}
        ytelseTypeKode={fagsakYtelseType.PLEIEPENGER}
        alleKodeverk={{}}
        personopplysninger={{}}
        arbeidsgiverOpplysningerPerId={{}}
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
