import { aksjonspunktStatus, AksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { vilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import { vilkarType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import { FakeK9SakProsessApi } from '@k9-sak-web/gui/storybook/mocks/FakeK9SakProsessApi.js';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, test } from 'vitest';
import {
  beregnSimuleringType,
  beregnTilkjentYtelseType,
  beregnUttakType,
  beregnVedtakType,
  useProsessmotor,
} from './Prosessmotor';
import { createQueryClient } from '@k9-sak-web/gui/shared/query/queryClient.js';

const createWrapper =
  (queryClient: QueryClient) =>
  ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);

const createMockBehandling = (overrides = {}) => ({
  id: 1,
  versjon: 1,
  uuid: '12345',
  behandlingsresultat: { type: { kode: 'INNVILGET', kodeverk: '' } },
  ...overrides,
});

const lagAksjonspunkt = (
  definisjon: AksjonspunktDefinisjon,
  status: AksjonspunktStatus = aksjonspunktStatus.OPPRETTET,
) => ({ definisjon, status });

describe('useProsessmotor', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createQueryClient({
      queries: { retry: false },
    });
  });

  test('returnerer alle 8 paneler med korrekte id-er', async () => {
    const api = new FakeK9SakProsessApi();

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createMockBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current).toHaveLength(8);
      expect(result.current[0].id).toBe('inngangsvilkar');
      expect(result.current[7].id).toBe('vedtak');
    });
  });

  test('setter inngangsvilkår til success når alle vilkår er oppfylt', async () => {
    const api = new FakeK9SakProsessApi({
      vilkår: [
        {
          vilkarType: vilkarType.SØKNADSFRIST,
          perioder: [
            { vilkarStatus: vilkårStatus.OPPFYLT, periode: { fom: '', tom: '' }, vurderesIBehandlingen: true },
          ],
          relevanteInnvilgetMerknader: [],
        },
        {
          vilkarType: vilkarType.ALDERSVILKÅR,
          perioder: [
            { vilkarStatus: vilkårStatus.OPPFYLT, periode: { fom: '', tom: '' }, vurderesIBehandlingen: true },
          ],
          relevanteInnvilgetMerknader: [],
        },
        {
          vilkarType: vilkarType.OMSORGEN_FOR,
          perioder: [
            { vilkarStatus: vilkårStatus.OPPFYLT, periode: { fom: '', tom: '' }, vurderesIBehandlingen: true },
          ],
          relevanteInnvilgetMerknader: [],
        },
      ],
    });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createMockBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current[0].type).toBe(ProcessMenuStepType.success);
      expect(result.current[0]).toHaveProperty('erVurdert', true);
    });
  });

  test('setter panel til warning når det finnes åpent aksjonspunkt', async () => {
    const api = new FakeK9SakProsessApi({
      vilkår: [
        {
          vilkarType: vilkarType.SØKNADSFRIST,
          perioder: [{ vilkarStatus: vilkårStatus.OPPFYLT, periode: { fom: '', tom: '' } }],
          relevanteInnvilgetMerknader: [],
        },
      ],
      aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST)],
    });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createMockBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current[0].type).toBe(ProcessMenuStepType.warning);
    });
  });

  test('setter aldri usePartialStatus=true når panel er warning, selv med delvis oppfylt vilkår', async () => {
    const api = new FakeK9SakProsessApi({
      vilkår: [
        {
          vilkarType: vilkarType.SØKNADSFRIST,
          perioder: [
            { vilkarStatus: vilkårStatus.OPPFYLT, periode: { fom: '', tom: '' }, vurderesIBehandlingen: true },
            { vilkarStatus: vilkårStatus.IKKE_OPPFYLT, periode: { fom: '', tom: '' }, vurderesIBehandlingen: true },
          ],
          relevanteInnvilgetMerknader: [],
        },
      ],
      aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST)],
    });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createMockBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current[0].type).toBe(ProcessMenuStepType.warning);
      expect(result.current[0].usePartialStatus).toBe(false);
    });
  });

  test('tilkjentYtelse er default og simulering er success når uttak er danger og simuleringData finnes', async () => {
    const api = new FakeK9SakProsessApi({
      uttak: {
        uttaksplan: {
          perioder: {
            '2024-01-01/2024-01-31': { utfall: vilkårStatus.IKKE_OPPFYLT },
            '2024-02-01/2024-02-28': { utfall: vilkårStatus.IKKE_OPPFYLT },
          },
        },
        simulertUttaksplan: {},
      },
      simuleringResultat: {
        simuleringResultat: { periode: { fom: '', tom: '' } },
        simuleringResultatUtenInntrekk: { periode: { fom: '', tom: '' } },
        slåttAvInntrekk: false,
      },
    });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createMockBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current[4].id).toBe('uttak');
      expect(result.current[4].type).toBe(ProcessMenuStepType.danger);
      // tilkjentYtelse er default fordi uttak er danger (forrigeVurdert=false)
      expect(result.current[5].id).toBe('tilkjent_ytelse');
      expect(result.current[5].type).toBe(ProcessMenuStepType.default);
      expect(result.current[5]).toHaveProperty('erVurdert', false);
      // simulering vises som success fordi uttakErAvslått=true og simuleringResultat er truthy
      expect(result.current[6].id).toBe('simulering');
      expect(result.current[6].type).toBe(ProcessMenuStepType.success);
    });
  });

  test('setter simulering til warning når uttak er avslått og simulering har åpent aksjonspunkt', async () => {
    const api = new FakeK9SakProsessApi({
      uttak: {
        uttaksplan: {
          perioder: {
            '2024-01-01/2024-01-31': { utfall: vilkårStatus.IKKE_OPPFYLT },
          },
        },
        simulertUttaksplan: {},
      },
      aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_FEILUTBETALING)],
    });

    const { result } = renderHook(() => useProsessmotor({ api, behandling: createMockBehandling() }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current[4].type).toBe(ProcessMenuStepType.danger);
      expect(result.current[6].type).toBe(ProcessMenuStepType.warning);
    });
  });
});

