import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { vilkårStatus, type VilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import { VilkårType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BeregningsresultatMedUtbetaltePeriodeDto } from '@k9-sak-web/backend/k9sak/kontrakt/beregningsresultat/BeregningsresultatMedUtbetaltePeriodeDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/k9sak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import type { ÅrskvantumForbrukteDagerDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorgspenger/ÅrskvantumForbrukteDagerDto.js';
import { ÅrskvantumUtfall } from '@k9-sak-web/backend/k9sak/kodeverk/uttak/ÅrskvantumUtfall.js';
import { createQueryClient } from '@k9-sak-web/gui/shared/query/queryClient.js';
import { FakeK9SakProsessApi } from '@k9-sak-web/gui/storybook/mocks/FakeK9SakProsessApi.js';
import { prosessStegCodes } from '@k9-sak-web/gui/utils/skjermlenke/prosessStegCodes.js';
import type { Behandling } from '@k9-sak-web/types';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, test } from 'vitest';
import { finnTilkjentYtelseStatus, finnÅrskvantumUttakStatus, useOmsorgspengerProsessmotor } from './Prosessmotor';
import type { ProsessmotorSteg } from '@k9-sak-web/gui/behandling/prosess/prosessmotor/prosessmotorUtils.js';

const createWrapper =
  (queryClient: QueryClient) =>
  ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);

const createMockBehandling = (
  overrides: Partial<Pick<Behandling, 'status' | 'behandlingsresultat'>> = {},
): Pick<Behandling, 'uuid' | 'versjon' | 'behandlingsresultat' | 'status'> => ({
  uuid: '12345',
  versjon: 1,
  behandlingsresultat: { type: { kode: 'INNVILGET', kodeverk: '' } },
  status: { kode: 'UTRED', kodeverk: '' },
  ...overrides,
});

const lagAksjonspunkt = (definisjon: AksjonspunktDto['definisjon'], kanLoses = true) =>
  ({ definisjon, status: aksjonspunktStatus.OPPRETTET, kanLoses }) satisfies AksjonspunktDto;

const lagProsessVilkår = (vilkarType: VilkårType, status: VilkårStatus, vurderesIBehandlingen = true) =>
  ({
    vilkarType,
    perioder: [{ vilkarStatus: status, periode: { fom: '2024-01-01', tom: '2024-01-31' }, vurderesIBehandlingen }],
    relevanteInnvilgetMerknader: [],
  }) satisfies VilkårMedPerioderDto;

const lagForbrukteDager = (aktiviteter: { uttaksperioder?: { utfall?: ÅrskvantumUtfall }[] }[] = []) =>
  ({ sisteUttaksplan: { aktiviteter } }) satisfies ÅrskvantumForbrukteDagerDto;

const lagBeregningsresultat = (utfall?: 'AVSLÅTT' | 'INNVILGET') =>
  ({
    perioder: [
      {
        andeler: utfall
          ? [
              {
                inntektskategori: '-',
                uttak: [{ utfall, periode: { fom: '2024-01-01', tom: '2024-01-31' }, utbetalingsgrad: 100 }],
              },
            ]
          : [],
        dagsats: 0,
        fom: '2024-01-01',
        tom: '2024-01-31',
      },
    ],
  }) satisfies BeregningsresultatMedUtbetaltePeriodeDto;

const finnSteg = (steg: ProsessmotorSteg[], id: string): ProsessmotorSteg => {
  const funnet = steg.find(gjeldendeSteg => gjeldendeSteg.id === id);
  if (!funnet) {
    throw new Error(`Fant ikke steg ${id}`);
  }
  return funnet;
};

