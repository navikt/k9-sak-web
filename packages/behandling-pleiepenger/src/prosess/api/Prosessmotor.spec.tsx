import { aksjonspunktStatus, AksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { vilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import { VilkårType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import type { BeregningsresultatMedUtbetaltePeriodeDto } from '@k9-sak-web/backend/k9sak/kontrakt/beregningsresultat/BeregningsresultatMedUtbetaltePeriodeDto.js';
import { createQueryClient } from '@k9-sak-web/gui/shared/query/queryClient.js';
import { FakeK9SakProsessApi } from '@k9-sak-web/gui/storybook/mocks/FakeK9SakProsessApi.js';
import {
  FakeUttakBackendApi,
  type FakeUttakBackendConfig,
} from '@k9-sak-web/gui/storybook/mocks/FakeUttakBackendApi.js';
import { UttakApiContext } from '@k9-sak-web/gui/prosess/uttak/api/UttakApiContext.js';
import { prosessStegCodes } from '@k9-sak-web/gui/utils/skjermlenke/prosessStegCodes.js';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, test } from 'vitest';
import {
  beregnVedtakType,
  finnSimuleringStatus,
  finnTilkjentYtelseStatus,
  finnUttakStatus,
  useProsessmotor,
} from './Prosessmotor';

const createWrapper =
  (queryClient: QueryClient, uttak?: FakeUttakBackendConfig['uttak']) =>
  ({ children }: { children: React.ReactNode }) =>
    React.createElement(
      QueryClientProvider,
      { client: queryClient },
      React.createElement(UttakApiContext, { value: new FakeUttakBackendApi({ uttak }) }, children),
    );

const createMockBehandling = (overrides = {}) => ({
  id: 1,
  versjon: 1,
  uuid: '12345',
  behandlingsresultat: { type: { kode: 'INNVILGET', kodeverk: '' } },
  status: { kode: 'UTRED', kodeverk: '' },
  ...overrides,
});

const lagAksjonspunkt = (
  definisjon: AksjonspunktDefinisjon,
  status: AksjonspunktStatus = aksjonspunktStatus.OPPRETTET,
  kanLoses = true,
) => ({ definisjon, status, kanLoses });

function lagProsessVilkår<Status extends string>(
  vilkarType: VilkårType,
  status: Status,
  vurderesIBehandlingen: boolean = true,
) {
  return {
    vilkarType,
    perioder: [{ vilkarStatus: status, periode: { fom: '', tom: '' }, vurderesIBehandlingen }],
    relevanteInnvilgetMerknader: [],
  };
}

const innvilgetBeregningsresultat: BeregningsresultatMedUtbetaltePeriodeDto = {
  perioder: [
    {
      andeler: [
        {
          uttak: [{ utfall: 'INNVILGET', periode: { fom: '', tom: '' }, utbetalingsgrad: 100 }],
          inntektskategori: '-',
        },
      ],
      dagsats: 0,
      fom: '',
      tom: '',
    },
  ],
};

const simuleringResultat = {
  simuleringResultat: { periode: { fom: '', tom: '' } },
  simuleringResultatUtenInntrekk: { periode: { fom: '', tom: '' } },
  slåttAvInntrekk: false,
};

const finnSteg = (steg: { id: string }[], id: string) => {
  const funnet = steg.find(s => s.id === id);
  if (!funnet) {
    throw new Error(`Fant ikke steg ${id}`);
  }
  return funnet as { id: string; type: ProcessMenuStepType; usePartialStatus?: boolean; erVurdert?: boolean };
};

describe('useProsessmotor', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createQueryClient({
      queries: { retry: false },
    });
  });

  const renderProsessmotor = (api: FakeK9SakProsessApi, uttak?: FakeUttakBackendConfig['uttak']) =>
    renderHook(() => useProsessmotor({ api, behandling: createMockBehandling() }), {
      wrapper: createWrapper(queryClient, uttak),
    });

  test('viser alle steg når behandlingen har vilkår for alle vilkårsstegene', async () => {
    const api = new FakeK9SakProsessApi({
      vilkår: [
        lagProsessVilkår(VilkårType.ALDERSVILKÅR, vilkårStatus.OPPFYLT),
        lagProsessVilkår(VilkårType.MEDISINSKEVILKÅR_UNDER_18_ÅR, vilkårStatus.OPPFYLT),
        lagProsessVilkår(VilkårType.OPPTJENINGSVILKÅRET, vilkårStatus.OPPFYLT),
      ],
    });

    const { result } = renderProsessmotor(api);

    await waitFor(() => {
      expect(result.current.map(steg => steg.id)).toEqual([
        prosessStegCodes.INNGANGSVILKAR,
        prosessStegCodes.MEDISINSK_VILKAR,
        prosessStegCodes.OPPTJENING,
        prosessStegCodes.BEREGNINGSGRUNNLAG,
        prosessStegCodes.UTTAK,
        prosessStegCodes.TILKJENT_YTELSE,
        prosessStegCodes.SIMULERING,
        prosessStegCodes.VEDTAK,
      ]);
    });
  });

  test('skjuler vilkårssteg uten vilkår, som i gammel rigg', async () => {
    const { result } = renderProsessmotor(new FakeK9SakProsessApi());

    await waitFor(() => {
      expect(result.current.map(steg => steg.id)).toEqual([
        prosessStegCodes.BEREGNINGSGRUNNLAG,
        prosessStegCodes.UTTAK,
        prosessStegCodes.TILKJENT_YTELSE,
        prosessStegCodes.SIMULERING,
        prosessStegCodes.VEDTAK,
      ]);
    });
  });

  test('setter inngangsvilkår til success når alle vilkår er oppfylt', async () => {
    const api = new FakeK9SakProsessApi({
      vilkår: [
        lagProsessVilkår(VilkårType.SØKNADSFRIST, vilkårStatus.OPPFYLT),
        lagProsessVilkår(VilkårType.ALDERSVILKÅR, vilkårStatus.OPPFYLT),
        lagProsessVilkår(VilkårType.OMSORGEN_FOR, vilkårStatus.OPPFYLT),
      ],
    });

    const { result } = renderProsessmotor(api);

    await waitFor(() => {
      const steg = finnSteg(result.current, prosessStegCodes.INNGANGSVILKAR);
      expect(steg.type).toBe(ProcessMenuStepType.success);
      expect(steg.erVurdert).toBe(true);
    });
  });

  test('tidligere perioder teller ikke når ingen perioder vurderes i behandlingen', async () => {
    const api = new FakeK9SakProsessApi({
      vilkår: [
        lagProsessVilkår(VilkårType.ALDERSVILKÅR, vilkårStatus.OPPFYLT, false),
        lagProsessVilkår(VilkårType.MEDISINSKEVILKÅR_UNDER_18_ÅR, vilkårStatus.OPPFYLT),
      ],
    });

    const { result } = renderProsessmotor(api);

    await waitFor(() => {
      expect(finnSteg(result.current, prosessStegCodes.INNGANGSVILKAR).type).toBe(ProcessMenuStepType.default);
      expect(finnSteg(result.current, prosessStegCodes.MEDISINSK_VILKAR).type).toBe(ProcessMenuStepType.default);
    });
  });

  test('vurdert IKKE_RELEVANT gir danger som i gammel rigg', async () => {
    const api = new FakeK9SakProsessApi({
      vilkår: [lagProsessVilkår(VilkårType.ALDERSVILKÅR, vilkårStatus.IKKE_RELEVANT)],
    });

    const { result } = renderProsessmotor(api);

    await waitFor(() => {
      const steg = finnSteg(result.current, prosessStegCodes.INNGANGSVILKAR);
      expect(steg.type).toBe(ProcessMenuStepType.danger);
      expect(steg.erVurdert).toBe(true);
    });
  });

  test('avslag stopper alle senere vilkårssteg, men ikke uttak', async () => {
    const api = new FakeK9SakProsessApi({
      vilkår: [
        lagProsessVilkår(VilkårType.ALDERSVILKÅR, vilkårStatus.IKKE_OPPFYLT),
        lagProsessVilkår(VilkårType.MEDISINSKEVILKÅR_UNDER_18_ÅR, vilkårStatus.OPPFYLT),
        lagProsessVilkår(VilkårType.OPPTJENINGSVILKÅRET, vilkårStatus.OPPFYLT),
      ],
    });

    const { result } = renderProsessmotor(api, {
      uttaksplan: { perioder: { '2024-01-01/2024-01-31': { utfall: vilkårStatus.OPPFYLT } } },
      simulertUttaksplan: {},
    });

    await waitFor(() => {
      expect(finnSteg(result.current, prosessStegCodes.INNGANGSVILKAR).type).toBe(ProcessMenuStepType.danger);
      expect(finnSteg(result.current, prosessStegCodes.MEDISINSK_VILKAR).type).toBe(ProcessMenuStepType.default);
      expect(finnSteg(result.current, prosessStegCodes.OPPTJENING).type).toBe(ProcessMenuStepType.default);
      expect(finnSteg(result.current, prosessStegCodes.UTTAK).type).toBe(ProcessMenuStepType.success);
    });
  });

  test('avslag på søknadsfrist stopper ikke senere steg når de andre inngangsvilkårene er oppfylt', async () => {
    const api = new FakeK9SakProsessApi({
      vilkår: [
        lagProsessVilkår(VilkårType.SØKNADSFRIST, vilkårStatus.IKKE_OPPFYLT),
        lagProsessVilkår(VilkårType.ALDERSVILKÅR, vilkårStatus.OPPFYLT),
        lagProsessVilkår(VilkårType.MEDISINSKEVILKÅR_UNDER_18_ÅR, vilkårStatus.OPPFYLT),
      ],
    });

    const { result } = renderProsessmotor(api);

    await waitFor(() => {
      expect(finnSteg(result.current, prosessStegCodes.INNGANGSVILKAR).type).toBe(ProcessMenuStepType.danger);
      expect(finnSteg(result.current, prosessStegCodes.MEDISINSK_VILKAR).type).toBe(ProcessMenuStepType.success);
    });
  });

  test('avslag på søknadsfrist stopper senere steg når et annet inngangsvilkår ikke er oppfylt', async () => {
    const api = new FakeK9SakProsessApi({
      vilkår: [
        lagProsessVilkår(VilkårType.SØKNADSFRIST, vilkårStatus.IKKE_OPPFYLT),
        lagProsessVilkår(VilkårType.ALDERSVILKÅR, vilkårStatus.IKKE_VURDERT),
        lagProsessVilkår(VilkårType.MEDISINSKEVILKÅR_UNDER_18_ÅR, vilkårStatus.OPPFYLT),
      ],
    });

    const { result } = renderProsessmotor(api);

    await waitFor(() => {
      expect(finnSteg(result.current, prosessStegCodes.INNGANGSVILKAR).type).toBe(ProcessMenuStepType.danger);
      expect(finnSteg(result.current, prosessStegCodes.MEDISINSK_VILKAR).type).toBe(ProcessMenuStepType.default);
    });
  });

  test('ikke oppfylt i ett delpanel vinner over ikke vurdert i et annet', async () => {
    const api = new FakeK9SakProsessApi({
      vilkår: [
        lagProsessVilkår(VilkårType.ALDERSVILKÅR, vilkårStatus.IKKE_OPPFYLT),
        lagProsessVilkår(VilkårType.OMSORGEN_FOR, vilkårStatus.IKKE_VURDERT),
      ],
    });

    const { result } = renderProsessmotor(api);

    await waitFor(() => {
      expect(finnSteg(result.current, prosessStegCodes.INNGANGSVILKAR).type).toBe(ProcessMenuStepType.danger);
    });
  });

  test('delpanel uten vurderte perioder gjør steget grått', async () => {
    const api = new FakeK9SakProsessApi({
      vilkår: [
        lagProsessVilkår(VilkårType.ALDERSVILKÅR, vilkårStatus.OPPFYLT),
        lagProsessVilkår(VilkårType.OMSORGEN_FOR, vilkårStatus.OPPFYLT, false),
      ],
    });

    const { result } = renderProsessmotor(api);

    await waitFor(() => {
      expect(finnSteg(result.current, prosessStegCodes.INNGANGSVILKAR).type).toBe(ProcessMenuStepType.default);
    });
  });

  test('setter panel til warning når det finnes åpent aksjonspunkt som kan løses', async () => {
    const api = new FakeK9SakProsessApi({
      vilkår: [lagProsessVilkår(VilkårType.SØKNADSFRIST, vilkårStatus.OPPFYLT)],
      aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST)],
    });

    const { result } = renderProsessmotor(api);

    await waitFor(() => {
      expect(finnSteg(result.current, prosessStegCodes.INNGANGSVILKAR).type).toBe(ProcessMenuStepType.warning);
    });
  });

  test('åpent aksjonspunkt som ikke kan løses gir ikke warning', async () => {
    const api = new FakeK9SakProsessApi({
      vilkår: [lagProsessVilkår(VilkårType.SØKNADSFRIST, vilkårStatus.OPPFYLT)],
      aksjonspunkter: [
        lagAksjonspunkt(
          AksjonspunktDefinisjon.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST,
          aksjonspunktStatus.OPPRETTET,
          false,
        ),
      ],
    });

    const { result } = renderProsessmotor(api);

    await waitFor(() => {
      expect(finnSteg(result.current, prosessStegCodes.INNGANGSVILKAR).type).toBe(ProcessMenuStepType.success);
    });
  });

  test('stoppet steg med åpent aksjonspunkt vises som warning', async () => {
    const api = new FakeK9SakProsessApi({
      vilkår: [
        lagProsessVilkår(VilkårType.ALDERSVILKÅR, vilkårStatus.IKKE_OPPFYLT),
        lagProsessVilkår(VilkårType.MEDISINSKEVILKÅR_UNDER_18_ÅR, vilkårStatus.IKKE_VURDERT),
      ],
      aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.KONTROLLER_LEGEERKLÆRING)],
    });

    const { result } = renderProsessmotor(api);

    await waitFor(() => {
      expect(finnSteg(result.current, prosessStegCodes.MEDISINSK_VILKAR).type).toBe(ProcessMenuStepType.warning);
    });
  });

  test('warning-farge alene hindrer ikke fremdrift', async () => {
    const api = new FakeK9SakProsessApi({
      vilkår: [
        lagProsessVilkår(VilkårType.OMSORGEN_FOR, vilkårStatus.OPPFYLT),
        lagProsessVilkår(VilkårType.MEDISINSKEVILKÅR_UNDER_18_ÅR, vilkårStatus.OPPFYLT),
      ],
      aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.OVERSTYRING_AV_OMSORGEN_FOR)],
    });

    const { result } = renderProsessmotor(api);

    await waitFor(() => {
      expect(finnSteg(result.current, prosessStegCodes.INNGANGSVILKAR).type).toBe(ProcessMenuStepType.warning);
      expect(finnSteg(result.current, prosessStegCodes.MEDISINSK_VILKAR).type).toBe(ProcessMenuStepType.success);
    });
  });

  test('setter ikke usePartialStatus når panel er warning', async () => {
    const api = new FakeK9SakProsessApi({
      vilkår: [
        {
          vilkarType: VilkårType.SØKNADSFRIST,
          perioder: [
            { vilkarStatus: vilkårStatus.OPPFYLT, periode: { fom: '', tom: '' }, vurderesIBehandlingen: true },
            { vilkarStatus: vilkårStatus.IKKE_OPPFYLT, periode: { fom: '', tom: '' }, vurderesIBehandlingen: true },
          ],
          relevanteInnvilgetMerknader: [],
        },
      ],
      aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST)],
    });

    const { result } = renderProsessmotor(api);

    await waitFor(() => {
      const steg = finnSteg(result.current, prosessStegCodes.INNGANGSVILKAR);
      expect(steg.type).toBe(ProcessMenuStepType.warning);
      expect(steg.usePartialStatus).toBe(false);
    });
  });

  test('setter ikke usePartialStatus på rødt steg eller rødt vedtak, selv når periodene er blandet', async () => {
    const api = new FakeK9SakProsessApi({
      vilkår: [
        lagProsessVilkår(VilkårType.ALDERSVILKÅR, vilkårStatus.IKKE_OPPFYLT),
        {
          vilkarType: VilkårType.OMSORGEN_FOR,
          perioder: [
            { vilkarStatus: vilkårStatus.OPPFYLT, periode: { fom: '', tom: '' }, vurderesIBehandlingen: true },
            { vilkarStatus: vilkårStatus.IKKE_OPPFYLT, periode: { fom: '', tom: '' }, vurderesIBehandlingen: true },
          ],
          relevanteInnvilgetMerknader: [],
        },
      ],
    });
    const behandling = createMockBehandling({ behandlingsresultat: { type: { kode: 'AVSLÅTT', kodeverk: '' } } });

    const { result } = renderHook(() => useProsessmotor({ api, behandling }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      const inngangsvilkår = finnSteg(result.current, prosessStegCodes.INNGANGSVILKAR);
      expect(inngangsvilkår.type).toBe(ProcessMenuStepType.danger);
      expect(inngangsvilkår.usePartialStatus).toBe(false);
      const vedtak = finnSteg(result.current, prosessStegCodes.VEDTAK);
      expect(vedtak.type).toBe(ProcessMenuStepType.danger);
      expect(vedtak.usePartialStatus).toBe(false);
    });
  });

  test('delvis oppfylt medlemskap gir success med delvis status på opptjening', async () => {
    const api = new FakeK9SakProsessApi({
      vilkår: [
        lagProsessVilkår(VilkårType.ALDERSVILKÅR, vilkårStatus.OPPFYLT),
        lagProsessVilkår(VilkårType.MEDISINSKEVILKÅR_UNDER_18_ÅR, vilkårStatus.OPPFYLT),
        {
          vilkarType: VilkårType.MEDLEMSKAPSVILKÅRET,
          perioder: [
            { vilkarStatus: vilkårStatus.OPPFYLT, periode: { fom: '', tom: '' }, vurderesIBehandlingen: true },
            { vilkarStatus: vilkårStatus.IKKE_OPPFYLT, periode: { fom: '', tom: '' }, vurderesIBehandlingen: true },
          ],
          relevanteInnvilgetMerknader: [],
        },
      ],
    });

    const { result } = renderProsessmotor(api);

    await waitFor(() => {
      const steg = finnSteg(result.current, prosessStegCodes.OPPTJENING);
      expect(steg.type).toBe(ProcessMenuStepType.success);
      expect(steg.erVurdert).toBe(true);
      expect(steg.usePartialStatus).toBe(true);
    });
  });

  test('delvis status vurderes per delpanel, ikke på tvers av vilkår', async () => {
    const api = new FakeK9SakProsessApi({
      vilkår: [
        lagProsessVilkår(VilkårType.ALDERSVILKÅR, vilkårStatus.OPPFYLT),
        lagProsessVilkår(VilkårType.OMSORGEN_FOR, vilkårStatus.OPPFYLT),
        lagProsessVilkår(VilkårType.SØKNADSFRIST, vilkårStatus.OPPFYLT),
      ],
    });

    const { result } = renderProsessmotor(api);

    await waitFor(() => {
      expect(finnSteg(result.current, prosessStegCodes.INNGANGSVILKAR).usePartialStatus).toBe(false);
    });
  });

  test('tilkjent ytelse er default og simulering er success når uttak er avslått', async () => {
    const api = new FakeK9SakProsessApi({ simuleringResultat });

    const { result } = renderProsessmotor(api, {
      uttaksplan: {
        perioder: {
          '2024-01-01/2024-01-31': { utfall: vilkårStatus.IKKE_OPPFYLT },
          '2024-02-01/2024-02-28': { utfall: vilkårStatus.IKKE_OPPFYLT },
        },
      },
      simulertUttaksplan: {},
    });

    await waitFor(() => {
      expect(finnSteg(result.current, prosessStegCodes.UTTAK).type).toBe(ProcessMenuStepType.danger);
      const tilkjentYtelse = finnSteg(result.current, prosessStegCodes.TILKJENT_YTELSE);
      expect(tilkjentYtelse.type).toBe(ProcessMenuStepType.default);
      expect(tilkjentYtelse.erVurdert).toBe(false);
      expect(finnSteg(result.current, prosessStegCodes.SIMULERING).type).toBe(ProcessMenuStepType.success);
    });
  });

  test('setter simulering til warning når uttak er avslått og simulering har åpent aksjonspunkt', async () => {
    const api = new FakeK9SakProsessApi({
      aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_FEILUTBETALING)],
    });

    const { result } = renderProsessmotor(api, {
      uttaksplan: { perioder: { '2024-01-01/2024-01-31': { utfall: vilkårStatus.IKKE_OPPFYLT } } },
      simulertUttaksplan: {},
    });

    await waitFor(() => {
      expect(finnSteg(result.current, prosessStegCodes.UTTAK).type).toBe(ProcessMenuStepType.danger);
      expect(finnSteg(result.current, prosessStegCodes.SIMULERING).type).toBe(ProcessMenuStepType.warning);
    });
  });

  test('åpent aksjonspunkt i uttak stopper ikke tilkjent ytelse', async () => {
    const api = new FakeK9SakProsessApi({
      beregningsresultatUtbetaling: innvilgetBeregningsresultat,
      aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.VENT_ANNEN_PSB_SAK)],
    });

    const { result } = renderProsessmotor(api, {
      uttaksplan: { perioder: { '2024-01-01/2024-01-31': { utfall: vilkårStatus.OPPFYLT } } },
      simulertUttaksplan: {},
    });

    await waitFor(() => {
      expect(finnSteg(result.current, prosessStegCodes.UTTAK).type).toBe(ProcessMenuStepType.warning);
      expect(finnSteg(result.current, prosessStegCodes.TILKJENT_YTELSE).type).toBe(ProcessMenuStepType.success);
    });
  });

  test('tilkjent ytelse stoppes bare av steget rett før, som i gammel rigg', async () => {
    const api = new FakeK9SakProsessApi({
      beregningsresultatUtbetaling: innvilgetBeregningsresultat,
      simuleringResultat,
    });

    const { result } = renderProsessmotor(api, {
      uttaksplan: { perioder: { '2024-01-01/2024-01-31': { utfall: vilkårStatus.OPPFYLT } } },
      simulertUttaksplan: {},
    });

    await waitFor(() => {
      expect(finnSteg(result.current, prosessStegCodes.BEREGNINGSGRUNNLAG).type).toBe(ProcessMenuStepType.default);
      expect(finnSteg(result.current, prosessStegCodes.UTTAK).type).toBe(ProcessMenuStepType.success);
      expect(finnSteg(result.current, prosessStegCodes.TILKJENT_YTELSE).type).toBe(ProcessMenuStepType.success);
      expect(finnSteg(result.current, prosessStegCodes.SIMULERING).type).toBe(ProcessMenuStepType.success);
    });
  });

  test('viser delvis vedtak-status når resultat er innvilget og vilkår er både oppfylt og ikke oppfylt', async () => {
    const api = new FakeK9SakProsessApi({
      vilkår: [
        lagProsessVilkår(VilkårType.SØKNADSFRIST, vilkårStatus.OPPFYLT, false),
        lagProsessVilkår(VilkårType.ALDERSVILKÅR, vilkårStatus.IKKE_OPPFYLT, false),
      ],
    });

    const { result } = renderProsessmotor(api);

    await waitFor(() => {
      const vedtak = finnSteg(result.current, prosessStegCodes.VEDTAK);
      expect(vedtak.type).toBe(ProcessMenuStepType.success);
      expect(vedtak.usePartialStatus).toBe(true);
    });
  });
});

