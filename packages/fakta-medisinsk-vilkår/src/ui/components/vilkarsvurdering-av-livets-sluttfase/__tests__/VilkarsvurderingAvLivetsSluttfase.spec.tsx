import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { BehandlingProvider } from '@k9-sak-web/gui/context/BehandlingContext.js';
import { httpUtils } from '@fpsak-frontend/utils';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type ContainerContract from '../../../../types/ContainerContract';
import type SykdomsstegStatusResponse from '../../../../types/SykdomsstegStatusResponse';
import Step, { sluttfaseDokumentSteg } from '../../../../types/Step';
import Vurderingstype from '../../../../types/Vurderingstype';
import ContainerContext from '../../../context/ContainerContext';
import VurderingContext from '../../../context/VurderingContext';
import VilkårsvurderingAvLivetsSluttfase from '../VilkarsvurderingAvLivetsSluttfase';

const vurderingsoversiktEndpoint = 'vurderingsoversikt-livets-sluttfase-mock';
const vurderingsopprettelseEndpoint = 'vurderingsopprettelse-livets-sluttfase-mock';

const opprettVurderingsoversikt = (medPerioderSomMåVurderes = false) => {
  const periode = { fom: '2028-01-01', tom: '2028-01-01' };
  return {
    perioderSomKanVurderes: medPerioderSomMåVurderes ? [periode] : [],
    resterendeVurderingsperioder: medPerioderSomMåVurderes ? [periode] : [],
    resterendeValgfrieVurderingsperioder: [],
    søknadsperioderTilBehandling: [],
    vurderingselementer: medPerioderSomMåVurderes ? [] : [{ periode }],
    links: [
      {
        rel: 'sykdom-vurdering-opprettelse',
        href: vurderingsopprettelseEndpoint,
        requestPayload: { behandlingUuid: 'foo' },
      },
    ],
  };
};

const opprettStatus = (endringer: Partial<SykdomsstegStatusResponse> = {}): SykdomsstegStatusResponse => ({
  kanLøseAksjonspunkt: false,
  harDataSomIkkeHarBlittTattMedIBehandling: false,
  harUklassifiserteDokumenter: false,
  manglerGodkjentLegeerklæring: false,
  nyttDokumentHarIkkekontrollertEksisterendeVurderinger: false,
  ikkeSammenMedBarnet: false,
  ...endringer,
});

const renderMedKontekst = (innhold: ReactNode) => {
  const kontekstverdi: ContainerContract = {
    endpoints: {
      vurderingsoversiktKontinuerligTilsynOgPleie: '',
      vurderingsoversiktBehovForToOmsorgspersoner: '',
      vurderingsoversiktLivetsSluttfase: vurderingsoversiktEndpoint,
      vurderingsoversiktLangvarigSykdom: undefined,
      dokumentoversikt: '',
      innleggelsesperioder: '',
      diagnosekoder: '',
      dataTilVurdering: '',
      status: '',
      nyeDokumenter: '',
      perioderMedVilkar: undefined,
    },
    behandlingUuid: 'foo',
    readOnly: false,
    onFinished: () => undefined,
    errorNotifier: () => undefined,
    visFortsettknapp: false,
    fagsakYtelseType: fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE,
  };

  return render(
    <BehandlingProvider
      refetchBehandling={vi.fn()}
      settBehandling={vi.fn()}
      oppdaterProsessStegOgFaktaPanelIUrl={vi.fn()}
    >
      <ContainerContext.Provider value={kontekstverdi}>
        <VurderingContext.Provider value={{ vurderingstype: Vurderingstype.LIVETS_SLUTTFASE }}>
          {innhold}
        </VurderingContext.Provider>
      </ContainerContext.Provider>
    </BehandlingProvider>,
  );
};

const opprettKomponent = (
  hentSykdomsstegStatus: () => Promise<SykdomsstegStatusResponse> = () => Promise.resolve(opprettStatus()),
  navigerTilNesteSteg: (steg: Step, ikkeMarkerSteg?: boolean) => void = () => undefined,
) =>
  renderMedKontekst(
    <VilkårsvurderingAvLivetsSluttfase
      navigerTilNesteSteg={navigerTilNesteSteg}
      sykdomsstegStatus={opprettStatus()}
      hentSykdomsstegStatus={hentSykdomsstegStatus}
    />,
  );