describe('finnÅrskvantumUttakStatus', () => {
  test('returnerer IKKE_VURDERT når forbrukte dager mangler', () => {
    expect(finnÅrskvantumUttakStatus(null)).toBe(vilkårStatus.IKKE_VURDERT);
  });

  test('returnerer IKKE_VURDERT når siste uttaksplan mangler aktiviteter', () => {
    expect(finnÅrskvantumUttakStatus({ sisteUttaksplan: {} })).toBe(vilkårStatus.IKKE_VURDERT);
  });

  test('returnerer IKKE_VURDERT når aktivitetene ikke har uttaksperioder', () => {
    expect(finnÅrskvantumUttakStatus(lagForbrukteDager([{}]))).toBe(vilkårStatus.IKKE_VURDERT);
  });

  test('returnerer IKKE_OPPFYLT når alle uttaksperiodene er avslått', () => {
    const forbrukteDager = lagForbrukteDager([
      { uttaksperioder: [{ utfall: ÅrskvantumUtfall.AVSLÅTT }, { utfall: ÅrskvantumUtfall.AVSLÅTT }] },
    ]);
    expect(finnÅrskvantumUttakStatus(forbrukteDager)).toBe(vilkårStatus.IKKE_OPPFYLT);
  });

  test('returnerer OPPFYLT når uttaksperiodene er en blanding av avslag og innvilgelse', () => {
    const forbrukteDager = lagForbrukteDager([
      { uttaksperioder: [{ utfall: ÅrskvantumUtfall.AVSLÅTT }] },
      { uttaksperioder: [{ utfall: ÅrskvantumUtfall.INNVILGET }] },
    ]);
    expect(finnÅrskvantumUttakStatus(forbrukteDager)).toBe(vilkårStatus.OPPFYLT);
  });

  test.each([ÅrskvantumUtfall.UAVKLART, undefined])(
    'returnerer OPPFYLT for perioder med utfall %s, som i gammel rigg',
    utfall => {
      const forbrukteDager = lagForbrukteDager([{ uttaksperioder: [{ utfall }] }]);
      expect(finnÅrskvantumUttakStatus(forbrukteDager)).toBe(vilkårStatus.OPPFYLT);
    },
  );
});

describe('finnTilkjentYtelseStatus', () => {
  test('returnerer IKKE_VURDERT når beregningsresultat mangler', () => {
    expect(finnTilkjentYtelseStatus(null)).toBe(vilkårStatus.IKKE_VURDERT);
  });

  test('returnerer IKKE_VURDERT når periodelisten er tom', () => {
    expect(finnTilkjentYtelseStatus({ perioder: [] })).toBe(vilkårStatus.IKKE_VURDERT);
  });

  test('returnerer IKKE_OPPFYLT når beregningsresultatet ikke har andeler', () => {
    expect(finnTilkjentYtelseStatus(lagBeregningsresultat())).toBe(vilkårStatus.IKKE_OPPFYLT);
  });

  test('returnerer IKKE_OPPFYLT når uttaket kun inneholder avslåtte perioder', () => {
    const resultat = lagBeregningsresultat('AVSLÅTT');
    expect(finnTilkjentYtelseStatus(resultat)).toBe(vilkårStatus.IKKE_OPPFYLT);
  });

  test('returnerer OPPFYLT når uttaket inneholder en innvilget periode', () => {
    const resultat = lagBeregningsresultat('INNVILGET');
    expect(finnTilkjentYtelseStatus(resultat)).toBe(vilkårStatus.OPPFYLT);
  });
});

