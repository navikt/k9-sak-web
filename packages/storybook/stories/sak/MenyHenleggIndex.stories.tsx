import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';

import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import MenyHenleggIndex from '@fpsak-frontend/sak-meny-henlegg';

import KlagePart from '@k9-sak-web/behandling-klage/src/types/klagePartTsType';
import withReduxProvider from '../../decorators/withRedux';

export default {
  title: 'sak/sak-meny-henlegg',
  component: MenyHenleggIndex,
  decorators: [withKnobs, withReduxProvider],
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
    ytelseType={fagsakYtelseType.FORELDREPENGER}
    behandlingType={behandlingType.FORSTEGANGSSOKNAD}
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
