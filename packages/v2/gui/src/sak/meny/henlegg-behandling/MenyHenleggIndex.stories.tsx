import { behandlingResultatType as behandlingResultatTypeK9Klage } from '@k9-sak-web/backend/k9klage/generated';
import { behandlingType as BehandlingTypeK9Klage } from '@k9-sak-web/backend/k9klage/kodeverk/behandling/BehandlingType.js';
import { behandlingResultatType as behandlingResultatTypeK9Sak, sakstype } from '@k9-sak-web/backend/k9sak/generated';
import { behandlingType as BehandlingTypeK9SAK } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { action } from '@storybook/addon-actions';
import MenyHenleggIndex from './MenyHenleggIndex';
import type { Klagepart } from './types/Klagepart';

export default {
  title: 'gui/sak/meny/henlegg-behandling',
  component: MenyHenleggIndex,
};

interface HenleggParams {
  behandlingVersjon: number;
  behandlingId: number;
  årsakKode: string;
  begrunnelse: string;
}

export const HenleggFørstegangssøknadPleiepenger = () => (
  <MenyHenleggIndex
    behandlingId={1}
    behandlingVersjon={2}
    henleggBehandling={action('button-click') as (params: HenleggParams) => Promise<any>}
    forhandsvisHenleggBehandling={action('button-click')}
    ytelseType={sakstype.PSB}
    behandlingType={BehandlingTypeK9SAK.FØRSTEGANGSSØKNAD}
    behandlingResultatTyper={[
      behandlingResultatTypeK9Sak.HENLAGT_FEILOPPRETTET,
      behandlingResultatTypeK9Sak.HENLAGT_SØKNAD_TRUKKET,
    ]}
    gaaTilSokeside={action('button-click')}
    lukkModal={action('button-click')}
    hentMottakere={action('button-click') as () => Promise<Klagepart[]>}
  />
);

export const HenleggKlagebehandling = () => (
  <MenyHenleggIndex
    behandlingId={1}
    behandlingVersjon={2}
    henleggBehandling={action('button-click') as (params: HenleggParams) => Promise<any>}
    forhandsvisHenleggBehandling={action('button-click')}
    ytelseType={sakstype.PSB}
    behandlingType={BehandlingTypeK9Klage.KLAGE}
    behandlingResultatTyper={[behandlingResultatTypeK9Klage.HENLAGT_KLAGE_TRUKKET]}
    gaaTilSokeside={action('button-click')}
    lukkModal={action('button-click')}
    hentMottakere={() =>
      Promise.resolve([
        {
          identifikasjon: {
            id: '123',
            type: 'FNR',
            navn: 'Ola Nordmann',
          },
          rolleType: 'KLAGE_PART',
        },
      ])
    }
    arbeidsgiverOpplysningerPerId={{
      '123': {
        navn: 'Ola Nordmann',
        arbeidsforholdreferanser: [],
      },
    }}
  />
);

export const HenleggRevurderingTilbakekreving = () => (
  <MenyHenleggIndex
    behandlingId={1}
    behandlingVersjon={2}
    henleggBehandling={action('button-click') as (params: HenleggParams) => Promise<any>}
    forhandsvisHenleggBehandling={action('button-click')}
    ytelseType={sakstype.PSB}
    behandlingType={BehandlingTypeK9Klage.REVURDERING_TILBAKEKREVING}
    behandlingResultatTyper={['HENLAGT_FEILOPPRETTET_MED_BREV']}
    gaaTilSokeside={action('button-click')}
    lukkModal={action('button-click')}
    hentMottakere={action('button-click') as () => Promise<Klagepart[]>}
  />
);
