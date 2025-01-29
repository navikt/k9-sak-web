import { action } from '@storybook/addon-actions';
import React from 'react';

import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import KlagePart from '@k9-sak-web/behandling-klage/src/types/klagePartTsType';
import MenyHenleggIndex from './MenyHenleggIndex';

export default {
  title: 'sak/sak-meny-henlegg',
  component: MenyHenleggIndex,
};

interface HenleggParams {
  behandlingVersjon: number;
  behandlingId: number;
  årsakKode: string;
  begrunnelse: string;
}

export const visMenyForÅHenleggeEnBehandling = () => (
  <MenyHenleggIndex
    behandlingId={1}
    behandlingVersjon={2}
    henleggBehandling={action('button-click') as (params: HenleggParams) => Promise<any>}
    forhandsvisHenleggBehandling={action('button-click')}
    ytelseType={{
      kode: fagsakYtelseType.FORELDREPENGER,
      kodeverk: 'YTELSE_TYPE',
    }}
    behandlingType={{
      kode: behandlingType.FORSTEGANGSSOKNAD,
      kodeverk: 'BEHANDLING_TYPE',
    }}
    behandlingUuid="23r2323"
    behandlingResultatTyper={[
      {
        kode: behandlingResultatType.HENLAGT_SOKNAD_TRUKKET,
        kodeverk: 'RESULTAT_TYPE',
        navn: 'Henlagt soknad trukket',
      },
      {
        kode: behandlingResultatType.HENLAGT_FEILOPPRETTET,
        kodeverk: 'RESULTAT_TYPE',
        navn: 'Henlagt feilopprettet',
      },
      {
        kode: behandlingResultatType.MANGLER_BEREGNINGSREGLER,
        kodeverk: 'RESULTAT_TYPE',
        navn: 'Mangler beregningsregler',
      },
    ]}
    gaaTilSokeside={action('button-click')}
    lukkModal={action('button-click')}
    hentMottakere={action('button-click') as () => Promise<KlagePart[]>}
  />
);
