import React from 'react';

import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import BehandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingStatuser from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { intlWithMessages } from '@fpsak-frontend/utils-test/intl-test-helper';
import ProsessStegContainer from '@k9-sak-web/behandling-felles/src/components/ProsessStegContainer';
import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';

import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import vedtaksbrevtype from '@fpsak-frontend/kodeverk/src/vedtaksbrevtype';
import { TilgjengeligeVedtaksbrev, TilgjengeligeVedtaksbrevMedMaler } from '@fpsak-frontend/utils/src/formidlingUtils';
import { Aksjonspunkt, Personopplysninger } from '@k9-sak-web/types';

import messages from '../../i18n/nb_NO.json';
import { VedtakForm } from './VedtakForm';
import { InformasjonsbehovVedtaksbrev } from './brev/InformasjonsbehovAutomatiskVedtaksbrev';

describe('<VedtakForm>', () => {
  beforeEach(() => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, [{ key: 'FRITEKST_REDIGERING', value: true }]);
  });

  const sprakkode = 'NO';

  const ingenTilgjengeligeVedtaksbrev: TilgjengeligeVedtaksbrev & TilgjengeligeVedtaksbrevMedMaler = {
    begrunnelse: 'begrunnelse',
    alternativeMottakere: [],
    vedtaksbrevmaler: {},
    maler: [],
  };
  const alleTilgjengeligeVedtaksbrev: TilgjengeligeVedtaksbrev & TilgjengeligeVedtaksbrevMedMaler = {
    begrunnelse: 'begrunnelse',
    alternativeMottakere: [],
    vedtaksbrevmaler: {
      // [vedtaksbrevtype.MANUELL]: dokumentMalType.REDIGERTBREV,
      [vedtaksbrevtype.AUTOMATISK]: dokumentMalType.INNVILGELSE,
      [vedtaksbrevtype.FRITEKST]: dokumentMalType.FRITKS,
      [vedtaksbrevtype.INGEN]: null,
    },
    maler: [],
  };

  const behandlingStatusUtredes = behandlingStatuser.BEHANDLING_UTREDES;

  // This is an incorrect initialization to satisfy typescript during rewrite from jsx to tsx. Should probably be fixed.
  const personopplysninger = {} as Personopplysninger;

  const informasjonsbehovVedtaksbrev: InformasjonsbehovVedtaksbrev = {
    informasjonsbehov: [],
    mangler: [],
  };
  const aksjonspunktBase: Aksjonspunkt = {
    definisjon: aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
    status: aksjonspunktStatus.OPPRETTET,
    toTrinnsBehandling: true,
    kanLoses: true,
    erAktivt: true,
  };
  const vedtakVarselBase = {
    avslagsarsak: '1019',
    avslagsarsakFritekst: null,
    id: 0,
    overskrift: 'overskrift',
    fritekstbrev: 'fritekstbrev',
    skjæringstidspunkt: {
      dato: '2024-04-01',
    },
    redusertUtbetalingÅrsaker: [],
    vedtaksbrev: {
      kode: 'FRITEKST',
      kodeverk: 'FRITEKST',
    },
    vedtaksdato: '2024-05-01',
  };

  it('skal vise at vedtak er innvilget, beløp og antall barn når en har et beregningsresultat', () => {
    const previewCallback = vi.fn();
    const behandlingsresultat = {
      id: 1,
      type: BehandlingResultatType.INNVILGET,
    };

    renderWithIntlAndReduxForm(
      <ProsessStegContainer formaterteProsessStegPaneler={[]} velgProsessStegPanelCallback={() => null}>
        <VedtakForm
          intl={intlWithMessages(messages)}
          behandlingStatus={behandlingStatusUtredes}
          aksjonspunkter={[]}
          behandlingresultat={behandlingsresultat}
          behandlingPaaVent={false}
          previewCallback={previewCallback}
          hentFritekstbrevHtmlCallback={() => undefined}
          readOnly={false}
          sprakkode={sprakkode}
          ytelseTypeKode={fagsakYtelseType.PLEIEPENGER}
          personopplysninger={personopplysninger}
          arbeidsgiverOpplysningerPerId={{}}
          tilbakekrevingvalg={{ videreBehandling: 'tilbakekrevingskode' }}
          vilkar={[]}
          tilgjengeligeVedtaksbrev={ingenTilgjengeligeVedtaksbrev}
          informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
          dokumentdata={{}}
          fritekstdokumenter={[]}
          vedtakVarsel={vedtakVarselBase}
          submitCallback={() => undefined}
          lagreDokumentdata={() => Promise.resolve()}
          overlappendeYtelser={[]}
          resultatstruktur="resultatstruktur"
          simuleringResultat={{}}
          resultatstrukturOriginalBehandling={{}}
          bgPeriodeMedAvslagsårsak={{}}
          medlemskapFom="2021-05-02"
          erRevurdering={false}
          behandlingArsaker={[]}
        />
      </ProsessStegContainer>,
    );

    expect(screen.getByTestId('innvilget')).toBeDefined();
    expect(screen.queryByTestId('avslaatt')).toBeNull();
  });

  it('skal vise avslagsgrunn for søknadsfristvilkåret', () => {
    const previewCallback = vi.fn();

    const behandlingsresultat = {
      id: 1,
      type: BehandlingResultatType.AVSLATT,
    };
    const aksjonspunkter: Aksjonspunkt[] = [
      {
        definisjon: 'annen ytelse',
        status: 'Opprettet',
        kanLoses: true,
        erAktivt: true,
      },
    ];
    renderWithIntlAndReduxForm(
      <ProsessStegContainer formaterteProsessStegPaneler={[]} velgProsessStegPanelCallback={() => null}>
        <VedtakForm
          intl={intlWithMessages(messages)}
          behandlingStatus={behandlingStatusUtredes}
          aksjonspunkter={aksjonspunkter}
          behandlingresultat={behandlingsresultat}
          behandlingPaaVent={false}
          previewCallback={previewCallback}
          hentFritekstbrevHtmlCallback={() => undefined}
          readOnly={false}
          sprakkode={sprakkode}
          ytelseTypeKode={fagsakYtelseType.PLEIEPENGER}
          personopplysninger={personopplysninger}
          arbeidsgiverOpplysningerPerId={{}}
          tilbakekrevingvalg={{ videreBehandling: 'tilbakekrevingskode' }}
          vilkar={[]}
          tilgjengeligeVedtaksbrev={ingenTilgjengeligeVedtaksbrev}
          informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
          dokumentdata={{}}
          fritekstdokumenter={[]}
          vedtakVarsel={vedtakVarselBase}
          submitCallback={() => undefined}
          lagreDokumentdata={() => Promise.resolve()}
          overlappendeYtelser={[]}
          resultatstruktur="resultatstruktur"
          simuleringResultat={{}}
          resultatstrukturOriginalBehandling={{}}
          bgPeriodeMedAvslagsårsak={{}}
          medlemskapFom="2021-05-02"
          erRevurdering={false}
          behandlingArsaker={[]}
        />
      </ProsessStegContainer>,
    );

    expect(screen.getByTestId('avslaatt')).toBeDefined();
    expect(screen.queryByTestId('innvilget')).toBeNull();
  });

  it('skal vise knapper for å avslutt behandling då behandlingen er innvilget', () => {
    const previewCallback = vi.fn();
    const behandlingsresultat = {
      id: 1,
      type: BehandlingResultatType.INNVILGET,
    };
    const aksjonspunkter: Aksjonspunkt[] = [aksjonspunktBase];
    const vedtakVarsel = {
      ...vedtakVarselBase,
      avslagsarsak: null,
    };
    renderWithIntlAndReduxForm(
      <ProsessStegContainer formaterteProsessStegPaneler={[]} velgProsessStegPanelCallback={() => null}>
        <VedtakForm
          intl={intlWithMessages(messages)}
          behandlingStatus={behandlingStatusUtredes}
          aksjonspunkter={aksjonspunkter}
          behandlingresultat={behandlingsresultat}
          behandlingPaaVent={false}
          previewCallback={previewCallback}
          hentFritekstbrevHtmlCallback={() => undefined}
          readOnly={false}
          sprakkode={sprakkode}
          ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
          personopplysninger={personopplysninger}
          arbeidsgiverOpplysningerPerId={{}}
          tilbakekrevingvalg={{ videreBehandling: 'tilbakekrevingskode' }}
          vilkar={[]}
          tilgjengeligeVedtaksbrev={ingenTilgjengeligeVedtaksbrev}
          informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
          dokumentdata={{}}
          fritekstdokumenter={[]}
          vedtakVarsel={vedtakVarsel}
          submitCallback={() => undefined}
          lagreDokumentdata={() => Promise.resolve()}
          overlappendeYtelser={[]}
          resultatstruktur="resultatstruktur"
          simuleringResultat={{}}
          resultatstrukturOriginalBehandling={{}}
          bgPeriodeMedAvslagsårsak={{}}
          medlemskapFom="2021-05-02"
          erRevurdering={false}
          behandlingArsaker={[]}
        />
      </ProsessStegContainer>,
    );
    const fattVedtakButton = screen.getByRole('button');
    expect(fattVedtakButton).toHaveTextContent('VedtakForm.SendTilBeslutter');
  });

  it('skal ikke vise knapper for å avslutt behandling når behandlingen er avvist med årsakkode 1099', () => {
    const previewCallback = vi.fn();
    const behandlingsresultat = {
      id: 1,
      type: BehandlingResultatType.INNVILGET,
    };
    const aksjonspunkter: Aksjonspunkt[] = [aksjonspunktBase];
    const vedtakVarsel = {
      ...vedtakVarselBase,
      avslagsarsak: '1099',
    };
    renderWithIntlAndReduxForm(
      <ProsessStegContainer formaterteProsessStegPaneler={[]} velgProsessStegPanelCallback={() => null}>
        <VedtakForm
          intl={intlWithMessages(messages)}
          behandlingStatus={behandlingStatusUtredes}
          aksjonspunkter={aksjonspunkter}
          behandlingresultat={behandlingsresultat}
          behandlingPaaVent={false}
          previewCallback={previewCallback}
          hentFritekstbrevHtmlCallback={() => undefined}
          readOnly={false}
          sprakkode={sprakkode}
          ytelseTypeKode={fagsakYtelseType.PLEIEPENGER}
          personopplysninger={personopplysninger}
          arbeidsgiverOpplysningerPerId={{}}
          tilbakekrevingvalg={{ videreBehandling: 'tilbakekrevingskode' }}
          vilkar={[]}
          tilgjengeligeVedtaksbrev={ingenTilgjengeligeVedtaksbrev}
          informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
          dokumentdata={{}}
          fritekstdokumenter={[]}
          vedtakVarsel={vedtakVarsel}
          submitCallback={() => undefined}
          lagreDokumentdata={() => Promise.resolve()}
          overlappendeYtelser={[]}
          resultatstruktur="resultatstruktur"
          simuleringResultat={{}}
          resultatstrukturOriginalBehandling={{}}
          bgPeriodeMedAvslagsårsak={{}}
          medlemskapFom="2021-05-02"
          erRevurdering={false}
          behandlingArsaker={[]}
        />
      </ProsessStegContainer>,
    );

    const fattVedtakButton = screen.getByRole('button');
    expect(fattVedtakButton).toHaveTextContent('VedtakForm.SendTilBeslutter');
  });

  it('skal vise knapper for å fatte vedtak når foreslå avslag', () => {
    const previewCallback = vi.fn();

    const behandlingsresultat = {
      id: 1,
      type: BehandlingResultatType.AVSLATT,
    };
    const aksjonspunkter: Aksjonspunkt[] = [
      {
        ...aksjonspunktBase,
        toTrinnsBehandling: false,
      },
    ];
    const vedtakVarsel = {
      ...vedtakVarselBase,
      avslagsarsak: '1019',
    };
    renderWithIntlAndReduxForm(
      <ProsessStegContainer formaterteProsessStegPaneler={[]} velgProsessStegPanelCallback={() => null}>
        <VedtakForm
          intl={intlWithMessages(messages)}
          behandlingStatus={behandlingStatusUtredes}
          aksjonspunkter={aksjonspunkter}
          behandlingresultat={behandlingsresultat}
          behandlingPaaVent={false}
          previewCallback={previewCallback}
          hentFritekstbrevHtmlCallback={() => undefined}
          readOnly={false}
          sprakkode={sprakkode}
          ytelseTypeKode={fagsakYtelseType.PLEIEPENGER}
          personopplysninger={personopplysninger}
          arbeidsgiverOpplysningerPerId={{}}
          tilbakekrevingvalg={{ videreBehandling: 'tilbakekrevingskode' }}
          vilkar={[]}
          tilgjengeligeVedtaksbrev={ingenTilgjengeligeVedtaksbrev}
          informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
          dokumentdata={{}}
          fritekstdokumenter={[]}
          vedtakVarsel={vedtakVarsel}
          submitCallback={() => undefined}
          lagreDokumentdata={() => Promise.resolve()}
          overlappendeYtelser={[]}
          resultatstruktur="resultatstruktur"
          simuleringResultat={{}}
          resultatstrukturOriginalBehandling={{}}
          bgPeriodeMedAvslagsårsak={{}}
          medlemskapFom="2021-05-02"
          erRevurdering={false}
          behandlingArsaker={[]}
        />
      </ProsessStegContainer>,
    );

    const fattVedtakButton = screen.getByRole('button');
    expect(fattVedtakButton).toHaveTextContent('VedtakForm.FattVedtak');
  });

  it('skal ikke vise knapper når status er avsluttet', () => {
    const previewCallback = vi.fn();

    const behandlingsresultat = {
      id: 1,
      type: BehandlingResultatType.INNVILGET,
    };
    const aksjonspunkter: Aksjonspunkt[] = [
      {
        ...aksjonspunktBase,
        toTrinnsBehandling: undefined,
      },
    ];

    const vedtakVarsel = {
      ...vedtakVarselBase,
      avslagsarsak: null,
    };
    renderWithIntlAndReduxForm(
      <ProsessStegContainer formaterteProsessStegPaneler={[]} velgProsessStegPanelCallback={() => null}>
        <VedtakForm
          intl={intlWithMessages(messages)}
          behandlingStatus={behandlingStatuser.AVSLUTTET}
          aksjonspunkter={aksjonspunkter}
          behandlingresultat={behandlingsresultat}
          behandlingPaaVent={false}
          previewCallback={previewCallback}
          hentFritekstbrevHtmlCallback={() => undefined}
          readOnly={false}
          sprakkode={sprakkode}
          ytelseTypeKode={fagsakYtelseType.PLEIEPENGER}
          personopplysninger={personopplysninger}
          arbeidsgiverOpplysningerPerId={{}}
          tilbakekrevingvalg={{ videreBehandling: 'tilbakekrevingskode' }}
          vilkar={[]}
          tilgjengeligeVedtaksbrev={ingenTilgjengeligeVedtaksbrev}
          informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
          dokumentdata={{}}
          fritekstdokumenter={[]}
          vedtakVarsel={vedtakVarsel}
          submitCallback={() => undefined}
          lagreDokumentdata={() => Promise.resolve()}
          overlappendeYtelser={[]}
          resultatstruktur="resultatstruktur"
          simuleringResultat={{}}
          resultatstrukturOriginalBehandling={{}}
          bgPeriodeMedAvslagsårsak={{}}
          medlemskapFom="2021-05-02"
          erRevurdering={false}
          behandlingArsaker={[]}
        />
      </ProsessStegContainer>,
    );

    const hovedknapp = screen.queryByRole('button');
    expect(hovedknapp).toBeNull();
  });

  it('skal ikke vise knapper når status er iverksetter vedtak', () => {
    const behandlingsresultat = {
      id: 1,
      type: BehandlingResultatType.INNVILGET,
    };
    const aksjonspunkter: Aksjonspunkt[] = [
      {
        ...aksjonspunktBase,
        toTrinnsBehandling: undefined,
      },
    ];
    const vedtakVarsel = {
      ...vedtakVarselBase,
      avslagsarsak: null,
    };
    const previewCallback = vi.fn();

    renderWithIntlAndReduxForm(
      <ProsessStegContainer formaterteProsessStegPaneler={[]} velgProsessStegPanelCallback={() => null}>
        <VedtakForm
          intl={intlWithMessages(messages)}
          behandlingStatus={behandlingStatuser.IVERKSETTER_VEDTAK}
          aksjonspunkter={aksjonspunkter}
          behandlingresultat={behandlingsresultat}
          behandlingPaaVent={false}
          previewCallback={previewCallback}
          hentFritekstbrevHtmlCallback={() => undefined}
          readOnly={false}
          sprakkode={sprakkode}
          ytelseTypeKode={fagsakYtelseType.PLEIEPENGER}
          personopplysninger={personopplysninger}
          arbeidsgiverOpplysningerPerId={{}}
          tilbakekrevingvalg={{ videreBehandling: 'tilbakekrevingskode' }}
          vilkar={[]}
          tilgjengeligeVedtaksbrev={ingenTilgjengeligeVedtaksbrev}
          informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
          dokumentdata={{}}
          fritekstdokumenter={[]}
          vedtakVarsel={vedtakVarsel}
          submitCallback={() => undefined}
          lagreDokumentdata={() => Promise.resolve()}
          overlappendeYtelser={[]}
          resultatstruktur="resultatstruktur"
          simuleringResultat={{}}
          resultatstrukturOriginalBehandling={{}}
          bgPeriodeMedAvslagsårsak={{}}
          medlemskapFom="2021-05-02"
          erRevurdering={false}
          behandlingArsaker={[]}
        />
      </ProsessStegContainer>,
    );

    const hovedknapp = screen.queryByRole('button');
    expect(hovedknapp).toBeNull();
  });

  it('skal ikke vise knapper når status er fatter vedtak', () => {
    const previewCallback = vi.fn();

    const behandlingsresultat = {
      id: 1,
      type: BehandlingResultatType.INNVILGET,
    };
    const aksjonspunkter: Aksjonspunkt[] = [
      {
        ...aksjonspunktBase,
        toTrinnsBehandling: undefined,
      },
    ];
    const vedtakVarsel = {
      ...vedtakVarselBase,
      avslagsarsak: null,
    };
    renderWithIntlAndReduxForm(
      <ProsessStegContainer formaterteProsessStegPaneler={[]} velgProsessStegPanelCallback={() => null}>
        <VedtakForm
          intl={intlWithMessages(messages)}
          behandlingStatus={behandlingStatuser.FATTER_VEDTAK}
          aksjonspunkter={aksjonspunkter}
          behandlingresultat={behandlingsresultat}
          behandlingPaaVent={false}
          previewCallback={previewCallback}
          hentFritekstbrevHtmlCallback={() => undefined}
          readOnly={false}
          sprakkode={sprakkode}
          ytelseTypeKode={fagsakYtelseType.PLEIEPENGER}
          personopplysninger={personopplysninger}
          arbeidsgiverOpplysningerPerId={{}}
          tilbakekrevingvalg={{ videreBehandling: 'tilbakekrevingskode' }}
          vilkar={[]}
          tilgjengeligeVedtaksbrev={ingenTilgjengeligeVedtaksbrev}
          informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
          dokumentdata={{}}
          fritekstdokumenter={[]}
          vedtakVarsel={vedtakVarsel}
          submitCallback={() => undefined}
          lagreDokumentdata={() => Promise.resolve()}
          overlappendeYtelser={[]}
          resultatstruktur="resultatstruktur"
          simuleringResultat={{}}
          resultatstrukturOriginalBehandling={{}}
          bgPeriodeMedAvslagsårsak={{}}
          medlemskapFom="2021-05-02"
          erRevurdering={false}
          behandlingArsaker={[]}
        />
      </ProsessStegContainer>,
      { messages },
    );

    const hovedknapp = screen.queryByRole('button');
    expect(hovedknapp).toBeNull();
  });

  const previewCallback = vi.fn();
  const behandlingsresultat = {
    id: 1,
    type: BehandlingResultatType.INNVILGET,
  };
  const aksjonspunkter: Aksjonspunkt[] = [
    {
      ...aksjonspunktBase,
      toTrinnsBehandling: undefined,
    },
  ];
  const vedtakVarsel = {
    ...vedtakVarselBase,
    avslagsarsak: null,
  };

  const dokumentdata = {
    VEDTAKSBREV_TYPE: 'FRITEKST',
    FRITEKSTBREV: {
      overskrift: 'Overskrift',
      brødtekst: 'Brødtekst',
    },
    REDIGERTBREV: {
      originalHtml: '<p>original html</p>',
      redigertHtml: '<p>redigert html</p>',
      redigertMal: 'INNVILGELSE',
    },
  };

  it('skal vise avkrysningsboks for overstyring', () => {
    renderWithIntlAndReduxForm(
      <ProsessStegContainer formaterteProsessStegPaneler={[]} velgProsessStegPanelCallback={() => null}>
        <VedtakForm
          intl={intlWithMessages(messages)}
          behandlingStatus={behandlingStatusUtredes}
          aksjonspunkter={aksjonspunkter}
          behandlingresultat={behandlingsresultat}
          behandlingPaaVent={false}
          previewCallback={previewCallback}
          hentFritekstbrevHtmlCallback={() => undefined}
          readOnly={false}
          sprakkode={sprakkode}
          ytelseTypeKode={fagsakYtelseType.PLEIEPENGER}
          personopplysninger={personopplysninger}
          arbeidsgiverOpplysningerPerId={{}}
          tilbakekrevingvalg={{ videreBehandling: 'tilbakekrevingskode' }}
          vilkar={[]}
          tilgjengeligeVedtaksbrev={alleTilgjengeligeVedtaksbrev}
          informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
          dokumentdata={dokumentdata}
          fritekstdokumenter={[]}
          vedtakVarsel={vedtakVarsel}
          submitCallback={() => undefined}
          lagreDokumentdata={() => Promise.resolve()}
          overlappendeYtelser={[]}
          resultatstruktur="resultatstruktur"
          simuleringResultat={{}}
          resultatstrukturOriginalBehandling={{}}
          bgPeriodeMedAvslagsårsak={{}}
          medlemskapFom="2021-05-02"
          erRevurdering={false}
          behandlingArsaker={[]}
        />
      </ProsessStegContainer>,
      { messages },
    );
    const overstyringsCheckbox = screen.getByLabelText(messages['VedtakForm.ManuellOverstyring']);
    expect(overstyringsCheckbox).toBeInTheDocument();
  });

  it('skal vise avkrysningsboks for å hindre brevutsending', () => {
    renderWithIntlAndReduxForm(
      <ProsessStegContainer formaterteProsessStegPaneler={[]} velgProsessStegPanelCallback={() => null}>
        <VedtakForm
          intl={intlWithMessages(messages)}
          behandlingStatus={behandlingStatusUtredes}
          aksjonspunkter={aksjonspunkter}
          behandlingresultat={behandlingsresultat}
          behandlingPaaVent={false}
          previewCallback={previewCallback}
          hentFritekstbrevHtmlCallback={() => undefined}
          readOnly={false}
          sprakkode={sprakkode}
          ytelseTypeKode={fagsakYtelseType.PLEIEPENGER}
          personopplysninger={personopplysninger}
          arbeidsgiverOpplysningerPerId={{}}
          tilbakekrevingvalg={{ videreBehandling: 'tilbakekrevingskode' }}
          vilkar={[]}
          tilgjengeligeVedtaksbrev={alleTilgjengeligeVedtaksbrev}
          informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
          dokumentdata={dokumentdata}
          fritekstdokumenter={[]}
          vedtakVarsel={vedtakVarsel}
          submitCallback={() => undefined}
          lagreDokumentdata={() => Promise.resolve()}
          overlappendeYtelser={[]}
          resultatstruktur="resultatstruktur"
          simuleringResultat={{}}
          resultatstrukturOriginalBehandling={{}}
          bgPeriodeMedAvslagsårsak={{}}
          medlemskapFom="2021-05-02"
          erRevurdering={false}
          behandlingArsaker={[]}
        />
      </ProsessStegContainer>,
      { messages },
    );

    const hindreUtsendingCheckbox = screen.getByLabelText('Hindre utsending av brev');
    expect(hindreUtsendingCheckbox).toBeInTheDocument();
  });

  it('skal disable checkboxer i readonly', () => {
    renderWithIntlAndReduxForm(
      <ProsessStegContainer formaterteProsessStegPaneler={[]} velgProsessStegPanelCallback={() => null}>
        <VedtakForm
          intl={intlWithMessages(messages)}
          behandlingStatus={behandlingStatusUtredes}
          aksjonspunkter={aksjonspunkter}
          behandlingresultat={behandlingsresultat}
          behandlingPaaVent={false}
          previewCallback={previewCallback}
          hentFritekstbrevHtmlCallback={() => undefined}
          readOnly
          sprakkode={sprakkode}
          ytelseTypeKode={fagsakYtelseType.PLEIEPENGER}
          personopplysninger={personopplysninger}
          arbeidsgiverOpplysningerPerId={{}}
          tilbakekrevingvalg={{ videreBehandling: 'tilbakekrevingskode' }}
          vilkar={[]}
          tilgjengeligeVedtaksbrev={alleTilgjengeligeVedtaksbrev}
          informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
          dokumentdata={dokumentdata}
          fritekstdokumenter={[]}
          vedtakVarsel={vedtakVarsel}
          submitCallback={() => undefined}
          lagreDokumentdata={() => Promise.resolve()}
          overlappendeYtelser={[]}
          resultatstruktur="resultatstruktur"
          simuleringResultat={{}}
          resultatstrukturOriginalBehandling={{}}
          bgPeriodeMedAvslagsårsak={{}}
          medlemskapFom="2021-05-02"
          erRevurdering={false}
          behandlingArsaker={[]}
        />
      </ProsessStegContainer>,
      { messages },
    );
    const overstyringsCheckbox = screen.getByLabelText(messages['VedtakForm.ManuellOverstyring']);
    const hindreUtsendingCheckbox = screen.getByLabelText('Hindre utsending av brev');

    expect(overstyringsCheckbox).toBeDisabled();
    expect(hindreUtsendingCheckbox).toBeDisabled();
  });

  it('skal ikke kunne avhuke checkbox hvis automatisk brev ikke kan sendes', async () => {
    const vedtaksbrevmalerUtenAutomatisk: TilgjengeligeVedtaksbrev & TilgjengeligeVedtaksbrevMedMaler = {
      begrunnelse: null,
      alternativeMottakere: [],
      vedtaksbrevmaler: { [vedtaksbrevtype.FRITEKST]: dokumentMalType.FRITKS, [vedtaksbrevtype.INGEN]: null },
      maler: [],
    };

    renderWithIntlAndReduxForm(
      <ProsessStegContainer formaterteProsessStegPaneler={[]} velgProsessStegPanelCallback={() => null}>
        <VedtakForm
          intl={intlWithMessages(messages)}
          behandlingStatus={behandlingStatusUtredes}
          aksjonspunkter={aksjonspunkter}
          behandlingresultat={behandlingsresultat}
          behandlingPaaVent={false}
          previewCallback={previewCallback}
          hentFritekstbrevHtmlCallback={() => undefined}
          readOnly={false}
          sprakkode={sprakkode}
          ytelseTypeKode={fagsakYtelseType.PLEIEPENGER}
          personopplysninger={personopplysninger}
          arbeidsgiverOpplysningerPerId={{}}
          tilbakekrevingvalg={{ videreBehandling: 'tilbakekrevingskode' }}
          vilkar={[]}
          tilgjengeligeVedtaksbrev={vedtaksbrevmalerUtenAutomatisk}
          informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
          dokumentdata={dokumentdata}
          fritekstdokumenter={[]}
          vedtakVarsel={vedtakVarsel}
          submitCallback={() => undefined}
          lagreDokumentdata={() => Promise.resolve()}
          overlappendeYtelser={[]}
          resultatstruktur="resultatstruktur"
          simuleringResultat={{}}
          resultatstrukturOriginalBehandling={{}}
          bgPeriodeMedAvslagsårsak={{}}
          medlemskapFom="2021-05-02"
          erRevurdering={false}
          behandlingArsaker={[]}
        />
      </ProsessStegContainer>,
      { messages },
    );
    const overstyringsCheckbox = screen.getByLabelText(messages['VedtakForm.ManuellOverstyring']);
    const hindreUtsendingCheckbox = screen.getByLabelText('Hindre utsending av brev');

    expect(overstyringsCheckbox).toBeChecked();
    expect(overstyringsCheckbox).toBeDisabled();
    expect(hindreUtsendingCheckbox).toBeEnabled();

    await userEvent.click(hindreUtsendingCheckbox);

    await waitFor(() => expect(hindreUtsendingCheckbox).toBeChecked());
    await waitFor(() => expect(hindreUtsendingCheckbox).toBeDisabled());
    await waitFor(() => expect(overstyringsCheckbox).toBeEnabled());
  });
});
