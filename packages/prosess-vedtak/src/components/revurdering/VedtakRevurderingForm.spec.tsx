import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import BehandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { renderWithIntlAndReduxForm, screen } from '@fpsak-frontend/utils-test/test-utils';
import ProsessStegContainer from '@k9-sak-web/behandling-felles/src/components/ProsessStegContainer';
import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';

import { behandlingResultatType, behandlingType, videreBehandling } from '@navikt/k9-sak-typescript-client';
import VedtakForm from '../VedtakForm';

const createBehandling = behandlingResultatType => ({
  id: 1,
  versjon: 123,
  fagsakId: 1,
  aksjonspunkter: [],
  behandlingPaaVent: false,
  sprakkode: 'NO',
  behandlingsresultat: {
    id: 1,
    type: behandlingResultatType,
    avslagsarsak: behandlingResultatType === BehandlingResultatType.AVSLATT ? '1019' : null,
    avslagsarsakFritekst: null,
  },
  status: behandlingStatus.BEHANDLING_UTREDES,
  type: 'test',
  opprettet: '16‎.‎07‎.‎2004‎ ‎17‎:‎35‎:‎21',
});

const resultatstruktur = {
  antallBarn: 1,
  opphoersdato: '2018-01-01',
  type: behandlingResultatType.IKKE_FASTSATT,
};

const personopplysninger = { aktoerId: '', fnr: '' };

const tilgjengeligeVedtaksbrev = { vedtaksbrevmaler: {}, begrunnelse: '', alternativeMottakere: [] };

