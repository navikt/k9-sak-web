import React from 'react';

import { fagsakStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/FagsakStatus.js';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { Button } from '@navikt/ds-react';
import FagsakProfilSakIndex from './FagsakProfilSakIndex';

export default {
  title: 'sak/sak-fagsak-profil',
  component: FagsakProfilSakIndex,
};

export const visPanelForValgAvBehandlinger = () => (
  <div style={{ width: '600px', backgroundColor: 'white', padding: '30px' }}>
    <FagsakProfilSakIndex
      saksnummer="232341251"
      fagsakYtelseType={fagsakYtelseType.FORELDREPENGER}
      fagsakStatus={fagsakStatus.OPPRETTET}
      renderBehandlingMeny={() => <Button size="small">Meny (Placeholder)</Button>}
      renderBehandlingVelger={() => <div>Liste (placeholder)</div>}
      dekningsgrad={100}
    />
  </div>
);
