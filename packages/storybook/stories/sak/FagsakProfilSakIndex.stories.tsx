import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { Knapp } from 'nav-frontend-knapper';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import FagsakProfilSakIndex from '@fpsak-frontend/sak-fagsak-profil';

import withReduxAndRouterProvider from '../../decorators/withReduxAndRouter';

export default {
  title: 'sak/sak-fagsak-profil',
  component: FagsakProfilSakIndex,
  decorators: [withKnobs, withReduxAndRouterProvider],
};

const FAGSAK_STATUS_KODEVERK = 'FAGSAK_STATUS';
const FAGSAK_YTELSE_KODEVERK = 'FAGSAK_YTELSE';

export const visPanelForValgAvBehandlinger = () => (
  <div style={{ width: '600px', backgroundColor: 'white', padding: '30px' }}>
    <FagsakProfilSakIndex
      saksnummer="232341251"
      fagsakYtelseType={{
        kode: fagsakYtelseType.FORELDREPENGER,
        kodeverk: FAGSAK_YTELSE_KODEVERK,
        navn: 'Foreldrepenger',
      }}
      fagsakStatus={{ kode: fagsakStatus.OPPRETTET, kodeverk: FAGSAK_STATUS_KODEVERK, navn: 'Opprettet' }}
      renderBehandlingMeny={() => <Knapp>Meny (Placeholder)</Knapp>}
      renderBehandlingVelger={() => <div>Liste (placeholder)</div>}
      dekningsgrad={100}
    />
  </div>
);