describe('finnUttakStatus', () => {
  test('returnerer IKKE_VURDERT når uttak er null', () => {
    expect(finnUttakStatus(null)).toBe(vilkårStatus.IKKE_VURDERT);
  });

  test('returnerer IKKE_VURDERT når uttaksplan er undefined', () => {
    expect(finnUttakStatus({} as any)).toBe(vilkårStatus.IKKE_VURDERT);
  });

  test('returnerer IKKE_VURDERT når uttaksplan ikke har perioder', () => {
    expect(finnUttakStatus({ uttaksplan: { perioder: {} } } as any)).toBe(vilkårStatus.IKKE_VURDERT);
  });

  test('returnerer IKKE_OPPFYLT når alle perioder er avslått', () => {
    const uttak = {
      uttaksplan: {
        perioder: {
          '2024-01-01/2024-01-31': { utfall: vilkårStatus.IKKE_OPPFYLT },
          '2024-02-01/2024-02-28': { utfall: vilkårStatus.IKKE_OPPFYLT },
        },
      },
    } as any;
    expect(finnUttakStatus(uttak)).toBe(vilkårStatus.IKKE_OPPFYLT);
  });

  test('returnerer OPPFYLT når minst én periode er innvilget', () => {
    const uttak = {
      uttaksplan: {
        perioder: {
          '2024-01-01/2024-01-31': { utfall: vilkårStatus.OPPFYLT },
          '2024-02-01/2024-02-28': { utfall: vilkårStatus.IKKE_OPPFYLT },
        },
      },
    } as any;
    expect(finnUttakStatus(uttak)).toBe(vilkårStatus.OPPFYLT);
  });
});

