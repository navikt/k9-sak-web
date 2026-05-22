import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import type { AktivitetspengerApi } from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/AktivitetspengerApi.js';
import { FakeAktivitetspengerApi } from '@k9-sak-web/gui/storybook/mocks/FakeAktivitetspengerApi.js';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { ung_kodeverk_vilkår_VilkårType } from '@navikt/ung-sak-typescript-client/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { beforeEach, describe, expect, test } from 'vitest';
import { useProsessmotor } from './Prossesmotor';

const createWrapper = (queryClient: QueryClient) => {
  return ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

type ApiOverrides = {
  vilkår?: Awaited<ReturnType<AktivitetspengerApi['getVilkår']>>;
  aksjonspunkter?: Awaited<ReturnType<AktivitetspengerApi['getAksjonspunkter']>>;
  innloggetBruker?: Awaited<ReturnType<AktivitetspengerApi['getInnloggetBruker']>>;
};

const createApi = (overrides?: ApiOverrides): AktivitetspengerApi =>
  Object.assign(new FakeAktivitetspengerApi(), {
    getVilkår: async () => overrides?.vilkår ?? [],
    getAksjonspunkter: async () => overrides?.aksjonspunkter ?? [],
    getInnloggetBruker: async () => overrides?.innloggetBruker ?? {},
  });

const createVilkår = (vilkarStatus: Utfall, type: ung_kodeverk_vilkår_VilkårType) => ({
  vilkarType: type,
  perioder: [{ vilkarStatus, periode: { fom: '2024-01-01', tom: '2024-01-31' } }],
});

const createBehandling = (overrides = {}) => ({
  uuid: 'behandling-uuid',
  versjon: 1,
  behandlingsresultat: { type: { kode: 'INNVILGET', kodeverk: 'BEHANDLING_RESULTAT_TYPE' } },
  ...overrides,
});

describe('Prossesmotor', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  test('returnerer fem paneler i forventet rekkefølge', async () => {
    const api = createApi();
    const behandling = createBehandling();

    const { result } = renderHook(() => useProsessmotor({ api, behandling }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current).toHaveLength(5);
      expect(result.current.map(panel => panel.label)).toEqual([
        'Inngangsvilkår',
        'Medlemskap',
        'Beregning',
        'Beregnet utbetaling',
        'Vedtak',
      ]);
    });
  });

  test('setter inngangsvilkår til warning når det finnes åpent aksjonspunkt', async () => {
    const api = createApi({
      aksjonspunkter: [
        {
          definisjon: AksjonspunktDefinisjon.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST,
          status: aksjonspunktStatus.OPPRETTET,
        },
      ],
    });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current[0].type).toBe(ProcessMenuStepType.warning);
      expect(result.current[1].type).toBe(ProcessMenuStepType.default);
      expect(result.current[2].type).toBe(ProcessMenuStepType.default);
    });
  });

  test('setter inngangsvilkår til danger ved avslått enkelperiode', async () => {
    const api = createApi({
      vilkår: [createVilkår(Utfall.IKKE_OPPFYLT, ung_kodeverk_vilkår_VilkårType.SØKNADSFRIST)],
    });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current[0].type).toBe(ProcessMenuStepType.danger);
      expect(result.current[1].type).toBe(ProcessMenuStepType.default);
    });
  });

  test('setter locked=true når inngangsvilkår er success og bruker mangler tilgang', async () => {
    const api = createApi({
      vilkår: [createVilkår(Utfall.OPPFYLT, ung_kodeverk_vilkår_VilkårType.SØKNADSFRIST)],
      innloggetBruker: {
        aktivitetspengerDel1SaksbehandlerTilgang: {
          kanBeslutte: false,
          kanSaksbehandle: false,
        },
      },
    });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current[0].type).toBe(ProcessMenuStepType.success);
      expect((result.current[0] as { locked?: boolean }).locked).toBe(true);
    });
  });

  test('setter vedtak til warning når vedtak-aksjonspunkt er åpent og øvrige vilkår er vurdert', async () => {
    const api = createApi({
      vilkår: [createVilkår(Utfall.OPPFYLT, ung_kodeverk_vilkår_VilkårType.SØKNADSFRIST)],
      aksjonspunkter: [
        {
          definisjon: AksjonspunktDefinisjon.FORESLÅ_VEDTAK,
          status: aksjonspunktStatus.OPPRETTET,
        },
      ],
    });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current[4].type).toBe(ProcessMenuStepType.warning);
    });
  });

  test('setter vedtak til default når ikke-vedtak-aksjonspunkt er åpent', async () => {
    const api = createApi({
      vilkår: [createVilkår(Utfall.OPPFYLT, ung_kodeverk_vilkår_VilkårType.SØKNADSFRIST)],
      aksjonspunkter: [
        {
          definisjon: AksjonspunktDefinisjon.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST,
          status: aksjonspunktStatus.OPPRETTET,
        },
      ],
    });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current[4].type).toBe(ProcessMenuStepType.default);
    });
  });
});