const fyllUtOgSendVurdering = async () => {
  const tekstfelt = await screen.findByLabelText(/Gjør en vurdering av/i);
  fireEvent.change(tekstfelt, { target: { value: 'Vurdert informasjon' } });
  fireEvent.click(screen.getByLabelText('Ja'));

  const bekreftKnapp = screen.getByText('Bekreft');
  const skjema = bekreftKnapp.closest('form');
  if (!skjema) {
    throw new Error('Fant ikke skjemaet for vurderingen');
  }
  fireEvent.submit(skjema);
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Vilkårsvurdering av livets sluttfase', () => {
  it('viser lasting mens vurderingsoversikten hentes, og viser innholdet etterpå', async () => {
    vi.spyOn(httpUtils, 'get').mockImplementation(() => Promise.resolve(opprettVurderingsoversikt()));

    renderMedKontekst(
      <VilkårsvurderingAvLivetsSluttfase
        navigerTilNesteSteg={() => undefined}
        sykdomsstegStatus={opprettStatus()}
        hentSykdomsstegStatus={() => Promise.resolve(opprettStatus())}
      />,
    );

    expect(screen.getByText('venter', { exact: false })).toBeInTheDocument();
    expect(await screen.findByText('Ny vurdering')).toBeInTheDocument();
    expect(screen.queryByText('venter', { exact: false })).not.toBeInTheDocument();
  });

  it('viser feiltilstand når henting av vurderingsoversikten feiler', async () => {
    vi.spyOn(httpUtils, 'get').mockRejectedValue(new Error('Henting feilet'));

    renderMedKontekst(
      <VilkårsvurderingAvLivetsSluttfase
        navigerTilNesteSteg={() => undefined}
        sykdomsstegStatus={opprettStatus()}
        hentSykdomsstegStatus={() => Promise.resolve(opprettStatus())}
      />,
    );

    expect(screen.getByText('venter', { exact: false })).toBeInTheDocument();
    expect(await screen.findByText(/Noe gikk galt, vennligst prøv igjen senere/i)).toBeInTheDocument();
  });

  it('åpner skjemaet automatisk når det finnes perioder som må vurderes', async () => {
    vi.spyOn(httpUtils, 'get').mockImplementation(() => Promise.resolve(opprettVurderingsoversikt(true)));

    renderMedKontekst(
      <VilkårsvurderingAvLivetsSluttfase
        navigerTilNesteSteg={() => undefined}
        sykdomsstegStatus={opprettStatus()}
        hentSykdomsstegStatus={() => Promise.resolve(opprettStatus())}
      />,
    );

    expect(await screen.findByLabelText(/Gjør en vurdering av/i)).toBeInTheDocument();
    expect(screen.getAllByText(/01\.01\.2028/).length).toBeGreaterThan(0);
  });

  it('åpner skjemaet med «Ny vurdering» og lukker det med «Avbryt» når ingen perioder gjenstår', async () => {
    vi.spyOn(httpUtils, 'get').mockImplementation(() => Promise.resolve(opprettVurderingsoversikt()));
    const visning = opprettKomponent();

    expect(visning.queryByText(/Gjør en vurdering av/i)).not.toBeInTheDocument();
    fireEvent.click(await screen.findByText('Ny vurdering'));
    expect(await screen.findByLabelText(/Gjør en vurdering av/i)).toBeVisible();

    fireEvent.click(screen.getByText(/^Avbryt$/i));
    expect(screen.queryByLabelText(/Gjør en vurdering av/i)).not.toBeInTheDocument();
  });

  it('henter status etter lagring og oppdaterer oversikten når aksjonspunktet kan løses', async () => {
    const oversikt = opprettVurderingsoversikt(true);
    const getSpy = vi.spyOn(httpUtils, 'get').mockImplementation(() => Promise.resolve(oversikt));
    const postSpy = vi.spyOn(httpUtils, 'post').mockImplementation(() => Promise.resolve({ perioderMedEndringer: [] }));
    const hentStatus = vi.fn(() => Promise.resolve(opprettStatus({ kanLøseAksjonspunkt: true })));
    const naviger = vi.fn();

    opprettKomponent(hentStatus, naviger);
    await screen.findByLabelText(/Gjør en vurdering av/i);
    const antallHentingerFørLagring = getSpy.mock.calls.length;

    await fyllUtOgSendVurdering();

    await waitFor(() => {
      expect(postSpy).toHaveBeenCalledTimes(2);
      expect(hentStatus).toHaveBeenCalledTimes(1);
      expect(getSpy.mock.calls.length).toBeGreaterThan(antallHentingerFørLagring);
      expect(naviger).not.toHaveBeenCalled();
    });
  });

  it('navigerer til dokumentsteget etter lagring når det finnes uklassifiserte dokumenter', async () => {
    vi.spyOn(httpUtils, 'get').mockImplementation(() => Promise.resolve(opprettVurderingsoversikt(true)));
    const postSpy = vi.spyOn(httpUtils, 'post').mockImplementation(() => Promise.resolve({ perioderMedEndringer: [] }));
    const hentStatus = vi.fn(() => Promise.resolve(opprettStatus({ harUklassifiserteDokumenter: true })));
    const naviger = vi.fn();

    opprettKomponent(hentStatus, naviger);
    await screen.findByLabelText(/Gjør en vurdering av/i);
    await fyllUtOgSendVurdering();

    await waitFor(() => {
      expect(postSpy).toHaveBeenCalledTimes(2);
      expect(hentStatus).toHaveBeenCalledTimes(1);
      expect(naviger).toHaveBeenCalledWith(sluttfaseDokumentSteg);
    });
  });

  it('henter en oppdatert oversikt når status fortsatt mangler vurdering av livets sluttfase', async () => {
    const getSpy = vi
      .spyOn(httpUtils, 'get')
      .mockImplementation(() => Promise.resolve(opprettVurderingsoversikt(true)));
    const postSpy = vi.spyOn(httpUtils, 'post').mockImplementation(() => Promise.resolve({ perioderMedEndringer: [] }));
    const hentStatus = vi.fn(() => Promise.resolve(opprettStatus({ manglerVurderingAvILivetsSluttfase: true })));
    const naviger = vi.fn();

    opprettKomponent(hentStatus, naviger);
    await screen.findByLabelText(/Gjør en vurdering av/i);
    const antallHentingerFørLagring = getSpy.mock.calls.length;

    await fyllUtOgSendVurdering();

    await waitFor(() => {
      expect(postSpy).toHaveBeenCalledTimes(2);
      expect(hentStatus).toHaveBeenCalledTimes(1);
      expect(getSpy.mock.calls.length).toBeGreaterThan(antallHentingerFørLagring);
      expect(naviger).not.toHaveBeenCalled();
    });
  });
});