describe('finnSimuleringStatus', () => {
  test('returnerer OPPFYLT når simuleringResultat finnes', () => {
    expect(finnSimuleringStatus(simuleringResultat)).toBe(vilkårStatus.OPPFYLT);
  });

  test('returnerer IKKE_VURDERT når simuleringResultat mangler', () => {
    expect(finnSimuleringStatus(null)).toBe(vilkårStatus.IKKE_VURDERT);
    expect(finnSimuleringStatus(undefined)).toBe(vilkårStatus.IKKE_VURDERT);
  });
});

describe('finnTilkjentYtelseStatus', () => {
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

  test('returnerer IKKE_VURDERT når beregningsresultat eller perioder mangler', () => {
    expect(finnTilkjentYtelseStatus(null)).toBe(vilkårStatus.IKKE_VURDERT);
    expect(finnTilkjentYtelseStatus({} as any)).toBe(vilkårStatus.IKKE_VURDERT);
  });

  test('returnerer IKKE_OPPFYLT når periodelisten er tom, som i gammel rigg', () => {
    expect(finnTilkjentYtelseStatus({ perioder: [] })).toBe(vilkårStatus.IKKE_OPPFYLT);
  });

  test('returnerer OPPFYLT når uttak er innvilget', () => {
    expect(finnTilkjentYtelseStatus(lagBeregningsresultat('INNVILGET') as any)).toBe(vilkårStatus.OPPFYLT);
  });

  test('returnerer IKKE_OPPFYLT når alle uttak er avslått', () => {
    expect(finnTilkjentYtelseStatus(lagBeregningsresultat('AVSLÅTT') as any)).toBe(vilkårStatus.IKKE_OPPFYLT);
  });
});

