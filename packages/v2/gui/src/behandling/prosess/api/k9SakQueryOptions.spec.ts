import { describe, expect, it } from 'vitest';
import { FakeK9SakProsessApi } from '../../../storybook/mocks/FakeK9SakProsessApi.js';
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
});
