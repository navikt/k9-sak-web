import behandlingStatuser from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import vedtaksbrevtype from '@fpsak-frontend/kodeverk/src/vedtaksbrevtype';
import { intlWithMessages } from '@fpsak-frontend/utils-test/intl-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { TilgjengeligeVedtaksbrev, TilgjengeligeVedtaksbrevMedMaler } from '@fpsak-frontend/utils/src/formidlingUtils';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import ProsessStegContainer from '@k9-sak-web/behandling-felles/src/components/ProsessStegContainer';
import {
  AksjonspunktDtoDefinisjon,
  AksjonspunktDtoStatus,
  BehandlingDtoBehandlingResultatType,
  BehandlingDtoStatus,
  TilbakekrevingValgDtoVidereBehandling,
} from '@navikt/k9-sak-typescript-client';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import messages from '../../i18n/nb_NO.json';
import { VedtakForm } from './VedtakForm';
import { InformasjonsbehovVedtaksbrev } from './brev/InformasjonsbehovAutomatiskVedtaksbrev';

describe('<VedtakForm>', () => {
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

  const personopplysninger = { aktoerId: '', fnr: '' };

  const informasjonsbehovVedtaksbrev: InformasjonsbehovVedtaksbrev = {
    informasjonsbehov: [],
    mangler: [],
  };
  const aksjonspunktBase = {
    definisjon: AksjonspunktDtoDefinisjon.VURDERE_ANNEN_YTELSE_FØR_VEDTAK,
    status: AksjonspunktDtoStatus.OPPRETTET,
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
    vedtaksbrev: 'FRITEKST',
    vedtaksdato: '2024-05-01',
  };

  it('skal vise at vedtak er innvilget, beløp og antall barn når en har et beregningsresultat', () => {
    const previewCallback = vi.fn();
    const behandlingsresultat = {
      id: 1,
      type: BehandlingDtoBehandlingResultatType.INNVILGET,
    };

    renderWithIntlAndReduxForm(
      <ProsessStegContainer formaterteProsessStegPaneler={[]} velgProsessStegPanelCallback={() => null}>
        <VedtakForm
          intl={intlWithMessages(messages)}
          behandlingStatus={behandlingStatusUtredes}
          aksjonspunkter={[]}
          behandlingresultat={behandlingsresultat}
          behandlingPåVent={false}
          previewCallback={previewCallback}
          hentFritekstbrevHtmlCallback={() => undefined}
          readOnly={false}
          sprakkode={sprakkode}
          ytelseTypeKode={fagsakYtelsesType.PLEIEPENGER_SYKT_BARN}
          alleKodeverk={{}}
          personopplysninger={personopplysninger}
          arbeidsgiverOpplysningerPerId={{}}
          tilbakekrevingvalg={{
            videreBehandling: TilbakekrevingValgDtoVidereBehandling.UDEFINIERT,
            erTilbakekrevingVilkårOppfylt: false,
          }}
          vilkar={[]}
          tilgjengeligeVedtaksbrev={ingenTilgjengeligeVedtaksbrev}
          informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
          dokumentdata={{}}
          fritekstdokumenter={[]}
          vedtakVarsel={vedtakVarselBase}
          submitCallback={() => undefined}
          lagreDokumentdata={() => Promise.resolve()}
          overlappendeYtelser={[]}
          simuleringResultat={{}}
          medlemskapFom="2021-05-02"
          erRevurdering={false}
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
      type: BehandlingDtoBehandlingResultatType.AVSLÅTT,
    };
    const aksjonspunkter = [
      {
        definisjon: AksjonspunktDtoDefinisjon.VURDERE_ANNEN_YTELSE_FØR_VEDTAK,
        status: AksjonspunktDtoStatus.OPPRETTET,
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
          behandlingPåVent={false}
          previewCallback={previewCallback}
          hentFritekstbrevHtmlCallback={() => undefined}
          readOnly={false}
          sprakkode={sprakkode}
          ytelseTypeKode={fagsakYtelsesType.PLEIEPENGER_SYKT_BARN}
          alleKodeverk={{}}
          personopplysninger={personopplysninger}
          arbeidsgiverOpplysningerPerId={{}}
          tilbakekrevingvalg={{
            videreBehandling: TilbakekrevingValgDtoVidereBehandling.UDEFINIERT,
            erTilbakekrevingVilkårOppfylt: false,
          }}
          vilkar={[]}
          tilgjengeligeVedtaksbrev={ingenTilgjengeligeVedtaksbrev}
          informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
          dokumentdata={{}}
          fritekstdokumenter={[]}
          vedtakVarsel={vedtakVarselBase}
          submitCallback={() => undefined}
          lagreDokumentdata={() => Promise.resolve()}
          overlappendeYtelser={[]}
          simuleringResultat={{}}
          medlemskapFom="2021-05-02"
          erRevurdering={false}
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
      type: BehandlingDtoBehandlingResultatType.INNVILGET,
    };
    const aksjonspunkter = [aksjonspunktBase];
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
          behandlingPåVent={false}
          previewCallback={previewCallback}
          hentFritekstbrevHtmlCallback={() => undefined}
          readOnly={false}
          sprakkode={sprakkode}
          ytelseTypeKode={fagsakYtelsesType.FORELDREPENGER}
          alleKodeverk={{}}
          personopplysninger={personopplysninger}
          arbeidsgiverOpplysningerPerId={{}}
          tilbakekrevingvalg={{
            videreBehandling: TilbakekrevingValgDtoVidereBehandling.UDEFINIERT,
            erTilbakekrevingVilkårOppfylt: false,
          }}
          vilkar={[]}
          tilgjengeligeVedtaksbrev={ingenTilgjengeligeVedtaksbrev}
          informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
          dokumentdata={{}}
          fritekstdokumenter={[]}
          vedtakVarsel={vedtakVarsel}
          submitCallback={() => undefined}
          lagreDokumentdata={() => Promise.resolve()}
          overlappendeYtelser={[]}
          simuleringResultat={{}}
          medlemskapFom="2021-05-02"
          erRevurdering={false}
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
      type: BehandlingDtoBehandlingResultatType.INNVILGET,
    };
    const aksjonspunkter = [aksjonspunktBase];
    const vedtakVarsel = {
      ...vedtakVarselBase,
      avslagsarsak: { kode: '1099', navn: 'xoxo' },
    };
    renderWithIntlAndReduxForm(
      <ProsessStegContainer formaterteProsessStegPaneler={[]} velgProsessStegPanelCallback={() => null}>
        <VedtakForm
          intl={intlWithMessages(messages)}
          behandlingStatus={behandlingStatusUtredes}
          aksjonspunkter={aksjonspunkter}
          behandlingresultat={behandlingsresultat}
          behandlingPåVent={false}
          previewCallback={previewCallback}
          hentFritekstbrevHtmlCallback={() => undefined}
          readOnly={false}
          sprakkode={sprakkode}
          ytelseTypeKode={fagsakYtelsesType.PLEIEPENGER_SYKT_BARN}
          alleKodeverk={{}}
          personopplysninger={personopplysninger}
          arbeidsgiverOpplysningerPerId={{}}
          tilbakekrevingvalg={{
            videreBehandling: TilbakekrevingValgDtoVidereBehandling.UDEFINIERT,
            erTilbakekrevingVilkårOppfylt: false,
          }}
          vilkar={[]}
          tilgjengeligeVedtaksbrev={ingenTilgjengeligeVedtaksbrev}
          informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
          dokumentdata={{}}
          fritekstdokumenter={[]}
          vedtakVarsel={vedtakVarsel}
          submitCallback={() => undefined}
          lagreDokumentdata={() => Promise.resolve()}
          overlappendeYtelser={[]}
          simuleringResultat={{}}
          medlemskapFom="2021-05-02"
          erRevurdering={false}
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
      type: BehandlingDtoBehandlingResultatType.AVSLÅTT,
    };
    const aksjonspunkter = [
      {
        ...aksjonspunktBase,
        toTrinnsBehandling: false,
      },
    ];
    const vedtakVarsel = {
      ...vedtakVarselBase,
      avslagsarsak: {
        kode: '1019',
        navn: 'Manglende dokumentasjon',
      },
    };
    renderWithIntlAndReduxForm(
      <ProsessStegContainer formaterteProsessStegPaneler={[]} velgProsessStegPanelCallback={() => null}>
        <VedtakForm
          intl={intlWithMessages(messages)}
          behandlingStatus={behandlingStatusUtredes}
          aksjonspunkter={aksjonspunkter}
          behandlingresultat={behandlingsresultat}
          behandlingPåVent={false}
          previewCallback={previewCallback}
          hentFritekstbrevHtmlCallback={() => undefined}
          readOnly={false}
          sprakkode={sprakkode}
          ytelseTypeKode={fagsakYtelsesType.PLEIEPENGER_SYKT_BARN}
          alleKodeverk={{}}
          personopplysninger={personopplysninger}
          arbeidsgiverOpplysningerPerId={{}}
          tilbakekrevingvalg={{
            videreBehandling: TilbakekrevingValgDtoVidereBehandling.UDEFINIERT,
            erTilbakekrevingVilkårOppfylt: false,
          }}
          vilkar={[]}
          tilgjengeligeVedtaksbrev={ingenTilgjengeligeVedtaksbrev}
          informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
          dokumentdata={{}}
          fritekstdokumenter={[]}
          vedtakVarsel={vedtakVarsel}
          submitCallback={() => undefined}
          lagreDokumentdata={() => Promise.resolve()}
          overlappendeYtelser={[]}
          simuleringResultat={{}}
          medlemskapFom="2021-05-02"
          erRevurdering={false}
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
      type: BehandlingDtoBehandlingResultatType.INNVILGET,
    };
    const aksjonspunkter = [
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
          behandlingStatus={BehandlingDtoStatus.AVSLUTTET}
          aksjonspunkter={aksjonspunkter}
          behandlingresultat={behandlingsresultat}
          behandlingPåVent={false}
          previewCallback={previewCallback}
          hentFritekstbrevHtmlCallback={() => undefined}
          readOnly={false}
          sprakkode={sprakkode}
          ytelseTypeKode={fagsakYtelsesType.PLEIEPENGER_SYKT_BARN}
          alleKodeverk={{}}
          personopplysninger={personopplysninger}
          arbeidsgiverOpplysningerPerId={{}}
          tilbakekrevingvalg={{
            videreBehandling: TilbakekrevingValgDtoVidereBehandling.UDEFINIERT,
            erTilbakekrevingVilkårOppfylt: false,
          }}
          vilkar={[]}
          tilgjengeligeVedtaksbrev={ingenTilgjengeligeVedtaksbrev}
          informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
          dokumentdata={{}}
          fritekstdokumenter={[]}
          vedtakVarsel={vedtakVarsel}
          submitCallback={() => undefined}
          lagreDokumentdata={() => Promise.resolve()}
          overlappendeYtelser={[]}
          simuleringResultat={{}}
          medlemskapFom="2021-05-02"
          erRevurdering={false}
        />
      </ProsessStegContainer>,
    );

    const hovedknapp = screen.queryByRole('button');
    expect(hovedknapp).toBeNull();
  });

  it('skal ikke vise knapper når status er iverksetter vedtak', () => {
    const behandlingsresultat = {
      id: 1,
      type: BehandlingDtoBehandlingResultatType.INNVILGET,
    };
    const aksjonspunkter = [
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
          behandlingStatus={BehandlingDtoStatus.IVERKSETTER_VEDTAK}
          aksjonspunkter={aksjonspunkter}
          behandlingresultat={behandlingsresultat}
          behandlingPåVent={false}
          previewCallback={previewCallback}
          hentFritekstbrevHtmlCallback={() => undefined}
          readOnly={false}
          sprakkode={sprakkode}
          ytelseTypeKode={fagsakYtelsesType.PLEIEPENGER_SYKT_BARN}
          alleKodeverk={{}}
          personopplysninger={personopplysninger}
          arbeidsgiverOpplysningerPerId={{}}
          tilbakekrevingvalg={{
            videreBehandling: TilbakekrevingValgDtoVidereBehandling.UDEFINIERT,
            erTilbakekrevingVilkårOppfylt: false,
          }}
          vilkar={[]}
          tilgjengeligeVedtaksbrev={ingenTilgjengeligeVedtaksbrev}
          informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
          dokumentdata={{}}
          fritekstdokumenter={[]}
          vedtakVarsel={vedtakVarsel}
          submitCallback={() => undefined}
          lagreDokumentdata={() => Promise.resolve()}
          overlappendeYtelser={[]}
          simuleringResultat={{}}
          medlemskapFom="2021-05-02"
          erRevurdering={false}
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
      type: BehandlingDtoBehandlingResultatType.INNVILGET,
    };
    const aksjonspunkter = [
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
          behandlingStatus={BehandlingDtoStatus.FATTER_VEDTAK}
          aksjonspunkter={aksjonspunkter}
          behandlingresultat={behandlingsresultat}
          behandlingPåVent={false}
          previewCallback={previewCallback}
          hentFritekstbrevHtmlCallback={() => undefined}
          readOnly={false}
          sprakkode={sprakkode}
          ytelseTypeKode={fagsakYtelsesType.PLEIEPENGER_SYKT_BARN}
          alleKodeverk={{}}
          personopplysninger={personopplysninger}
          arbeidsgiverOpplysningerPerId={{}}
          tilbakekrevingvalg={{
            videreBehandling: TilbakekrevingValgDtoVidereBehandling.UDEFINIERT,
            erTilbakekrevingVilkårOppfylt: false,
          }}
          vilkar={[]}
          tilgjengeligeVedtaksbrev={ingenTilgjengeligeVedtaksbrev}
          informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
          dokumentdata={{}}
          fritekstdokumenter={[]}
          vedtakVarsel={vedtakVarsel}
          submitCallback={() => undefined}
          lagreDokumentdata={() => Promise.resolve()}
          overlappendeYtelser={[]}
          simuleringResultat={{}}
          medlemskapFom="2021-05-02"
          erRevurdering={false}
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
    type: BehandlingDtoBehandlingResultatType.INNVILGET,
  };
  const aksjonspunkter = [
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
          behandlingPåVent={false}
          previewCallback={previewCallback}
          hentFritekstbrevHtmlCallback={() => undefined}
          readOnly={false}
          sprakkode={sprakkode}
          ytelseTypeKode={fagsakYtelsesType.PLEIEPENGER_SYKT_BARN}
          alleKodeverk={{}}
          personopplysninger={personopplysninger}
          arbeidsgiverOpplysningerPerId={{}}
          tilbakekrevingvalg={{
            videreBehandling: TilbakekrevingValgDtoVidereBehandling.UDEFINIERT,
            erTilbakekrevingVilkårOppfylt: false,
          }}
          vilkar={[]}
          tilgjengeligeVedtaksbrev={alleTilgjengeligeVedtaksbrev}
          informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
          dokumentdata={dokumentdata}
          fritekstdokumenter={[]}
          vedtakVarsel={vedtakVarsel}
          submitCallback={() => undefined}
          lagreDokumentdata={() => Promise.resolve()}
          overlappendeYtelser={[]}
          simuleringResultat={{}}
          medlemskapFom="2021-05-02"
          erRevurdering={false}
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
          behandlingPåVent={false}
          previewCallback={previewCallback}
          hentFritekstbrevHtmlCallback={() => undefined}
          readOnly={false}
          sprakkode={sprakkode}
          ytelseTypeKode={fagsakYtelsesType.PLEIEPENGER_SYKT_BARN}
          alleKodeverk={{}}
          personopplysninger={personopplysninger}
          arbeidsgiverOpplysningerPerId={{}}
          tilbakekrevingvalg={{
            videreBehandling: TilbakekrevingValgDtoVidereBehandling.UDEFINIERT,
            erTilbakekrevingVilkårOppfylt: false,
          }}
          vilkar={[]}
          tilgjengeligeVedtaksbrev={alleTilgjengeligeVedtaksbrev}
          informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
          dokumentdata={dokumentdata}
          fritekstdokumenter={[]}
          vedtakVarsel={vedtakVarsel}
          submitCallback={() => undefined}
          lagreDokumentdata={() => Promise.resolve()}
          overlappendeYtelser={[]}
          simuleringResultat={{}}
          medlemskapFom="2021-05-02"
          erRevurdering={false}
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
          behandlingPåVent={false}
          previewCallback={previewCallback}
          hentFritekstbrevHtmlCallback={() => undefined}
          readOnly
          sprakkode={sprakkode}
          ytelseTypeKode={fagsakYtelsesType.PLEIEPENGER_SYKT_BARN}
          alleKodeverk={{}}
          personopplysninger={personopplysninger}
          arbeidsgiverOpplysningerPerId={{}}
          tilbakekrevingvalg={{
            videreBehandling: TilbakekrevingValgDtoVidereBehandling.UDEFINIERT,
            erTilbakekrevingVilkårOppfylt: false,
          }}
          vilkar={[]}
          tilgjengeligeVedtaksbrev={alleTilgjengeligeVedtaksbrev}
          informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
          dokumentdata={dokumentdata}
          fritekstdokumenter={[]}
          vedtakVarsel={vedtakVarsel}
          submitCallback={() => undefined}
          lagreDokumentdata={() => Promise.resolve()}
          overlappendeYtelser={[]}
          simuleringResultat={{}}
          medlemskapFom="2021-05-02"
          erRevurdering={false}
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
          behandlingPåVent={false}
          previewCallback={previewCallback}
          hentFritekstbrevHtmlCallback={() => undefined}
          readOnly={false}
          sprakkode={sprakkode}
          ytelseTypeKode={fagsakYtelsesType.PLEIEPENGER_SYKT_BARN}
          alleKodeverk={{}}
          personopplysninger={personopplysninger}
          arbeidsgiverOpplysningerPerId={{}}
          tilbakekrevingvalg={{
            videreBehandling: TilbakekrevingValgDtoVidereBehandling.UDEFINIERT,
            erTilbakekrevingVilkårOppfylt: false,
          }}
          vilkar={[]}
          tilgjengeligeVedtaksbrev={vedtaksbrevmalerUtenAutomatisk}
          informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
          dokumentdata={dokumentdata}
          fritekstdokumenter={[]}
          vedtakVarsel={vedtakVarsel}
          submitCallback={() => undefined}
          lagreDokumentdata={() => Promise.resolve()}
          overlappendeYtelser={[]}
          simuleringResultat={{}}
          medlemskapFom="2021-05-02"
          erRevurdering={false}
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
