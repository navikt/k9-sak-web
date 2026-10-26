import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { BehandlingStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/BehandlingStatus.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import type { AktivitetspengerApi } from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/AktivitetspengerApi.js';
import { FakeAktivitetspengerApi } from '@k9-sak-web/gui/storybook/mocks/FakeAktivitetspengerApi.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { Suspense } from 'react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { SimuleringProsessStegInitPanel } from './SimuleringProsessStegInitPanel';

const { avregningProps } = vi.hoisted(() => ({ avregningProps: { current: undefined as any } }));

vi.mock('@k9-sak-web/gui/prosess/avregning/AvregningProsessIndex.js', () => ({
  AvregningProsessIndex: (props: { isReadOnly: boolean }) => {
    avregningProps.current = props;
    return <div data-testid="avregning">{props.isReadOnly ? 'readonly' : 'redigerbar'}</div>;
  },
}));

type Aksjonspunkter = Awaited<ReturnType<AktivitetspengerApi['getAksjonspunkter']>>;
type InnloggetBruker = Awaited<ReturnType<AktivitetspengerApi['getInnloggetBruker']>>;

const del2Saksbehandler = {
  aktivitetspengerDel2SaksbehandlerTilgang: { kanSaksbehandle: true, kanBeslutte: false },
} as InnloggetBruker;

const vurderFeilutbetaling = (kanLoses: boolean) =>
  ({
    definisjon: AksjonspunktDefinisjon.VURDER_FEILUTBETALING,
    status: aksjonspunktStatus.OPPRETTET,
    kanLoses,
  }) as Aksjonspunkter[number];

const createApi = (aksjonspunkter: Aksjonspunkter, innloggetBruker: InnloggetBruker): AktivitetspengerApi =>
  Object.assign(new FakeAktivitetspengerApi(), {
    getAksjonspunkter: async () => aksjonspunkter,
    getInnloggetBruker: async () => innloggetBruker,
    getFagsak: async () => ({ saksnummer: '123', sakstype: 'AVP' }),
    getSimuleringResultat: async () => ({
      simuleringResultat: { perioderPerMottaker: [{ mottakerType: 'BRUKER' }] },
    }),
    getTilbakekrevingValg: async () => ({ videreBehandling: 'TILBAKEKR_OPPRETT' }),
  }) as unknown as AktivitetspengerApi;

const createBehandling = (status: BehandlingStatus) =>
  ({ uuid: 'behandling-uuid', versjon: 1, status }) as BehandlingDto;

describe('SimuleringProsessStegInitPanel', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    avregningProps.current = undefined;
  });

  const renderPanel = (api: AktivitetspengerApi, behandling: BehandlingDto) =>
    render(
      <QueryClientProvider client={queryClient}>
        <ProsessPanelContext.Provider value={{ erValgt: () => true, erTilBehandlingEllerBehandlet: () => true }}>
          <Suspense fallback="laster">
            <SimuleringProsessStegInitPanel api={api} behandling={behandling} saksnummer="123" />
          </Suspense>
        </ProsessPanelContext.Provider>
      </QueryClientProvider>,
    );

  test('bruker V2-panelet og videresender dataene fra API-et', async () => {
    const api = createApi([vurderFeilutbetaling(true)], del2Saksbehandler);
    const behandling = createBehandling(BehandlingStatus.UTREDES);
    renderPanel(api, behandling);

    expect(await screen.findByTestId('avregning')).toHaveTextContent('redigerbar');
    expect(avregningProps.current.behandling).toBe(behandling);
    expect(avregningProps.current.aksjonspunkter).toEqual([vurderFeilutbetaling(true)]);
    expect(avregningProps.current.fagsak).toEqual({ saksnummer: '123', sakstype: 'AVP' });
    expect(avregningProps.current.simuleringResultat.simuleringResultat.perioderPerMottaker[0].mottakerType).toBe(
      'BRUKER',
    );
    expect(avregningProps.current.tilbakekrevingvalg).toEqual({ videreBehandling: 'TILBAKEKR_OPPRETT' });
  });

  test('er redigerbar når aksjonspunktet kan løses og behandlingen er under behandling', async () => {
    renderPanel(createApi([vurderFeilutbetaling(true)], del2Saksbehandler), createBehandling(BehandlingStatus.UTREDES));

    expect(await screen.findByTestId('avregning')).toHaveTextContent('redigerbar');
  });

  test('er readonly når behandlingen fatter vedtak', async () => {
    renderPanel(
      createApi([vurderFeilutbetaling(true)], del2Saksbehandler),
      createBehandling(BehandlingStatus.FATTER_VEDTAK),
    );

    expect(await screen.findByTestId('avregning')).toHaveTextContent('readonly');
  });

  test('er readonly når behandlingen er avsluttet', async () => {
    renderPanel(
      createApi([vurderFeilutbetaling(true)], del2Saksbehandler),
      createBehandling(BehandlingStatus.AVSLUTTET),
    );

    expect(await screen.findByTestId('avregning')).toHaveTextContent('readonly');
  });

  test('er readonly når aksjonspunktet ikke kan løses', async () => {
    renderPanel(
      createApi([vurderFeilutbetaling(false)], del2Saksbehandler),
      createBehandling(BehandlingStatus.UTREDES),
    );

    expect(await screen.findByTestId('avregning')).toHaveTextContent('readonly');
  });

  test('er readonly når aksjonspunktet mangler', async () => {
    renderPanel(createApi([], del2Saksbehandler), createBehandling(BehandlingStatus.UTREDES));

    expect(await screen.findByTestId('avregning')).toHaveTextContent('readonly');
  });

  test('er readonly når brukeren mangler del 2-tilgang', async () => {
    renderPanel(createApi([vurderFeilutbetaling(true)], {}), createBehandling(BehandlingStatus.UTREDES));

    expect(await screen.findByTestId('avregning')).toHaveTextContent('readonly');
  });
});