describe('beregnUttakType', () => {
  test('returnerer warning når det finnes et åpent uttak-aksjonspunkt', () => {
    const result = beregnUttakType([lagAksjonspunkt(AksjonspunktDefinisjon.VENT_ANNEN_PSB_SAK)], null, [
      AksjonspunktDefinisjon.VENT_ANNEN_PSB_SAK,
    ]);
    expect(result).toBe(ProcessMenuStepType.warning);
  });

  test('returnerer success over warning når aksjonspunkt er lukket', () => {
    const result = beregnUttakType(
      [lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_DATO_NY_REGEL_UTTAK, aksjonspunktStatus.UTFØRT)],
      {
        uttaksplan: { perioder: { '2024-01-01/2024-01-31': { utfall: vilkårStatus.OPPFYLT } } },
        simulertUttaksplan: {},
      },
      [AksjonspunktDefinisjon.VURDER_DATO_NY_REGEL_UTTAK],
    );
    expect(result).toBe(ProcessMenuStepType.success);
  });

  test('returnerer default når uttak er null', () => {
    expect(beregnUttakType([], null, [])).toBe(ProcessMenuStepType.default);
  });

  test('returnerer default når uttaksplan er undefined', () => {
    expect(beregnUttakType([], {} as any, [])).toBe(ProcessMenuStepType.default);
  });

  test('returnerer default når uttaksplan ikke har perioder', () => {
    expect(beregnUttakType([], { uttaksplan: { perioder: {} } } as any, [])).toBe(ProcessMenuStepType.default);
  });

  test('returnerer danger når alle perioder er avslått', () => {
    const uttak = {
      uttaksplan: {
        perioder: {
          '2024-01-01/2024-01-31': { utfall: vilkårStatus.IKKE_OPPFYLT },
          '2024-02-01/2024-02-28': { utfall: vilkårStatus.IKKE_OPPFYLT },
        },
      },
    } as any;
    expect(beregnUttakType([], uttak, [])).toBe(ProcessMenuStepType.danger);
  });

  test('returnerer success når minst én periode er innvilget', () => {
    const uttak = {
      uttaksplan: {
        perioder: {
          '2024-01-01/2024-01-31': { utfall: vilkårStatus.OPPFYLT },
          '2024-02-01/2024-02-28': { utfall: vilkårStatus.IKKE_OPPFYLT },
        },
      },
    } as any;
    expect(beregnUttakType([], uttak, [])).toBe(ProcessMenuStepType.success);
  });
});

