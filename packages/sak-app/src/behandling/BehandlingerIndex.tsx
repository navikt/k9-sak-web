import IngenBehandlingValgtPanel from '@k9-sak-web/gui/app/feilmeldinger/IngenBehandlingValgtPanel.js';
import type { ArbeidsgiverOpplysningerWrapper, BehandlingAppKontekst, Fagsak } from '@k9-sak-web/types';
import { Route, Routes } from 'react-router';

import BehandlingIndex from './BehandlingIndex';

interface OwnProps {
  fagsak: Fagsak;
  alleBehandlinger: BehandlingAppKontekst[];
  arbeidsgiverOpplysninger?: ArbeidsgiverOpplysningerWrapper;
  setBehandlingIdOgVersjon: (behandlingId: number | undefined, behandlingVersjon: number | undefined) => void;
  setRequestPendingMessage: (message: string) => void;
}

export const BehandlingerIndex = ({
  fagsak,
  alleBehandlinger,
  arbeidsgiverOpplysninger,
  setBehandlingIdOgVersjon,
  setRequestPendingMessage,
}: OwnProps) => (
  <Routes>
    <Route
      path="/:behandlingIdOrUuid/"
      element={
        <BehandlingIndex
          fagsak={fagsak}
          alleBehandlinger={alleBehandlinger}
          arbeidsgiverOpplysninger={arbeidsgiverOpplysninger}
          setBehandlingIdOgVersjon={setBehandlingIdOgVersjon}
          setRequestPendingMessage={setRequestPendingMessage}
        />
      }
    />
    <Route path="/" element={<IngenBehandlingValgtPanel numBehandlinger={alleBehandlinger.length} />} />
  </Routes>
);

export default BehandlingerIndex;