const informasjonsbehovVedtaksbrev = {
  informasjonsbehov: [],
  mangler: [],
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

const createBehandlingAvslag = () => createBehandling(BehandlingResultatType.AVSLATT);
const createBehandlingOpphor = () => createBehandling(BehandlingResultatType.OPPHOR);

describe('<VedtakRevurderingForm>', () => {
  it('skal vise result ved avslag, og submitpanel', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    const previewCallback = vi.fn();
    const revurdering = createBehandlingAvslag();

    revurdering.type = behandlingType.BT_004;

    revurdering.aksjonspunkter.push({
      id: 0,
      definisjon: {
        navn: 'Foreslå vedtak',
        kode: aksjonspunktCodes.FORESLA_VEDTAK,
      },
      status: {
        navn: 'Opprettet',
        kode: '',
      },
      kanLoses: true,
      erAktivt: true,
    });

    renderWithIntlAndReduxForm(
      <ProsessStegContainer formaterteProsessStegPaneler={[]} velgProsessStegPanelCallback={vi.fn()}>
        <VedtakForm
          behandlingStatus={revurdering.status}
          behandlingresultat={revurdering.behandlingsresultat}
          aksjonspunkter={revurdering.aksjonspunkter}
          sprakkode={revurdering.sprakkode}
          behandlingPaaVent={revurdering.behandlingPaaVent}
          previewCallback={previewCallback}
          readOnly={false}
          ytelseTypeKode={fagsakYtelseType.PLEIEPENGER}
          resultatstruktur={resultatstruktur}
          arbeidsgiverOpplysningerPerId={{}}
          tilgjengeligeVedtaksbrev={tilgjengeligeVedtaksbrev}
          personopplysninger={personopplysninger}
          vilkar={[]}
          erRevurdering
          behandlingArsaker={[]}
          dokumentdata={{}}
          fritekstdokumenter={[]}
          hentFritekstbrevHtmlCallback={vi.fn()}
          lagreDokumentdata={vi.fn()}
          simuleringResultat={{}}
          tilbakekrevingvalg={{ videreBehandling: videreBehandling.UDEFINIERT, erTilbakekrevingVilkårOppfylt: false }}
          informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
          medlemskapFom={null}
          overlappendeYtelser={[]}
          resultatstrukturOriginalBehandling={null}
          submitCallback={() => undefined}
          vedtakVarsel={vedtakVarselBase}
        />
      </ProsessStegContainer>,
    );

    expect(screen.getByTestId('vedtakAksjonspunktPanel')).toBeInTheDocument();
    expect(screen.getByText('VedtakForm.ArsakTilAvslag')).toBeInTheDocument();

    const submitknapp = screen.getByRole('button');
    expect(submitknapp).toHaveTextContent('VedtakForm.FattVedtak');
    expect(screen.getByTestId('brevpanel')).toBeInTheDocument();
  });

  it('Revurdering, skal vise resultat ved endret belop, hovedknappen for totrinnskontroll', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    const previewCallback = vi.fn();
    const revurdering = createBehandlingAvslag();

    revurdering.behandlingsresultat = {
      ...revurdering.behandlingsresultat,
      id: 1,
      type: BehandlingResultatType.INNVILGET,
    };
    revurdering.aksjonspunkter.push({
      id: 0,
      definisjon: aksjonspunktCodes.FORESLA_VEDTAK,
      status: '',
      kanLoses: true,
      erAktivt: true,
      toTrinnsBehandling: true,
    });

    renderWithIntlAndReduxForm(
      <ProsessStegContainer formaterteProsessStegPaneler={[]} velgProsessStegPanelCallback={vi.fn()}>
        <VedtakForm
          behandlingStatus={revurdering.status}
          behandlingresultat={revurdering.behandlingsresultat}
          aksjonspunkter={revurdering.aksjonspunkter}
          sprakkode={revurdering.sprakkode}
          behandlingPaaVent={revurdering.behandlingPaaVent}
          personopplysninger={personopplysninger}
          previewCallback={previewCallback}
          readOnly={false}
          ytelseTypeKode={fagsakYtelseType.PLEIEPENGER}
          resultatstruktur={resultatstruktur}
          arbeidsgiverOpplysningerPerId={{}}
          tilgjengeligeVedtaksbrev={tilgjengeligeVedtaksbrev}
          vilkar={[]}
          erRevurdering
          behandlingArsaker={[]}
          dokumentdata={{}}
          fritekstdokumenter={[]}
          hentFritekstbrevHtmlCallback={vi.fn()}
          lagreDokumentdata={vi.fn()}
          simuleringResultat={{}}
          tilbakekrevingvalg={{ videreBehandling: videreBehandling.UDEFINIERT, erTilbakekrevingVilkårOppfylt: false }}
          informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
          medlemskapFom={null}
          overlappendeYtelser={[]}
          resultatstrukturOriginalBehandling={null}
          submitCallback={() => undefined}
          vedtakVarsel={vedtakVarselBase}
        />
      </ProsessStegContainer>,
    );

    expect(screen.getByTestId('vedtakAksjonspunktPanel')).toBeInTheDocument();
    expect(screen.getByTestId('innvilgetRevurdering')).toBeInTheDocument();
    expect(screen.queryByText('VedtakForm.ArsakTilAvslag')).not.toBeInTheDocument();

    const submitknapp = screen.getByRole('button');
    expect(submitknapp).toHaveTextContent('VedtakForm.SendTilBeslutter');
    expect(screen.getByTestId('brevpanel')).toBeInTheDocument();
  });

  it('skal vise result ved ingen endring, hovedknappen', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    const previewCallback = vi.fn();
    const revurdering = createBehandlingAvslag();
    revurdering.behandlingsresultat = {
      ...revurdering.behandlingsresultat,
      id: 1,
      type: BehandlingResultatType.INNVILGET,
    };

    renderWithIntlAndReduxForm(
      <ProsessStegContainer formaterteProsessStegPaneler={[]} velgProsessStegPanelCallback={vi.fn()}>
        <VedtakForm
          behandlingStatus={revurdering.status}
          behandlingresultat={revurdering.behandlingsresultat}
          aksjonspunkter={revurdering.aksjonspunkter}
          sprakkode={revurdering.sprakkode}
          behandlingPaaVent={revurdering.behandlingPaaVent}
          personopplysninger={personopplysninger}
          previewCallback={previewCallback}
          readOnly={false}
          ytelseTypeKode={fagsakYtelseType.PLEIEPENGER}
          resultatstruktur={resultatstruktur}
          arbeidsgiverOpplysningerPerId={{}}
          tilgjengeligeVedtaksbrev={tilgjengeligeVedtaksbrev}
          vilkar={[]}
          erRevurdering
          behandlingArsaker={[]}
          dokumentdata={{}}
          fritekstdokumenter={[]}
          hentFritekstbrevHtmlCallback={vi.fn()}
          lagreDokumentdata={vi.fn()}
          simuleringResultat={{}}
          tilbakekrevingvalg={{ videreBehandling: videreBehandling.UDEFINIERT, erTilbakekrevingVilkårOppfylt: false }}
          informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
          medlemskapFom={null}
          overlappendeYtelser={[]}
          resultatstrukturOriginalBehandling={null}
          submitCallback={() => undefined}
          vedtakVarsel={vedtakVarselBase}
        />
      </ProsessStegContainer>,
    );

    const submitknapp = screen.getByRole('button');
    expect(submitknapp).toHaveTextContent('VedtakForm.FattVedtak');
    expect(screen.getByTestId('brevpanel')).toBeInTheDocument();
    expect(screen.getByTestId('vedtakAksjonspunktPanel')).toBeInTheDocument();
    expect(screen.getByTestId('innvilgetRevurdering')).toBeInTheDocument();
    expect(screen.queryByText('VedtakForm.ArsakTilAvslag')).not.toBeInTheDocument();
  });

  it('skal vise result ved ingen endring, og submitpanel', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    const previewCallback = vi.fn();
    const revurdering = createBehandlingAvslag();
    revurdering.behandlingsresultat = {
      ...revurdering.behandlingsresultat,
      id: 1,
      type: BehandlingResultatType.INNVILGET,
    };

    renderWithIntlAndReduxForm(
      <ProsessStegContainer formaterteProsessStegPaneler={[]} velgProsessStegPanelCallback={vi.fn()}>
        <VedtakForm
          behandlingStatus={revurdering.status}
          behandlingresultat={revurdering.behandlingsresultat}
          aksjonspunkter={revurdering.aksjonspunkter}
          sprakkode={revurdering.sprakkode}
          behandlingPaaVent={revurdering.behandlingPaaVent}
          personopplysninger={personopplysninger}
          previewCallback={previewCallback}
          readOnly={false}
          ytelseTypeKode={fagsakYtelseType.PLEIEPENGER}
          resultatstruktur={resultatstruktur}
          arbeidsgiverOpplysningerPerId={{}}
          tilgjengeligeVedtaksbrev={tilgjengeligeVedtaksbrev}
          erRevurdering
          behandlingArsaker={[]}
          dokumentdata={{}}
          fritekstdokumenter={[]}
          hentFritekstbrevHtmlCallback={vi.fn()}
          lagreDokumentdata={vi.fn()}
          simuleringResultat={{}}
          tilbakekrevingvalg={{ videreBehandling: videreBehandling.UDEFINIERT, erTilbakekrevingVilkårOppfylt: false }}
          informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
          medlemskapFom={null}
          overlappendeYtelser={[]}
          resultatstrukturOriginalBehandling={null}
          submitCallback={() => undefined}
          vedtakVarsel={vedtakVarselBase}
          vilkar={[]}
        />
      </ProsessStegContainer>,
    );

    const submitknapp = screen.getByRole('button');
    expect(submitknapp).toHaveTextContent('VedtakForm.FattVedtak');
    expect(screen.getByTestId('brevpanel')).toBeInTheDocument();
    expect(screen.getByTestId('vedtakAksjonspunktPanel')).toBeInTheDocument();
    expect(screen.getByTestId('innvilgetRevurdering')).toBeInTheDocument();
    expect(screen.queryByText('VedtakForm.ArsakTilAvslag')).not.toBeInTheDocument();
  });

  it('skal vise opphørspanel når behandlingsresultat er opphør', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    const previewCallback = vi.fn();
    const revurdering = createBehandlingOpphor();

    renderWithIntlAndReduxForm(
      <ProsessStegContainer formaterteProsessStegPaneler={[]} velgProsessStegPanelCallback={vi.fn()}>
        <VedtakForm
          behandlingStatus={revurdering.status}
          behandlingresultat={revurdering.behandlingsresultat}
          aksjonspunkter={revurdering.aksjonspunkter}
          sprakkode={revurdering.sprakkode}
          behandlingPaaVent={revurdering.behandlingPaaVent}
          personopplysninger={personopplysninger}
          previewCallback={previewCallback}
          readOnly={false}
          ytelseTypeKode={fagsakYtelseType.PLEIEPENGER}
          resultatstruktur={resultatstruktur}
          arbeidsgiverOpplysningerPerId={{}}
          tilgjengeligeVedtaksbrev={tilgjengeligeVedtaksbrev}
          erRevurdering
          behandlingArsaker={[]}
          dokumentdata={{}}
          fritekstdokumenter={[]}
          hentFritekstbrevHtmlCallback={vi.fn()}
          lagreDokumentdata={vi.fn()}
          simuleringResultat={{}}
          tilbakekrevingvalg={{ videreBehandling: videreBehandling.UDEFINIERT, erTilbakekrevingVilkårOppfylt: false }}
          informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
          medlemskapFom={null}
          overlappendeYtelser={[]}
          resultatstrukturOriginalBehandling={null}
          submitCallback={() => undefined}
          vedtakVarsel={vedtakVarselBase}
          vilkar={[]}
        />
      </ProsessStegContainer>,
    );

    const submitknapp = screen.getByRole('button');
    expect(submitknapp).toHaveTextContent('VedtakForm.FattVedtak');
    expect(screen.getByTestId('brevpanel')).toBeInTheDocument();
    expect(screen.getByTestId('vedtakAksjonspunktPanel')).toBeInTheDocument();
    expect(screen.getByTestId('opphorRevurdering')).toBeInTheDocument();
    expect(screen.queryByTestId('innvilgetRevurdering')).not.toBeInTheDocument();
    expect(screen.queryByText('VedtakForm.ArsakTilAvslag')).not.toBeInTheDocument();
  });
});
