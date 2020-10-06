import React, { FunctionComponent } from 'react';
import { Route, Switch } from 'react-router-dom';

import { Fagsak } from '@k9-sak-web/types';

import BehandlingAppKontekst from './behandlingAppKontekstTsType';
import { behandlingPath } from '../app/paths';
import NoSelectedBehandling from './components/NoSelectedBehandling';
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
      <NoSelectedBehandling numBehandlinger={alleBehandlinger.length} />
    </Route>
  </Switch>
);

export default BehandlingerIndex;
