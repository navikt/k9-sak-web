import {
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon,
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus,
  k9_kodeverk_vilkår_Utfall,
  k9_kodeverk_vilkår_VilkårType,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { FakeK9SakProsessApi } from '@k9-sak-web/gui/storybook/mocks/FakeK9SakProsessApi.js';
import type { Behandling } from '@k9-sak-web/types';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, test } from 'vitest';
import {
  beregnSimuleringType,
  beregnTilkjentYtelseType,
  beregnUttakType,
  beregnVedtakType,
  useProsessmotor,
} from './Prosessmotor';

const createWrapper = (queryClient: QueryClient) => {
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const createMockBehandling = (overrides = {}): Behandling => ({
  id: 1,
  versjon: 1,
  uuid: '12345',
  behandlingsresultat: { type: { kode: 'INNVILGET', kodeverk: '' } },
  ...overrides,
});

describe('Prosessmotor', () => {
  describe('inngangsvilkårpaneler', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
      queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
        },
      });
    });

    test('returnerer alle paneler med default status når ingen data finnes', async () => {
      const api = new FakeK9SakProsessApi();
      const behandling = createMockBehandling();

      const { result } = renderHook(() => useProsessmotor({ api, behandling }), {
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
            vilkarType: k9_kodeverk_vilkår_VilkårType.SØKNADSFRIST,
            perioder: [
              {
                vilkarStatus: k9_kodeverk_vilkår_Utfall.OPPFYLT,
                periode: { fom: '', tom: '' },
                vurderesIBehandlingen: true,
              },
            ],
            relevanteInnvilgetMerknader: [],
          },
          {
            vilkarType: k9_kodeverk_vilkår_VilkårType.ALDERSVILKÅR,
            perioder: [
              {
                vilkarStatus: k9_kodeverk_vilkår_Utfall.OPPFYLT,
                periode: { fom: '', tom: '' },
                vurderesIBehandlingen: true,
              },
            ],
            relevanteInnvilgetMerknader: [],
          },
          {
            vilkarType: k9_kodeverk_vilkår_VilkårType.OMSORGEN_FOR,
            perioder: [
              {
                vilkarStatus: k9_kodeverk_vilkår_Utfall.OPPFYLT,
                periode: { fom: '', tom: '' },
                vurderesIBehandlingen: true,
              },
            ],
            relevanteInnvilgetMerknader: [],
          },
        ],
      });
      const behandling = createMockBehandling();

      const { result } = renderHook(() => useProsessmotor({ api, behandling }), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        const inngangsvilkårPanel = result.current[0];
        expect(inngangsvilkårPanel.type).toBe(ProcessMenuStepType.success);
        if ('erVurdert' in inngangsvilkårPanel) {
          expect(inngangsvilkårPanel.erVurdert).toBe(true);
        }
      });
    });

    test('setter panel til warning når det finnes åpent aksjonspunkt', async () => {
      const api = new FakeK9SakProsessApi({
        vilkår: [
          {
            vilkarType: k9_kodeverk_vilkår_VilkårType.SØKNADSFRIST,
            perioder: [{ vilkarStatus: k9_kodeverk_vilkår_Utfall.OPPFYLT, periode: { fom: '', tom: '' } }],
            relevanteInnvilgetMerknader: [],
          },
        ],
        aksjonspunkter: [
          {
            definisjon:
              k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST,
            status: k9_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus.OPPRETTET,
          },
        ],
      });
      const behandling = createMockBehandling();

      const { result } = renderHook(() => useProsessmotor({ api, behandling }), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        const inngangsvilkårPanel = result.current[0];
        expect(inngangsvilkårPanel.type).toBe(ProcessMenuStepType.warning);
      });
    });
  });

  describe('beregnUttakType', () => {
    test('returnerer danger når alle perioder er avslått', () => {
      const result = beregnUttakType(
        [],
        {
          uttaksplan: {
            perioder: {
              '2024-01-01/2024-01-31': { utfall: k9_kodeverk_vilkår_Utfall.IKKE_OPPFYLT },
              '2024-02-01/2024-02-28': { utfall: k9_kodeverk_vilkår_Utfall.IKKE_OPPFYLT },
            },
          },
          simulertUttaksplan: {},
        },
        [],
      );

      expect(result).toBe(ProcessMenuStepType.danger);
    });

    test('returnerer success når noen perioder er godkjent', () => {
      const result = beregnUttakType(
        [],
        {
          uttaksplan: {
            perioder: {
              '2024-01-01/2024-01-31': { utfall: k9_kodeverk_vilkår_Utfall.OPPFYLT },
              '2024-02-01/2024-02-28': { utfall: k9_kodeverk_vilkår_Utfall.IKKE_OPPFYLT },
            },
          },
          simulertUttaksplan: {},
        },
        [],
      );

      expect(result).toBe(ProcessMenuStepType.success);
    });

    test('returnerer warning når det finnes åpent aksjonspunkt', () => {
      const result = beregnUttakType(
        [
          {
            definisjon: k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon.VURDER_DATO_NY_REGEL_UTTAK,
            status: k9_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus.OPPRETTET,
          },
        ],
        {
          uttaksplan: {
            perioder: {
              '2024-01-01/2024-01-31': { utfall: k9_kodeverk_vilkår_Utfall.OPPFYLT },
            },
          },
          simulertUttaksplan: {},
        },
        [k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon.VURDER_DATO_NY_REGEL_UTTAK],
      );

      expect(result).toBe(ProcessMenuStepType.warning);
    });

    test('returnerer default når det ikke finnes uttaksperioder', () => {
      const result = beregnUttakType(
        [],
        {
          uttaksplan: {
            perioder: {},
          },
          simulertUttaksplan: {},
        },
        [],
      );

      expect(result).toBe(ProcessMenuStepType.default);
    });

    test('returnerer default når uttaksplan er undefined', () => {
      const result = beregnUttakType([], {} as any, []);

      expect(result).toBe(ProcessMenuStepType.default);
    });

    test('returnerer success over warning når aksjonspunkt er lukket', () => {
      const result = beregnUttakType(
        [
          {
            definisjon: k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon.VURDER_DATO_NY_REGEL_UTTAK,
            status: k9_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus.UTFØRT,
          },
        ],
        {
          uttaksplan: {
            perioder: {
              '2024-01-01/2024-01-31': { utfall: k9_kodeverk_vilkår_Utfall.OPPFYLT },
            },
          },
          simulertUttaksplan: {},
        },
        [k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon.VURDER_DATO_NY_REGEL_UTTAK],
      );

      expect(result).toBe(ProcessMenuStepType.success);
    });
  });

  describe('beregnSimuleringType', () => {
    test('returnerer success når simuleringResultat finnes og ingen åpne aksjonspunkter', () => {
      const result = beregnSimuleringType(
        [],
        {
          simuleringResultat: { periode: { fom: '', tom: '' } },
          simuleringResultatUtenInntrekk: { periode: { fom: '', tom: '' } },
          slåttAvInntrekk: false,
        },
        [],
      );

      expect(result).toBe(ProcessMenuStepType.success);
    });

    test('returnerer warning når det finnes åpent aksjonspunkt', () => {
      const result = beregnSimuleringType(
        [
          {
            definisjon: k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon.VURDER_FEILUTBETALING,
            status: k9_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus.OPPRETTET,
          },
        ],
        {
          simuleringResultat: { periode: { fom: '', tom: '' } },
          simuleringResultatUtenInntrekk: { periode: { fom: '', tom: '' } },
          slåttAvInntrekk: false,
        },
        [k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon.VURDER_FEILUTBETALING],
      );

      expect(result).toBe(ProcessMenuStepType.warning);
    });

    test('returnerer default når simuleringResultat er null', () => {
      const result = beregnSimuleringType([], null as any, []);

      expect(result).toBe(ProcessMenuStepType.default);
    });

    test('returnerer default når simuleringResultat er undefined', () => {
      const result = beregnSimuleringType([], undefined as any, []);

      expect(result).toBe(ProcessMenuStepType.default);
    });

    test('returnerer warning selv med simuleringResultat når aksjonspunkt er åpent', () => {
      const result = beregnSimuleringType(
        [
          {
            definisjon: k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon.SJEKK_HØY_ETTERBETALING,
            status: k9_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus.OPPRETTET,
          },
        ],
        {
          simuleringResultat: { periode: { fom: '', tom: '' } },
          simuleringResultatUtenInntrekk: { periode: { fom: '', tom: '' } },
          slåttAvInntrekk: false,
        },
        [k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon.SJEKK_HØY_ETTERBETALING],
      );

      expect(result).toBe(ProcessMenuStepType.warning);
    });

    test('returnerer success når aksjonspunkt er lukket', () => {
      const result = beregnSimuleringType(
        [
          {
            definisjon: k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon.VURDER_FEILUTBETALING,
            status: k9_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus.UTFØRT,
          },
        ],
        {
          simuleringResultat: { periode: { fom: '', tom: '' } },
          simuleringResultatUtenInntrekk: { periode: { fom: '', tom: '' } },
          slåttAvInntrekk: false,
        },
        [k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon.VURDER_FEILUTBETALING],
      );

      expect(result).toBe(ProcessMenuStepType.success);
    });
  });

  describe('beregnTilkjentYtelseType', () => {
    test('returnerer success når det finnes innvilgede uttak', () => {
      const result = beregnTilkjentYtelseType(
        {
          perioder: [
            {
              andeler: [
                {
                  uttak: [
                    {
                      utfall: 'INNVILGET',
                      periode: {
                        fom: '',
                        tom: '',
                      },
                      utbetalingsgrad: 0,
                    },
                  ],
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

    test('returnerer danger når alle uttak er avslått', () => {
      const result = beregnTilkjentYtelseType(
        {
          perioder: [
            {
              andeler: [
                {
                  uttak: [
                    {
                      utfall: 'AVSLÅTT',
                      periode: { fom: '', tom: '' },
                      utbetalingsgrad: 100,
                    },
                  ],
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

      expect(result).toBe(ProcessMenuStepType.danger);
    });

    test('returnerer success når minst ett uttak er innvilget blant flere avslag', () => {
      const result = beregnTilkjentYtelseType(
        {
          perioder: [
            {
              andeler: [
                {
                  uttak: [
                    {
                      utfall: 'INNVILGET',
                      periode: {
                        fom: '',
                        tom: '',
                      },
                      utbetalingsgrad: 0,
                    },
                  ],
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
                  uttak: [
                    {
                      utfall: 'AVSLÅTT',
                      periode: { fom: '', tom: '' },
                      utbetalingsgrad: 100,
                    },
                  ],
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

    test('returnerer default når perioder er undefined', () => {
      const result = beregnTilkjentYtelseType({} as any, { aksjonspunkter: [] }, []);

      expect(result).toBe(ProcessMenuStepType.default);
    });

    test('returnerer default når perioder er null', () => {
      const result = beregnTilkjentYtelseType({ perioder: null } as any, { aksjonspunkter: [] }, []);

      expect(result).toBe(ProcessMenuStepType.default);
    });

    test('returnerer success når det finnes flere perioder med innvilget uttak', () => {
      const result = beregnTilkjentYtelseType(
        {
          perioder: [
            {
              andeler: [
                {
                  uttak: [
                    {
                      utfall: 'INNVILGET',
                      periode: {
                        fom: '',
                        tom: '',
                      },
                      utbetalingsgrad: 0,
                    },
                  ],
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
                  uttak: [
                    {
                      utfall: 'AVSLÅTT',
                      periode: { fom: '', tom: '' },
                      utbetalingsgrad: 100,
                    },
                  ],
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
    test('beregnVedtakType returnerer success når alle vilkår er oppfylt', () => {
      const vilkår = [
        {
          vilkarType: k9_kodeverk_vilkår_VilkårType.SØKNADSFRIST,
          perioder: [{ vilkarStatus: k9_kodeverk_vilkår_Utfall.OPPFYLT, periode: { fom: '', tom: '' } }],
          relevanteInnvilgetMerknader: [],
        },
        {
          vilkarType: k9_kodeverk_vilkår_VilkårType.ALDERSVILKÅR,
          perioder: [{ vilkarStatus: k9_kodeverk_vilkår_Utfall.OPPFYLT, periode: { fom: '', tom: '' } }],
          relevanteInnvilgetMerknader: [],
        },
      ];
      const behandling = createMockBehandling({ behandlingsresultat: { type: 'INNVILGET' } });

      const result = beregnVedtakType(vilkår, [], behandling, []);

      expect(result).toBe(ProcessMenuStepType.success);
    });

    test('beregnVedtakType returnerer danger når behandlingsresultat er avslag', () => {
      const vilkår = [
        {
          vilkarType: k9_kodeverk_vilkår_VilkårType.SØKNADSFRIST,
          perioder: [{ vilkarStatus: k9_kodeverk_vilkår_Utfall.IKKE_OPPFYLT, periode: { fom: '', tom: '' } }],
          relevanteInnvilgetMerknader: [],
        },
      ];
      const behandling = createMockBehandling({ behandlingsresultat: { type: 'AVSLÅTT' } });

      const result = beregnVedtakType(vilkår, [], behandling, []);

      expect(result).toBe(ProcessMenuStepType.danger);
    });

    test('beregnVedtakType returnerer default når behandlingsresultat mangler type', () => {
      const vilkår = [
        {
          vilkarType: k9_kodeverk_vilkår_VilkårType.SØKNADSFRIST,
          perioder: [{ vilkarStatus: k9_kodeverk_vilkår_Utfall.OPPFYLT, periode: { fom: '', tom: '' } }],
          relevanteInnvilgetMerknader: [],
        },
      ];
      const behandling = createMockBehandling({ behandlingsresultat: undefined });

      const result = beregnVedtakType(vilkår, [], behandling, []);

      expect(result).toBe(ProcessMenuStepType.default);
    });
  });
});
