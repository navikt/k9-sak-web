import { BehandlingResultatType } from '@k9-sak-web/backend/combined/kodeverk/behandling/BehandlingResultatType.js';
import { BehandlingType } from '@k9-sak-web/backend/combined/kodeverk/behandling/BehandlingType.js';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { BehandlingStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/BehandlingStatus.js';
import { BehandlingÅrsakType } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/BehandlingÅrsakType.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import type { SimuleringDto } from '@k9-sak-web/backend/ungsak/kontrakt/simulering/v1/SimuleringDto.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import type { AktivitetspengerApi } from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/AktivitetspengerApi.js';
import { FakeAktivitetspengerApi } from '@k9-sak-web/gui/storybook/mocks/FakeAktivitetspengerApi.js';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { ung_kodeverk_vilkår_VilkårType } from '@navikt/ung-sak-typescript-client/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { beforeEach, describe, expect, test } from 'vitest';
import { useProsessmotor } from './Prosessmotor';

const createWrapper = (queryClient: QueryClient) => {
  return ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

type ApiOverrides = {
  vilkår?: Awaited<ReturnType<AktivitetspengerApi['getVilkår']>>;
  aksjonspunkter?: Awaited<ReturnType<AktivitetspengerApi['getAksjonspunkter']>>;
  innloggetBruker?: Awaited<ReturnType<AktivitetspengerApi['getInnloggetBruker']>>;
  beregningsgrunnlag?: Awaited<ReturnType<AktivitetspengerApi['getBeregningsgrunnlag']>>;
  satsOgUtbetalingPerioder?: Awaited<ReturnType<AktivitetspengerApi['getSatsOgUtbetalingPerioder']>>;
  kontrollerInntekt?: Awaited<ReturnType<AktivitetspengerApi['getKontrollerInntekt']>>;
  simuleringResultat?: Awaited<ReturnType<AktivitetspengerApi['getSimuleringResultat']>>;
};

const createApi = (overrides?: ApiOverrides): AktivitetspengerApi =>
  Object.assign(new FakeAktivitetspengerApi(), {
    getVilkår: async () => overrides?.vilkår ?? [],
    getAksjonspunkter: async () => overrides?.aksjonspunkter ?? [],
    getInnloggetBruker: async () => overrides?.innloggetBruker ?? {},
    getBeregningsgrunnlag: async () => overrides?.beregningsgrunnlag ?? null,
    getSatsOgUtbetalingPerioder: async () => overrides?.satsOgUtbetalingPerioder ?? [],
    getKontrollerInntekt: async () => overrides?.kontrollerInntekt ?? { kontrollperioder: [] },
    getSimuleringResultat: async () => overrides?.simuleringResultat ?? null,
  });

const createApiWithUnresolvedQueries = (): AktivitetspengerApi =>
  Object.assign(createApi(), {
    getVilkår: () => new Promise<Awaited<ReturnType<AktivitetspengerApi['getVilkår']>>>(() => {}),
    getAksjonspunkter: () => new Promise<Awaited<ReturnType<AktivitetspengerApi['getAksjonspunkter']>>>(() => {}),
  });

const createVilkår = (vilkarStatus: Utfall, type: ung_kodeverk_vilkår_VilkårType) => ({
  vilkarType: type,
  perioder: [{ vilkarStatus, vurderesIBehandlingen: true, periode: { fom: '2024-01-01', tom: '2024-01-31' } }],
});

const createBehandling = (overrides = {}) => ({
  uuid: 'behandling-uuid',
  versjon: 1,
  type: BehandlingType.FØRSTEGANGSSØKNAD,
  behandlingÅrsaker: [],
  behandlingsresultat: { type: BehandlingResultatType.INNVILGET },
  status: BehandlingStatus.OPPRETTET,
  ...overrides,
});

const beregningsgrunnlagMedData = { beregningsgrunnlag: 100000 } as Awaited<
  ReturnType<AktivitetspengerApi['getBeregningsgrunnlag']>
>;
const simuleringMedData = { simuleringResultat: {} } as SimuleringDto;

describe('Prossesmotor', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  test('returnerer seks paneler i forventet rekkefølge', async () => {
    const api = createApi();
    const behandling = createBehandling();

    const { result } = renderHook(() => useProsessmotor({ api, behandling }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.prosessteg).toHaveLength(6);
      expect(result.current.prosessteg.map(panel => panel.label)).toEqual([
        'Inngangsvilkår',
        'Medlemskap',
        'Beregning',
        'Beregnet utbetaling',
        'Simulering',
        'Vedtak',
      ]);
    });
  });

  test('returnerer steg uten status mens vilkår og aksjonspunkter lastes', () => {
    const api = createApiWithUnresolvedQueries();
    const { result } = renderHook(() => useProsessmotor({ api, behandling: createBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    expect(result.current.erKlar).toBe(false);
    expect(result.current.prosessteg).toHaveLength(6);
    expect(result.current.prosessteg.map(steg => steg.id)).toEqual([
      prosessStegCodes.INNGANGSVILKAR,
      prosessStegCodes.FORUTGAENDE_MEDLEMSKAP,
      prosessStegCodes.BEREGNING,
      prosessStegCodes.KONTROLL_AV_INNTEKT,
      prosessStegCodes.SIMULERING,
      prosessStegCodes.VEDTAK,
    ]);
    expect(result.current.prosessteg.every(steg => steg.type === ProcessMenuStepType.default)).toBe(true);
    expect(result.current.prosessteg.every(steg => steg.locked !== true)).toBe(true);
  });

  test('er klar når vilkår og aksjonspunkter er lastet', async () => {
    const api = createApi();
    const { result } = renderHook(() => useProsessmotor({ api, behandling: createBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.erKlar).toBe(true);
    });
  });

  test('setter inngangsvilkår til warning når det finnes åpent aksjonspunkt', async () => {
    const api = createApi({
      aksjonspunkter: [
        {
          definisjon: AksjonspunktDefinisjon.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST,
          status: aksjonspunktStatus.OPPRETTET,
          kanLoses: true,
        },
      ],
    });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.prosessteg[0].type).toBe(ProcessMenuStepType.warning);
      expect(result.current.prosessteg[1].type).toBe(ProcessMenuStepType.default);
      expect(result.current.prosessteg[2].type).toBe(ProcessMenuStepType.default);
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
      expect(result.current.prosessteg[0].type).toBe(ProcessMenuStepType.danger);
      expect(result.current.prosessteg[1].type).toBe(ProcessMenuStepType.default);
    });
  });

  test('setter inngangsvilkår til default når et relevant vilkår ikke er vurdert', async () => {
    const api = createApi({
      vilkår: [createVilkår(Utfall.IKKE_VURDERT, ung_kodeverk_vilkår_VilkårType.SØKNADSFRIST)],
    });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.prosessteg[0].type).toBe(ProcessMenuStepType.default);
    });
  });

  test('setter inngangsvilkår til danger foran ikke vurdert vilkår', async () => {
    const api = createApi({
      vilkår: [
        createVilkår(Utfall.IKKE_VURDERT, ung_kodeverk_vilkår_VilkårType.SØKNADSFRIST),
        createVilkår(Utfall.IKKE_OPPFYLT, ung_kodeverk_vilkår_VilkårType.BOSTEDSVILKÅR),
      ],
    });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.prosessteg[0].type).toBe(ProcessMenuStepType.danger);
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
      expect(result.current.prosessteg[0].type).toBe(ProcessMenuStepType.success);
      expect(result.current.prosessteg[0].locked).toBe(true);
    });
  });

  test('setter vedtak til warning når vedtak-aksjonspunkt er åpent og øvrige vilkår er vurdert', async () => {
    const api = createApi({
      vilkår: [createVilkår(Utfall.OPPFYLT, ung_kodeverk_vilkår_VilkårType.SØKNADSFRIST)],
      aksjonspunkter: [
        {
          definisjon: AksjonspunktDefinisjon.FORESLÅ_VEDTAK,
          status: aksjonspunktStatus.OPPRETTET,
          kanLoses: true,
        },
      ],
    });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.prosessteg[5].type).toBe(ProcessMenuStepType.warning);
    });
  });

  test('setter vedtak til success når FATTER_VEDTAK er åpent uten kanLoses og resultat er innvilget', async () => {
    const api = createApi({
      vilkår: [createVilkår(Utfall.OPPFYLT, ung_kodeverk_vilkår_VilkårType.SØKNADSFRIST)],
      aksjonspunkter: [
        {
          definisjon: AksjonspunktDefinisjon.FATTER_VEDTAK,
          status: aksjonspunktStatus.OPPRETTET,
          kanLoses: false,
        },
      ],
    });

    const { result } = renderHook(
      () =>
        useProsessmotor({
          api,
          behandling: createBehandling({
            status: BehandlingStatus.FATTER_VEDTAK,
            behandlingsresultat: { type: BehandlingResultatType.INNVILGET },
          }),
        }),
      {
        wrapper: createWrapper(queryClient),
      },
    );

    await waitFor(() => {
      expect(result.current.prosessteg[5].type).toBe(ProcessMenuStepType.success);
    });
  });

  test('setter beregnet utbetaling til warning når panelet har åpent aksjonspunkt', async () => {
    const api = createApi({
      vilkår: [
        createVilkår(Utfall.OPPFYLT, ung_kodeverk_vilkår_VilkårType.SØKNADSFRIST),
        createVilkår(Utfall.OPPFYLT, ung_kodeverk_vilkår_VilkårType.FORUTGÅENDE_MEDLEMSKAPSVILKÅRET),
      ],
      aksjonspunkter: [
        {
          definisjon: AksjonspunktDefinisjon.KONTROLLER_INNTEKT,
          status: aksjonspunktStatus.OPPRETTET,
          kanLoses: true,
        },
      ],
    });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.prosessteg[2].type).toBe(ProcessMenuStepType.default);
      expect(result.current.prosessteg[3].type).toBe(ProcessMenuStepType.warning);
    });
  });

  test('setter beregning til success med data når tidligere paneler er oppfylt', async () => {
    const api = createApi({
      vilkår: [
        createVilkår(Utfall.OPPFYLT, ung_kodeverk_vilkår_VilkårType.SØKNADSFRIST),
        createVilkår(Utfall.OPPFYLT, ung_kodeverk_vilkår_VilkårType.FORUTGÅENDE_MEDLEMSKAPSVILKÅRET),
      ],
      beregningsgrunnlag: beregningsgrunnlagMedData,
    });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.prosessteg[2].type).toBe(ProcessMenuStepType.success);
    });
  });

  test('setter beregning til default når beregningsgrunnlag mangler', async () => {
    const api = createApi({ beregningsgrunnlag: null });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.prosessteg[2].type).toBe(ProcessMenuStepType.default);
    });
  });

  test('setter beregning til default når henting av beregningsgrunnlag feiler', async () => {
    const api = Object.assign(createApi(), {
      getBeregningsgrunnlag: async () => {
        throw new Error('Feil ved henting av beregningsgrunnlag');
      },
    });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.prosessteg[2].type).toBe(ProcessMenuStepType.default);
    });
  });

  test('setter beregning til default når inngangsvilkår ikke er vurdert selv med data', async () => {
    const api = createApi({
      aksjonspunkter: [
        {
          definisjon: AksjonspunktDefinisjon.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST,
          status: aksjonspunktStatus.OPPRETTET,
          kanLoses: true,
        },
      ],
      beregningsgrunnlag: beregningsgrunnlagMedData,
    });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.prosessteg[0].type).toBe(ProcessMenuStepType.warning);
      expect(result.current.prosessteg[1].type).toBe(ProcessMenuStepType.default);
      expect(result.current.prosessteg[2].type).toBe(ProcessMenuStepType.default);
    });
  });

  test('setter beregnet utbetaling til success når satser har data og tidligere paneler er oppfylt', async () => {
    const api = createApi({
      vilkår: [
        createVilkår(Utfall.OPPFYLT, ung_kodeverk_vilkår_VilkårType.SØKNADSFRIST),
        createVilkår(Utfall.OPPFYLT, ung_kodeverk_vilkår_VilkårType.FORUTGÅENDE_MEDLEMSKAPSVILKÅRET),
      ],
      beregningsgrunnlag: beregningsgrunnlagMedData,
      satsOgUtbetalingPerioder: [{} as Awaited<ReturnType<AktivitetspengerApi['getSatsOgUtbetalingPerioder']>>[number]],
    });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.prosessteg[3].type).toBe(ProcessMenuStepType.success);
    });
  });

  test('setter beregnet utbetaling til success når kontrollperioder har data og tidligere paneler er oppfylt', async () => {
    const api = createApi({
      vilkår: [
        createVilkår(Utfall.OPPFYLT, ung_kodeverk_vilkår_VilkårType.SØKNADSFRIST),
        createVilkår(Utfall.OPPFYLT, ung_kodeverk_vilkår_VilkårType.FORUTGÅENDE_MEDLEMSKAPSVILKÅRET),
      ],
      beregningsgrunnlag: beregningsgrunnlagMedData,
      kontrollerInntekt: { kontrollperioder: [{}] } as Awaited<ReturnType<AktivitetspengerApi['getKontrollerInntekt']>>,
    });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.prosessteg[3].type).toBe(ProcessMenuStepType.success);
    });
  });

  test('setter beregnet utbetaling til default når satser og kontrollperioder mangler', async () => {
    const api = createApi();

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.prosessteg[3].type).toBe(ProcessMenuStepType.default);
    });
  });

  test('setter beregnet utbetaling til default når inntektskontroll feiler og satser mangler', async () => {
    const api = Object.assign(createApi(), {
      getKontrollerInntekt: async () => {
        throw new Error('Feil ved henting av inntektskontroll');
      },
    });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.prosessteg[3].type).toBe(ProcessMenuStepType.default);
    });
  });

  test('stans etter åpent aksjonspunkt i inngangsvilkår stanser medlemskap', async () => {
    const api = createApi({
      vilkår: [createVilkår(Utfall.OPPFYLT, ung_kodeverk_vilkår_VilkårType.FORUTGÅENDE_MEDLEMSKAPSVILKÅRET)],
      aksjonspunkter: [
        {
          definisjon: AksjonspunktDefinisjon.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST,
          status: aksjonspunktStatus.OPPRETTET,
          kanLoses: true,
        },
      ],
    });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.prosessteg[0].type).toBe(ProcessMenuStepType.warning);
      expect(result.current.prosessteg[1].type).toBe(ProcessMenuStepType.default);
    });
  });

  test('setter inngangsvilkår til danger når ett av flere vilkår er avslått', async () => {
    const api = createApi({
      vilkår: [
        createVilkår(Utfall.OPPFYLT, ung_kodeverk_vilkår_VilkårType.SØKNADSFRIST),
        createVilkår(Utfall.IKKE_OPPFYLT, ung_kodeverk_vilkår_VilkårType.BISTANDSVILKÅR),
      ],
    });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.prosessteg[0].type).toBe(ProcessMenuStepType.danger);
    });
  });

  test('setter usePartialStatus når et inngangsvilkår har blandede perioder', async () => {
    const bistandsvilkår = {
      vilkarType: ung_kodeverk_vilkår_VilkårType.BISTANDSVILKÅR,
      perioder: [
        {
          vilkarStatus: Utfall.OPPFYLT,
          vurderesIBehandlingen: true,
          periode: { fom: '2024-01-01', tom: '2024-01-31' },
        },
        {
          vilkarStatus: Utfall.IKKE_OPPFYLT,
          vurderesIBehandlingen: true,
          periode: { fom: '2024-02-01', tom: '2024-02-29' },
        },
      ],
    };
    const api = createApi({
      vilkår: [
        createVilkår(Utfall.OPPFYLT, ung_kodeverk_vilkår_VilkårType.SØKNADSFRIST),
        bistandsvilkår,
        createVilkår(Utfall.OPPFYLT, ung_kodeverk_vilkår_VilkårType.BOSTEDSVILKÅR),
      ],
    });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.prosessteg[0].type).toBe(ProcessMenuStepType.success);
      expect(result.current.prosessteg[0].usePartialStatus).toBe(true);
    });
  });

  test('ignorerer perioder som ikke vurderes i behandlingen', async () => {
    const søknadsfrist = {
      vilkarType: ung_kodeverk_vilkår_VilkårType.SØKNADSFRIST,
      perioder: [
        {
          vilkarStatus: Utfall.OPPFYLT,
          vurderesIBehandlingen: true,
          periode: { fom: '2024-01-01', tom: '2024-01-31' },
        },
        {
          vilkarStatus: Utfall.IKKE_OPPFYLT,
          vurderesIBehandlingen: false,
          periode: { fom: '2024-02-01', tom: '2024-02-29' },
        },
      ],
    };
    const api = createApi({ vilkår: [søknadsfrist] });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.prosessteg[0].type).toBe(ProcessMenuStepType.success);
      expect(result.current.prosessteg[0].usePartialStatus).toBe(false);
    });
  });

  test('bruker utfall fra tidligere behandling når ingen perioder vurderes i behandlingen', async () => {
    const tidligereVurdert = (vilkarType: ung_kodeverk_vilkår_VilkårType) => ({
      vilkarType,
      perioder: [
        {
          vilkarStatus: Utfall.OPPFYLT,
          vurderesIBehandlingen: false,
          periode: { fom: '2026-07-01', tom: '2027-06-29' },
        },
      ],
    });
    const api = createApi({
      vilkår: [
        tidligereVurdert(ung_kodeverk_vilkår_VilkårType.SØKNADSFRIST),
        tidligereVurdert(ung_kodeverk_vilkår_VilkårType.BISTANDSVILKÅR),
        tidligereVurdert(ung_kodeverk_vilkår_VilkårType.FORUTGÅENDE_MEDLEMSKAPSVILKÅRET),
      ],
      beregningsgrunnlag: beregningsgrunnlagMedData,
    });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.prosessteg[0].type).toBe(ProcessMenuStepType.success);
      // Medlemskap vurderes ikke i behandlingen, men skal ikke stoppe senere steg
      expect(result.current.prosessteg[1].type).toBe(ProcessMenuStepType.default);
      expect(result.current.prosessteg[2].type).toBe(ProcessMenuStepType.success);
    });
  });

  test('søknadsfrist-unntaket lar medlemskap fortsette når øvrige inngangsvilkår er oppfylt', async () => {
    const api = createApi({
      vilkår: [
        createVilkår(Utfall.IKKE_OPPFYLT, ung_kodeverk_vilkår_VilkårType.SØKNADSFRIST),
        createVilkår(Utfall.OPPFYLT, ung_kodeverk_vilkår_VilkårType.BISTANDSVILKÅR),
        createVilkår(Utfall.OPPFYLT, ung_kodeverk_vilkår_VilkårType.FORUTGÅENDE_MEDLEMSKAPSVILKÅRET),
      ],
    });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.prosessteg[0].type).toBe(ProcessMenuStepType.danger);
      expect(result.current.prosessteg[1].type).toBe(ProcessMenuStepType.success);
    });
  });

  test('stopp etter avslag gjør medlemskap, beregning og utbetaling grå selv med data', async () => {
    const api = createApi({
      vilkår: [
        createVilkår(Utfall.IKKE_OPPFYLT, ung_kodeverk_vilkår_VilkårType.BISTANDSVILKÅR),
        createVilkår(Utfall.OPPFYLT, ung_kodeverk_vilkår_VilkårType.FORUTGÅENDE_MEDLEMSKAPSVILKÅRET),
      ],
      beregningsgrunnlag: beregningsgrunnlagMedData,
      satsOgUtbetalingPerioder: [{} as Awaited<ReturnType<AktivitetspengerApi['getSatsOgUtbetalingPerioder']>>[number]],
    });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.prosessteg[0].type).toBe(ProcessMenuStepType.danger);
      expect(result.current.prosessteg[1].type).toBe(ProcessMenuStepType.default);
      expect(result.current.prosessteg[2].type).toBe(ProcessMenuStepType.default);
      expect(result.current.prosessteg[3].type).toBe(ProcessMenuStepType.default);
    });
  });

  test('stanset panel med åpent aksjonspunkt vises fortsatt som warning', async () => {
    const api = createApi({
      vilkår: [createVilkår(Utfall.IKKE_OPPFYLT, ung_kodeverk_vilkår_VilkårType.BISTANDSVILKÅR)],
      aksjonspunkter: [
        {
          definisjon: AksjonspunktDefinisjon.AVKLAR_GYLDIG_MEDLEMSKAP,
          status: aksjonspunktStatus.OPPRETTET,
          kanLoses: true,
        },
      ],
    });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.prosessteg[1].type).toBe(ProcessMenuStepType.warning);
    });
  });

  test('åpent aksjonspunkt uten kanLoses gir ikke warning', async () => {
    const api = createApi({
      aksjonspunkter: [
        {
          definisjon: AksjonspunktDefinisjon.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST,
          status: aksjonspunktStatus.OPPRETTET,
          kanLoses: false,
        },
      ],
    });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.prosessteg[0].type).toBe(ProcessMenuStepType.default);
    });
  });

  test('simulering og vedtak påvirkes ikke av stopp etter avslag', async () => {
    const api = createApi({
      vilkår: [createVilkår(Utfall.IKKE_OPPFYLT, ung_kodeverk_vilkår_VilkårType.BISTANDSVILKÅR)],
      simuleringResultat: simuleringMedData,
    });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.prosessteg[0].type).toBe(ProcessMenuStepType.danger);
      expect(result.current.prosessteg[1].type).toBe(ProcessMenuStepType.default);
      expect(result.current.prosessteg[4].type).toBe(ProcessMenuStepType.success);
      expect(result.current.prosessteg[5].type).toBe(ProcessMenuStepType.success);
    });
  });

  test('vedtak blir danger når behandlingsresultatet er avslag', async () => {
    const api = createApi({ vilkår: [createVilkår(Utfall.OPPFYLT, ung_kodeverk_vilkår_VilkårType.SØKNADSFRIST)] });
    const behandling = createBehandling({ behandlingsresultat: { type: BehandlingResultatType.AVSLÅTT } });

    const { result } = renderHook(() => useProsessmotor({ api, behandling }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.prosessteg[5].type).toBe(ProcessMenuStepType.danger);
    });
  });

  test('viser opphør som default når det ikke finnes relevante aksjonspunkter', async () => {
    const api = createApi();
    const behandling = createBehandling({
      type: BehandlingType.REVURDERING,
      behandlingÅrsaker: [{ behandlingArsakType: BehandlingÅrsakType.ENDRET_BOSTED }],
    });

    const { result } = renderHook(() => useProsessmotor({ api, behandling }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.prosessteg[0].type).toBe(ProcessMenuStepType.default);
    });
  });

  test('viser opphør som success når et relevant aksjonspunkt er utført', async () => {
    const api = createApi({
      aksjonspunkter: [
        {
          definisjon: AksjonspunktDefinisjon.VURDER_BOSTEDSVILKÅR_OPPHØR,
          status: aksjonspunktStatus.UTFØRT,
        },
        {
          definisjon: AksjonspunktDefinisjon.VURDER_FAKTA_OM_BOSTED,
          status: aksjonspunktStatus.AVBRUTT,
        },
      ],
    });
    const behandling = createBehandling({
      type: BehandlingType.REVURDERING,
      behandlingÅrsaker: [{ behandlingArsakType: BehandlingÅrsakType.ENDRET_BOSTED }],
    });

    const { result } = renderHook(() => useProsessmotor({ api, behandling }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.prosessteg[0].type).toBe(ProcessMenuStepType.success);
    });
  });

  test('er ikke klar mens henting av beregningsgrunnlag pågår', async () => {
    const api = Object.assign(createApi(), {
      getBeregningsgrunnlag: () =>
        new Promise<Awaited<ReturnType<AktivitetspengerApi['getBeregningsgrunnlag']>>>(() => {}),
    });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    const queryState = (key: string) =>
      queryClient
        .getQueryCache()
        .getAll()
        .find(query => query.queryKey[0] === key)?.state;

    await waitFor(() => {
      expect(queryState('vilkar')?.data).toBeDefined();
      expect(queryState('aksjonspunkter')?.data).toBeDefined();
      expect(queryState('innlogget-bruker')?.data).toBeDefined();
      expect(queryState('aktivitetspenger-beregningsgrunnlag')?.fetchStatus).toBe('fetching');
      expect(queryState('satsOgUtbetalingPerioder')?.fetchStatus).toBe('idle');
      expect(queryState('aktivitetspenger-kontrollInntekt')?.fetchStatus).toBe('idle');
      expect(queryState('simuleringResultat')?.fetchStatus).toBe('idle');
    });
    expect(result.current.erKlar).toBe(false);
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
      expect(result.current.prosessteg[5].type).toBe(ProcessMenuStepType.default);
    });
  });

  test('setter simulering til warning og vedtak til default når VURDER_FEILUTBETALING er åpent', async () => {
    const api = createApi({
      vilkår: [createVilkår(Utfall.OPPFYLT, ung_kodeverk_vilkår_VilkårType.SØKNADSFRIST)],
      aksjonspunkter: [
        {
          definisjon: AksjonspunktDefinisjon.VURDER_FEILUTBETALING,
          status: aksjonspunktStatus.OPPRETTET,
          kanLoses: true,
        },
      ],
      simuleringResultat: simuleringMedData,
    });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.prosessteg[4].type).toBe(ProcessMenuStepType.warning);
      expect(result.current.prosessteg[5].type).toBe(ProcessMenuStepType.default);
    });
  });

  test('setter simulering til success når simuleringsresultat finnes og ingen aksjonspunkt er åpent', async () => {
    const api = createApi({ simuleringResultat: simuleringMedData });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.prosessteg[4].type).toBe(ProcessMenuStepType.success);
    });
  });

  test('setter simulering til default når simuleringsresultat mangler', async () => {
    const api = createApi();

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.prosessteg[4].type).toBe(ProcessMenuStepType.default);
    });
  });

  test('ikke-relevant vilkår gir verken avslag eller stopper senere steg', async () => {
    const api = createApi({
      vilkår: [
        createVilkår(Utfall.IKKE_RELEVANT, ung_kodeverk_vilkår_VilkårType.BISTANDSVILKÅR),
        createVilkår(Utfall.OPPFYLT, ung_kodeverk_vilkår_VilkårType.SØKNADSFRIST),
        createVilkår(Utfall.OPPFYLT, ung_kodeverk_vilkår_VilkårType.FORUTGÅENDE_MEDLEMSKAPSVILKÅRET),
      ],
      beregningsgrunnlag: beregningsgrunnlagMedData,
    });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.prosessteg[0].type).toBe(ProcessMenuStepType.success);
      expect(result.current.prosessteg[1].type).toBe(ProcessMenuStepType.success);
      expect(result.current.prosessteg[2].type).toBe(ProcessMenuStepType.success);
    });
  });

  test('ignorerer ikke-relevante perioder når øvrige perioder er oppfylt', async () => {
    const bistand = {
      vilkarType: ung_kodeverk_vilkår_VilkårType.BISTANDSVILKÅR,
      perioder: [
        {
          vilkarStatus: Utfall.IKKE_RELEVANT,
          vurderesIBehandlingen: true,
          periode: { fom: '2024-01-01', tom: '2024-01-31' },
        },
        {
          vilkarStatus: Utfall.OPPFYLT,
          vurderesIBehandlingen: true,
          periode: { fom: '2024-02-01', tom: '2024-02-29' },
        },
      ],
    };
    const api = createApi({ vilkår: [bistand] });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.prosessteg[0].type).toBe(ProcessMenuStepType.success);
      expect(result.current.prosessteg[0].usePartialStatus).toBe(false);
    });
  });

  test('medlemskap med bare ikke-relevante perioder er grått uten å stoppe senere steg', async () => {
    const api = createApi({
      vilkår: [
        createVilkår(Utfall.OPPFYLT, ung_kodeverk_vilkår_VilkårType.SØKNADSFRIST),
        createVilkår(Utfall.IKKE_RELEVANT, ung_kodeverk_vilkår_VilkårType.FORUTGÅENDE_MEDLEMSKAPSVILKÅRET),
      ],
      beregningsgrunnlag: beregningsgrunnlagMedData,
    });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.prosessteg[0].type).toBe(ProcessMenuStepType.success);
      expect(result.current.prosessteg[1].type).toBe(ProcessMenuStepType.default);
      expect(result.current.prosessteg[2].type).toBe(ProcessMenuStepType.success);
    });
  });

  test('tolker tomme svar fra SDK-klienten som manglende data', async () => {
    const api = createApi({
      beregningsgrunnlag: {} as Awaited<ReturnType<AktivitetspengerApi['getBeregningsgrunnlag']>>,
      simuleringResultat: new ReadableStream() as unknown as SimuleringDto,
    });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.erKlar).toBe(true);
    });
    expect(result.current.prosessteg[2].type).toBe(ProcessMenuStepType.default);
    expect(result.current.prosessteg[4].type).toBe(ProcessMenuStepType.default);
  });

  test('viser opphørspanel som første panel ved revurdering med endret bosted', async () => {
    const api = createApi();

    const { result } = renderHook(
      () =>
        useProsessmotor({
          api,
          behandling: createBehandling({
            type: BehandlingType.REVURDERING,
            behandlingÅrsaker: [{ behandlingArsakType: BehandlingÅrsakType.ENDRET_BOSTED }],
          }),
        }),
      {
        wrapper: createWrapper(queryClient),
      },
    );

    await waitFor(() => {
      expect(result.current.prosessteg[0].label).toBe('Opphør');
    });
  });

  test('viser opphør som første steg mens opphørsbehandling lastes', () => {
    const api = createApiWithUnresolvedQueries();
    const { result } = renderHook(
      () =>
        useProsessmotor({
          api,
          behandling: createBehandling({
            type: BehandlingType.REVURDERING,
            behandlingÅrsaker: [{ behandlingArsakType: BehandlingÅrsakType.ENDRET_BOSTED }],
          }),
        }),
      {
        wrapper: createWrapper(queryClient),
      },
    );

    expect(result.current.prosessteg[0].id).toBe(prosessStegCodes.OPPHØR);
  });

  test('setter opphørspanel til warning når VURDER_BOSTEDSVILKÅR_OPPHØR er åpent', async () => {
    const api = createApi({
      aksjonspunkter: [
        {
          definisjon: AksjonspunktDefinisjon.VURDER_BOSTEDSVILKÅR_OPPHØR,
          status: aksjonspunktStatus.OPPRETTET,
          kanLoses: true,
        },
      ],
    });

    const { result } = renderHook(
      () =>
        useProsessmotor({
          api,
          behandling: createBehandling({
            type: BehandlingType.REVURDERING,
            behandlingÅrsaker: [{ behandlingArsakType: BehandlingÅrsakType.ENDRET_BOSTED }],
          }),
        }),
      {
        wrapper: createWrapper(queryClient),
      },
    );

    await waitFor(() => {
      expect(result.current.prosessteg[0].label).toBe('Opphør');
      expect(result.current.prosessteg[0].type).toBe(ProcessMenuStepType.warning);
    });
  });

  test('viser inngangsvilkårpanel ved revurdering uten endret bosted-årsak', async () => {
    const api = createApi();

    const { result } = renderHook(
      () =>
        useProsessmotor({
          api,
          behandling: createBehandling({
            type: BehandlingType.REVURDERING,
            behandlingÅrsaker: [{ behandlingArsakType: BehandlingÅrsakType.RE_ANNET }],
          }),
        }),
      {
        wrapper: createWrapper(queryClient),
      },
    );

    await waitFor(() => {
      expect(result.current.prosessteg[0].label).toBe('Inngangsvilkår');
    });
  });
});