describe('beregnSimuleringType', () => {
  const simuleringAksjonspunkter = [
    AksjonspunktDefinisjon.VURDER_FEILUTBETALING,
    AksjonspunktDefinisjon.SJEKK_HØY_ETTERBETALING,
  ];

  const simuleringResultat = {
    simuleringResultat: { periode: { fom: '', tom: '' } },
    simuleringResultatUtenInntrekk: { periode: { fom: '', tom: '' } },
    slåttAvInntrekk: false,
  };

  test('returnerer warning når det finnes et åpent aksjonspunkt', () => {
    const result = beregnSimuleringType(
      [lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_FEILUTBETALING)],
      null,
      simuleringAksjonspunkter,
    );
    expect(result).toBe(ProcessMenuStepType.warning);
  });

  test('returnerer warning selv når simuleringResultat finnes og aksjonspunkt er åpent', () => {
    const result = beregnSimuleringType(
      [lagAksjonspunkt(AksjonspunktDefinisjon.SJEKK_HØY_ETTERBETALING)],
      simuleringResultat,
      simuleringAksjonspunkter,
    );
    expect(result).toBe(ProcessMenuStepType.warning);
  });

  test('ignorerer avsluttede aksjonspunkter', () => {
    const result = beregnSimuleringType(
      [lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_FEILUTBETALING, aksjonspunktStatus.AVBRUTT)],
      null,
      simuleringAksjonspunkter,
    );
    expect(result).toBe(ProcessMenuStepType.default);
  });

  test('returnerer success når simuleringResultat finnes og ingen åpne aksjonspunkter', () => {
    expect(beregnSimuleringType([], simuleringResultat, simuleringAksjonspunkter)).toBe(ProcessMenuStepType.success);
  });

  test('returnerer success når aksjonspunkt er lukket', () => {
    const result = beregnSimuleringType(
      [lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_FEILUTBETALING, aksjonspunktStatus.UTFØRT)],
      simuleringResultat,
      simuleringAksjonspunkter,
    );
    expect(result).toBe(ProcessMenuStepType.success);
  });

  test('returnerer default når simuleringResultat er null', () => {
    expect(beregnSimuleringType([], null, simuleringAksjonspunkter)).toBe(ProcessMenuStepType.default);
  });

  test('returnerer default når simuleringResultat er undefined', () => {
    expect(beregnSimuleringType([], undefined as any, simuleringAksjonspunkter)).toBe(ProcessMenuStepType.default);
  });
});

describe('beregnTilkjentYtelseType', () => {
  const panelKonfig = { aksjonspunkter: [AksjonspunktDefinisjon.VURDER_TILBAKETREKK] };

  const lagBeregningsresultat = (utfall: string) => ({
    perioder: [
      {
        andeler: [{ uttak: [{ utfall, periode: { fom: '', tom: '' }, utbetalingsgrad: 100 }], inntektskategori: '-' }],
        dagsats: 0,
        fom: '',
        tom: '',
      },
    ],
  });

  test('returnerer default når beregningsresultat er null', () => {
    expect(beregnTilkjentYtelseType(null, panelKonfig, [])).toBe(ProcessMenuStepType.default);
  });

  test('returnerer default når perioder er null', () => {
    expect(beregnTilkjentYtelseType({ perioder: null } as any, panelKonfig, [])).toBe(ProcessMenuStepType.default);
  });

  test('returnerer default når perioder er tom', () => {
    expect(beregnTilkjentYtelseType({ perioder: [] } as any, panelKonfig, [])).toBe(ProcessMenuStepType.default);
  });

  test('returnerer default når perioder er undefined', () => {
    expect(beregnTilkjentYtelseType({} as any, panelKonfig, [])).toBe(ProcessMenuStepType.default);
  });

  test('returnerer warning når aksjonspunkt er åpent', () => {
    const result = beregnTilkjentYtelseType(lagBeregningsresultat('INNVILGET') as any, panelKonfig, [
      lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_TILBAKETREKK),
    ]);
    expect(result).toBe(ProcessMenuStepType.warning);
  });

  test('returnerer success når uttak er innvilget', () => {
    expect(beregnTilkjentYtelseType(lagBeregningsresultat('INNVILGET') as any, { aksjonspunkter: [] }, [])).toBe(
      ProcessMenuStepType.success,
    );
  });

  test('returnerer danger når alle uttak er avslått', () => {
    expect(beregnTilkjentYtelseType(lagBeregningsresultat('AVSLÅTT') as any, { aksjonspunkter: [] }, [])).toBe(
      ProcessMenuStepType.danger,
    );
  });

  test('returnerer success når minst ett uttak er innvilget blant avslag', () => {
    const result = beregnTilkjentYtelseType(
      {
        perioder: [
          {
            andeler: [
              {
                uttak: [{ utfall: 'INNVILGET', periode: { fom: '', tom: '' }, utbetalingsgrad: 0 }],
                inntektskategori: '-',
              },
            ],
            dagsats: 0,
            fom: '',
            tom: '',
          },
          {
            andeler: [
              {
                uttak: [{ utfall: 'AVSLÅTT', periode: { fom: '', tom: '' }, utbetalingsgrad: 100 }],
                inntektskategori: '-',
              },
            ],
            dagsats: 0,
            fom: '',
            tom: '',
          },
        ],
      },
      { aksjonspunkter: [] },
      [],
    );
    expect(result).toBe(ProcessMenuStepType.success);
  });
});

