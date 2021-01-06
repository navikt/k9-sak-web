import React, { FunctionComponent } from 'react';
import { Route, Switch } from 'react-router-dom';

import { BehandlingAppKontekst, Fagsak } from '@k9-sak-web/types';
import { IngenBehandlingValgtPanel } from '@k9-sak-web/sak-infosider';

import { behandlingPath } from '../app/paths';
import BehandlingIndex from './BehandlingIndex';

interface OwnProps {
  fagsak: Fagsak;
  alleBehandlinger: BehandlingAppKontekst[];
  setBehandlingIdOgVersjon: (behandlingId: number, behandlingVersjon: number) => void;
  setRequestPendingMessage: (message: string) => void;
}

export const BehandlingerIndex: FunctionComponent<OwnProps> = ({
  fagsak,
  alleBehandlinger,
  setBehandlingIdOgVersjon,
  setRequestPendingMessage,
}) => (
  <Switch>
    <Route
      strict
      path={behandlingPath}
      render={props => (
        <BehandlingIndex
          {...props}
          fagsak={fagsak}
          alleBehandlinger={alleBehandlinger}
          setBehandlingIdOgVersjon={setBehandlingIdOgVersjon}
          setRequestPendingMessage={setRequestPendingMessage}
        />
      )}
    />
    <Route>
      <IngenBehandlingValgtPanel numBehandlinger={alleBehandlinger.length} />
    </Route>
  </Switch>
);

export default BehandlingerIndex;
