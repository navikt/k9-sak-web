import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/k9sak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { backendNavn } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';
import { FakeK9SakProsessApi } from '../../../storybook/mocks/FakeK9SakProsessApi.js';
import type { K9SakProsessApi } from './K9SakProsessApi.js';
import {
  aksjonspunkterQueryOptions,
  arbeidsgiverOpplysningerQueryOptions,
  behandlingQueryOptions,
  beregningreferanserTilVurderingQueryOptions,
  beregningsgrunnlagQueryOptions,
  beregningsresultatUtbetalingQueryOptions,
  fagsakQueryOptions,
  opptjeningQueryOptions,
  overlappendeYtelserQueryOptions,
  personopplysningerQueryOptions,
  simuleringResultatQueryOptions,
  søknadsfristStatusQueryOptions,
  tilbakekrevingvalgQueryOptions,
  vilkårQueryOptions,
} from './k9SakQueryOptions.js';

const behandling = { uuid: 'behandling-uuid', versjon: 1 };

const apiWithBackend = (api: K9SakProsessApi, backend: K9SakProsessApi['backend']): K9SakProsessApi =>
  new Proxy(api, {
    get: (target, property, receiver) => (property === 'backend' ? backend : Reflect.get(target, property, receiver)),
  });

describe('k9SakQueryOptions', () => {
  it('inkluderer backend i alle query-nøkler', () => {
    const api = new FakeK9SakProsessApi();
    const queryOptions = [
      vilkårQueryOptions(api, behandling),
      aksjonspunkterQueryOptions(api, behandling),
      behandlingQueryOptions(api, behandling),
      beregningsgrunnlagQueryOptions(api, behandling),
      arbeidsgiverOpplysningerQueryOptions(api, behandling),
      personopplysningerQueryOptions(api, behandling),
      beregningsresultatUtbetalingQueryOptions(api, behandling),
      simuleringResultatQueryOptions(api, behandling),
      tilbakekrevingvalgQueryOptions(api, behandling),
      overlappendeYtelserQueryOptions(api, behandling),
      beregningreferanserTilVurderingQueryOptions(api, behandling),
      søknadsfristStatusQueryOptions(api, behandling),
      fagsakQueryOptions(api, 'saksnummer', behandling),
      opptjeningQueryOptions(api, behandling),
    ];

    for (const options of queryOptions) {
      expect(options.queryKey.at(-1)).toBe(api.backend);
    }

    expect(søknadsfristStatusQueryOptions(api, behandling).queryKey).toEqual([
      'soknadsfristStatus',
      behandling.uuid,
      behandling.versjon,
      api.backend,
    ]);
  });

  it('isolerer cachedata for samme behandling på ulike backends', () => {
    const k9sakApi = new FakeK9SakProsessApi();
    const ungsakApi = apiWithBackend(new FakeK9SakProsessApi(), backendNavn.ungsak);
    const k9sakOptions = vilkårQueryOptions(k9sakApi, behandling);
    const ungsakOptions = vilkårQueryOptions(ungsakApi, behandling);
    const queryClient = new QueryClient();
    const k9sakData: VilkårMedPerioderDto[] = [
      {
        vilkarType: 'K9_VK_9_8',
        relevanteInnvilgetMerknader: [],
        perioder: [
          {
            vilkarStatus: 'IKKE_VURDERT',
            periode: { fom: '2026-04-01', tom: '2026-04-01' },
            vurderesIBehandlingen: true,
            merknadParametere: {},
          },
        ],
      },
    ];
    const ungsakData: VilkårMedPerioderDto[] = [
      {
        vilkarType: 'K9_VK_9_8',
        relevanteInnvilgetMerknader: [],
        perioder: [
          {
            vilkarStatus: 'OPPFYLT',
            periode: { fom: '2026-04-02', tom: '2026-04-02' },
            vurderesIBehandlingen: true,
            merknadParametere: {},
          },
        ],
      },
    ];

    queryClient.setQueryData(k9sakOptions.queryKey, k9sakData);
    queryClient.setQueryData(ungsakOptions.queryKey, ungsakData);

    expect(queryClient.getQueryData(k9sakOptions.queryKey)).toBe(k9sakData);
    expect(queryClient.getQueryData(ungsakOptions.queryKey)).toBe(ungsakData);
  });
});