describe('beregnVedtakType', () => {
  const vedtakAksjonspunkter = [AksjonspunktDefinisjon.FORESLÅ_VEDTAK, AksjonspunktDefinisjon.FATTER_VEDTAK];

  const lagVilkår = (status: string) => ({
    vilkarType: VilkårType.SØKNADSFRIST,
    perioder: [{ vilkarStatus: status, periode: { fom: '', tom: '' } }],
    relevanteInnvilgetMerknader: [],
  });

  const lagBehandling = (kode?: string, status = 'UTRED') => ({
    uuid: 'x',
    versjon: 1,
    behandlingsresultat: kode ? { type: { kode, kodeverk: '' } } : undefined,
    status: { kode: status, kodeverk: '' },
  });

  test('returnerer default når vilkår er tom', () => {
    expect(beregnVedtakType([], [], lagBehandling() as any, vedtakAksjonspunkter)).toBe(ProcessMenuStepType.default);
  });

  test('returnerer default når et vilkår ikke er vurdert', () => {
    expect(
      beregnVedtakType([lagVilkår(vilkårStatus.IKKE_VURDERT)] as any, [], lagBehandling() as any, vedtakAksjonspunkter),
    ).toBe(ProcessMenuStepType.default);
  });

  test('returnerer warning når FATTER_VEDTAK er åpent og behandling ikke er i FVED', () => {
    expect(
      beregnVedtakType(
        [lagVilkår(vilkårStatus.OPPFYLT)] as any,
        [lagAksjonspunkt(AksjonspunktDefinisjon.FATTER_VEDTAK)],
        lagBehandling(undefined, 'UTRED') as any,
        vedtakAksjonspunkter,
      ),
    ).toBe(ProcessMenuStepType.warning);
  });

  test('returnerer ikke warning når vedtaksaksjonspunktet ikke kan løses', () => {
    expect(
      beregnVedtakType(
        [lagVilkår(vilkårStatus.OPPFYLT)] as any,
        [lagAksjonspunkt(AksjonspunktDefinisjon.FATTER_VEDTAK, aksjonspunktStatus.OPPRETTET, false)],
        lagBehandling(undefined, 'UTRED') as any,
        vedtakAksjonspunkter,
      ),
    ).toBe(ProcessMenuStepType.default);
  });

  test('returnerer warning når behandling er i FVED og FATTER_VEDTAK er åpent, som i gammel rigg', () => {
    expect(
      beregnVedtakType(
        [lagVilkår(vilkårStatus.OPPFYLT)] as any,
        [lagAksjonspunkt(AksjonspunktDefinisjon.FATTER_VEDTAK)],
        lagBehandling('INNVILGET', 'FVED') as any,
        vedtakAksjonspunkter,
      ),
    ).toBe(ProcessMenuStepType.warning);
    expect(
      beregnVedtakType(
        [lagVilkår(vilkårStatus.IKKE_OPPFYLT)] as any,
        [lagAksjonspunkt(AksjonspunktDefinisjon.FATTER_VEDTAK)],
        lagBehandling('AVSLÅTT', 'FVED') as any,
        vedtakAksjonspunkter,
      ),
    ).toBe(ProcessMenuStepType.warning);
  });

  test('returnerer warning når vedtaksaksjonspunkt er åpent selv om andre deler ikke er ferdige', () => {
    const åpentVedtak = lagAksjonspunkt(AksjonspunktDefinisjon.FORESLÅ_VEDTAK);
    expect(
      beregnVedtakType(
        [lagVilkår(vilkårStatus.IKKE_VURDERT)] as any,
        [åpentVedtak],
        lagBehandling('INNVILGET') as any,
        vedtakAksjonspunkter,
      ),
    ).toBe(ProcessMenuStepType.warning);
    expect(
      beregnVedtakType(
        [lagVilkår(vilkårStatus.OPPFYLT)] as any,
        [åpentVedtak, lagAksjonspunkt(AksjonspunktDefinisjon.KONTROLLER_LEGEERKLÆRING)],
        lagBehandling('INNVILGET') as any,
        vedtakAksjonspunkter,
      ),
    ).toBe(ProcessMenuStepType.warning);
    expect(
      beregnVedtakType(
        [lagVilkår(vilkårStatus.OPPFYLT)] as any,
        [åpentVedtak, lagAksjonspunkt(AksjonspunktDefinisjon.OVERSTYRING_AV_BEREGNING)],
        lagBehandling('INNVILGET') as any,
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

  test('returnerer default når overstyring av beregning er åpent', () => {
    expect(
      beregnVedtakType(
        [lagVilkår(vilkårStatus.OPPFYLT)] as any,
        [lagAksjonspunkt(AksjonspunktDefinisjon.OVERSTYRING_AV_BEREGNING)],
        lagBehandling('INNVILGET') as any,
        vedtakAksjonspunkter,
      ),
    ).toBe(ProcessMenuStepType.default);
  });
});
