import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { BehandlingAppKontekst, Fagsak, ArbeidsgiverOpplysningerWrapper } from '@k9-sak-web/types';
import { IngenBehandlingValgtPanel } from '@k9-sak-web/sak-infosider';

import { behandlingRoutePath } from '../app/paths';
import BehandlingIndex from './BehandlingIndex';

interface OwnProps {
  fagsak: Fagsak;
  alleBehandlinger: BehandlingAppKontekst[];
  arbeidsgiverOpplysninger?: ArbeidsgiverOpplysningerWrapper;
  setBehandlingIdOgVersjon: (behandlingId: number, behandlingVersjon: number) => void;
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
      path={behandlingRoutePath}
      element={(
        <BehandlingIndex
          fagsak={fagsak}
          alleBehandlinger={alleBehandlinger}
          arbeidsgiverOpplysninger={arbeidsgiverOpplysninger}
          setBehandlingIdOgVersjon={setBehandlingIdOgVersjon}
          setRequestPendingMessage={setRequestPendingMessage}
        />
      )}
    />
    <Route>
      <IngenBehandlingValgtPanel numBehandlinger={alleBehandlinger.length} />
    </Route>
  </Routes>
);

export default BehandlingerIndex;