describe('beregnVedtakType', () => {
  const vedtakAksjonspunkter = [AksjonspunktDefinisjon.FORESLÅ_VEDTAK, AksjonspunktDefinisjon.FATTER_VEDTAK];

  const lagVilkår = (status: string) => ({
    vilkarType: vilkarType.SØKNADSFRIST,
    perioder: [{ vilkarStatus: status, periode: { fom: '', tom: '' } }],
    relevanteInnvilgetMerknader: [],
  });

  const lagBehandling = (kode?: string) => ({
    uuid: 'x',
    versjon: 1,
    behandlingsresultat: kode ? { type: { kode, kodeverk: '' } } : undefined,
  });

  test('returnerer default når vilkår er tom', () => {
    expect(beregnVedtakType([], [], lagBehandling() as any, vedtakAksjonspunkter)).toBe(ProcessMenuStepType.default);
  });

  test('returnerer default når et vilkår ikke er vurdert', () => {
    expect(
      beregnVedtakType([lagVilkår(vilkårStatus.IKKE_VURDERT)] as any, [], lagBehandling() as any, vedtakAksjonspunkter),
    ).toBe(ProcessMenuStepType.default);
  });

  test('returnerer warning når et vedtaks-aksjonspunkt er åpent', () => {
    expect(
      beregnVedtakType(
        [lagVilkår(vilkårStatus.OPPFYLT)] as any,
        [lagAksjonspunkt(AksjonspunktDefinisjon.FORESLÅ_VEDTAK)],
        lagBehandling() as any,
        vedtakAksjonspunkter,
      ),
    ).toBe(ProcessMenuStepType.warning);
  });

  test('returnerer default når et ikke-vedtaks-aksjonspunkt er åpent', () => {
    expect(
      beregnVedtakType(
        [lagVilkår(vilkårStatus.OPPFYLT)] as any,
        [lagAksjonspunkt(AksjonspunktDefinisjon.KONTROLLER_LEGEERKLÆRING)],
        lagBehandling() as any,
        vedtakAksjonspunkter,
      ),
    ).toBe(ProcessMenuStepType.default);
  });

  test('returnerer success når behandlingsresultat er innvilget', () => {
    expect(
      beregnVedtakType(
        [lagVilkår(vilkårStatus.OPPFYLT)] as any,
        [],
        lagBehandling('INNVILGET') as any,
        vedtakAksjonspunkter,
      ),
    ).toBe(ProcessMenuStepType.success);
  });

  test('returnerer danger når behandlingsresultat er avslag', () => {
    expect(
      beregnVedtakType(
        [lagVilkår(vilkårStatus.IKKE_OPPFYLT)] as any,
        [],
        lagBehandling('AVSLÅTT') as any,
        vedtakAksjonspunkter,
      ),
    ).toBe(ProcessMenuStepType.danger);
  });

  test('returnerer default når behandlingsresultat mangler type', () => {
    expect(
      beregnVedtakType([lagVilkår(vilkårStatus.OPPFYLT)] as any, [], lagBehandling() as any, vedtakAksjonspunkter),
    ).toBe(ProcessMenuStepType.default);
  });
});