describe('useOmsorgspengerProsessmotor', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createQueryClient({ queries: { retry: false } });
  });

  const renderProsessmotor = (api: FakeK9SakProsessApi, behandling = createMockBehandling()) =>
    renderHook(() => useOmsorgspengerProsessmotor({ api, behandling }), { wrapper: createWrapper(queryClient) });

  test('viser stegene i riktig rekkefølge og bruker bare vilkår som finnes for inngangsvilkår', async () => {
    const api = new FakeK9SakProsessApi({
      vilkår: [
        lagProsessVilkår(VilkårType.SØKNADSFRIST, vilkårStatus.OPPFYLT),
        lagProsessVilkår(VilkårType.OMSORGEN_FOR, vilkårStatus.OPPFYLT),
        lagProsessVilkår(VilkårType.OPPTJENINGSVILKÅRET, vilkårStatus.OPPFYLT),
        lagProsessVilkår(VilkårType.MEDLEMSKAPSVILKÅRET, vilkårStatus.OPPFYLT),
        lagProsessVilkår(VilkårType.ALDERSVILKÅR, vilkårStatus.OPPFYLT),
        lagProsessVilkår(VilkårType.BEREGNINGSGRUNNLAGVILKÅR, vilkårStatus.OPPFYLT),
      ],
      aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_RETT_FRA_DAG_EN)],
    });

    const { result } = renderProsessmotor(api);

    await waitFor(() => {
      expect(result.current.map(steg => steg.id)).toEqual([
        prosessStegCodes.INNGANGSVILKAR,
        prosessStegCodes.UTTAK,
        prosessStegCodes.BEREGNINGSGRUNNLAG,
        prosessStegCodes.TILKJENT_YTELSE,
        prosessStegCodes.SIMULERING,
        prosessStegCodes.VEDTAK,
      ]);
      // Ti dager-vilkåret mangler, så dets åpne aksjonspunkt hører ikke til Inngangsvilkår.
      expect(finnSteg(result.current, prosessStegCodes.INNGANGSVILKAR).type).toBe(ProcessMenuStepType.success);
    });
  });

  test('åpent VURDER_RETT_FRA_DAG_EN som kan løses gir warning på Inngangsvilkår', async () => {
    const api = new FakeK9SakProsessApi({
      vilkår: [lagProsessVilkår(VilkårType.ARBEIDSGIVER_UTBETALT_PLIKTIGE_DAGER, vilkårStatus.OPPFYLT)],
      aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_RETT_FRA_DAG_EN)],
    });

    const { result } = renderProsessmotor(api);

    await waitFor(() => {
      expect(finnSteg(result.current, prosessStegCodes.INNGANGSVILKAR).type).toBe(ProcessMenuStepType.warning);
    });
  });

  test('bruker overstyringsaksjonspunktet for opptjening når vurderingsaksjonspunktet mangler', async () => {
    const api = new FakeK9SakProsessApi({
      vilkår: [lagProsessVilkår(VilkårType.OPPTJENINGSVILKÅRET, vilkårStatus.OPPFYLT)],
      aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.OVERSTYRING_AV_OPPTJENINGSVILKÅRET)],
    });

    const { result } = renderProsessmotor(api);

    await waitFor(() => {
      expect(finnSteg(result.current, prosessStegCodes.INNGANGSVILKAR).type).toBe(ProcessMenuStepType.warning);
    });
  });

  test('avslått inngangsvilkår stanser ikke Beregning når Uttak er oppfylt', async () => {
    const api = new FakeK9SakProsessApi({
      vilkår: [
        lagProsessVilkår(VilkårType.ALDERSVILKÅR, vilkårStatus.IKKE_OPPFYLT),
        lagProsessVilkår(VilkårType.BEREGNINGSGRUNNLAGVILKÅR, vilkårStatus.OPPFYLT),
      ],
      forbrukteDager: lagForbrukteDager([{ uttaksperioder: [{ utfall: ÅrskvantumUtfall.INNVILGET }] }]),
    });

    const { result } = renderProsessmotor(api);

    await waitFor(() => {
      expect(finnSteg(result.current, prosessStegCodes.INNGANGSVILKAR).type).toBe(ProcessMenuStepType.danger);
      expect(finnSteg(result.current, prosessStegCodes.UTTAK).type).toBe(ProcessMenuStepType.success);
      expect(finnSteg(result.current, prosessStegCodes.BEREGNINGSGRUNNLAG).type).toBe(ProcessMenuStepType.success);
    });
  });

  test('avslått inngangsvilkår stanser Beregning når Uttak ikke er vurdert', async () => {
    const api = new FakeK9SakProsessApi({
      vilkår: [
        lagProsessVilkår(VilkårType.ALDERSVILKÅR, vilkårStatus.IKKE_OPPFYLT),
        lagProsessVilkår(VilkårType.BEREGNINGSGRUNNLAGVILKÅR, vilkårStatus.OPPFYLT),
      ],
      forbrukteDager: null,
    });

    const { result } = renderProsessmotor(api);

    await waitFor(() => {
      expect(finnSteg(result.current, prosessStegCodes.INNGANGSVILKAR).type).toBe(ProcessMenuStepType.danger);
      expect(finnSteg(result.current, prosessStegCodes.UTTAK).type).toBe(ProcessMenuStepType.default);
      expect(finnSteg(result.current, prosessStegCodes.BEREGNINGSGRUNNLAG).type).toBe(ProcessMenuStepType.default);
    });
  });

  test('vedtak uten behandlingsresultat får standardstatus', async () => {
    const api = new FakeK9SakProsessApi({
      vilkår: [lagProsessVilkår(VilkårType.ALDERSVILKÅR, vilkårStatus.OPPFYLT)],
    });
    const behandling = createMockBehandling({ behandlingsresultat: undefined });

    const { result } = renderProsessmotor(api, behandling);

    await waitFor(() => {
      expect(finnSteg(result.current, prosessStegCodes.VEDTAK).type).toBe(ProcessMenuStepType.default);
    });
  });
});
