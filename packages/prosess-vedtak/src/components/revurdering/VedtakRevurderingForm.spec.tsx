import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import BehandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { renderWithIntlAndReduxForm, screen } from '@fpsak-frontend/utils-test/test-utils';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import ProsessStegContainer from '@k9-sak-web/behandling-felles/src/components/ProsessStegContainer';

import { BehandlingDtoType, TilbakekrevingValgDtoVidereBehandling } from '@navikt/k9-sak-typescript-client';
import VedtakForm from '../VedtakForm';

const createBehandling = behandlingResultatType => ({
  id: 1,
  versjon: 123,
  fagsakId: 1,
  aksjonspunkter: [],
  behandlingPåVent: false,
  språkkode: 'NO',
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
    const previewCallback = vi.fn();
    const revurdering = createBehandlingAvslag();

    revurdering.type = BehandlingDtoType.REVURDERING;

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
          språkkode={revurdering.språkkode}
          behandlingPåVent={revurdering.behandlingPåVent}
          previewCallback={previewCallback}
          readOnly={false}
          ytelseTypeKode={fagsakYtelsesType.PLEIEPENGER_SYKT_BARN}
          arbeidsgiverOpplysningerPerId={{}}
          tilgjengeligeVedtaksbrev={tilgjengeligeVedtaksbrev}
          personopplysninger={personopplysninger}
          vilkar={[]}
          erRevurdering
          dokumentdata={{}}
          fritekstdokumenter={[]}
          hentFritekstbrevHtmlCallback={vi.fn()}
          lagreDokumentdata={vi.fn()}
          simuleringResultat={{}}
          tilbakekrevingvalg={{
            videreBehandling: TilbakekrevingValgDtoVidereBehandling.UDEFINIERT,
            erTilbakekrevingVilkårOppfylt: false,
          }}
          informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
          medlemskapFom={null}
          overlappendeYtelser={[]}
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
          språkkode={revurdering.språkkode}
          behandlingPåVent={revurdering.behandlingPåVent}
          personopplysninger={personopplysninger}
          previewCallback={previewCallback}
          readOnly={false}
          ytelseTypeKode={fagsakYtelsesType.PLEIEPENGER_SYKT_BARN}
          arbeidsgiverOpplysningerPerId={{}}
          tilgjengeligeVedtaksbrev={tilgjengeligeVedtaksbrev}
          vilkar={[]}
          erRevurdering
          dokumentdata={{}}
          fritekstdokumenter={[]}
          hentFritekstbrevHtmlCallback={vi.fn()}
          lagreDokumentdata={vi.fn()}
          simuleringResultat={{}}
          tilbakekrevingvalg={{
            videreBehandling: TilbakekrevingValgDtoVidereBehandling.UDEFINIERT,
            erTilbakekrevingVilkårOppfylt: false,
          }}
          informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
          medlemskapFom={null}
          overlappendeYtelser={[]}
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
          språkkode={revurdering.språkkode}
          behandlingPåVent={revurdering.behandlingPåVent}
          personopplysninger={personopplysninger}
          previewCallback={previewCallback}
          readOnly={false}
          ytelseTypeKode={fagsakYtelsesType.PLEIEPENGER_SYKT_BARN}
          arbeidsgiverOpplysningerPerId={{}}
          tilgjengeligeVedtaksbrev={tilgjengeligeVedtaksbrev}
          vilkar={[]}
          erRevurdering
          dokumentdata={{}}
          fritekstdokumenter={[]}
          hentFritekstbrevHtmlCallback={vi.fn()}
          lagreDokumentdata={vi.fn()}
          simuleringResultat={{}}
          tilbakekrevingvalg={{
            videreBehandling: TilbakekrevingValgDtoVidereBehandling.UDEFINIERT,
            erTilbakekrevingVilkårOppfylt: false,
          }}
          informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
          medlemskapFom={null}
          overlappendeYtelser={[]}
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
          språkkode={revurdering.språkkode}
          behandlingPåVent={revurdering.behandlingPåVent}
          personopplysninger={personopplysninger}
          previewCallback={previewCallback}
          readOnly={false}
          ytelseTypeKode={fagsakYtelsesType.PLEIEPENGER_SYKT_BARN}
          alleKodeverk={{}}
          arbeidsgiverOpplysningerPerId={{}}
          tilgjengeligeVedtaksbrev={tilgjengeligeVedtaksbrev}
          erRevurdering
          dokumentdata={{}}
          fritekstdokumenter={[]}
          hentFritekstbrevHtmlCallback={vi.fn()}
          lagreDokumentdata={vi.fn()}
          simuleringResultat={{}}
          tilbakekrevingvalg={{
            videreBehandling: TilbakekrevingValgDtoVidereBehandling.UDEFINIERT,
            erTilbakekrevingVilkårOppfylt: false,
          }}
          informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
          medlemskapFom={null}
          overlappendeYtelser={[]}
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
    const previewCallback = vi.fn();
    const revurdering = createBehandlingOpphor();

    renderWithIntlAndReduxForm(
      <ProsessStegContainer formaterteProsessStegPaneler={[]} velgProsessStegPanelCallback={vi.fn()}>
        <VedtakForm
          behandlingStatus={revurdering.status}
          behandlingresultat={revurdering.behandlingsresultat}
          aksjonspunkter={revurdering.aksjonspunkter}
          språkkode={revurdering.språkkode}
          behandlingPåVent={revurdering.behandlingPåVent}
          personopplysninger={personopplysninger}
          previewCallback={previewCallback}
          readOnly={false}
          ytelseTypeKode={fagsakYtelsesType.PLEIEPENGER_SYKT_BARN}
          arbeidsgiverOpplysningerPerId={{}}
          tilgjengeligeVedtaksbrev={tilgjengeligeVedtaksbrev}
          erRevurdering
          dokumentdata={{}}
          fritekstdokumenter={[]}
          hentFritekstbrevHtmlCallback={vi.fn()}
          lagreDokumentdata={vi.fn()}
          simuleringResultat={{}}
          tilbakekrevingvalg={{
            videreBehandling: TilbakekrevingValgDtoVidereBehandling.UDEFINIERT,
            erTilbakekrevingVilkårOppfylt: false,
          }}
          informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
          medlemskapFom={null}
          overlappendeYtelser={[]}
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
