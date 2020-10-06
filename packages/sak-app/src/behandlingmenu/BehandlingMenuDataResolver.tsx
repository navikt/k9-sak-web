import React, { FunctionComponent } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { Fagsak } from '@k9-sak-web/types';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { RestApiState } from '@fpsak-frontend/rest-api-hooks';

import BehandlingAppKontekst from '../behandling/behandlingAppKontekstTsType';
import { fjernVerge, opprettVerge } from './behandlingMenuOperations';
import BehandlingMenuIndex from './BehandlingMenuIndex';
import { FpsakApiKeys, restApiHooks } from '../data/fpsakApi';

const YTELSE_BEHANDLINGTYPER = [
  BehandlingType.FORSTEGANGSSOKNAD,
  BehandlingType.REVURDERING,
  BehandlingType.TILBAKEKREVING,
  BehandlingType.TILBAKEKREVING_REVURDERING,
];

const VERGE_MENYVALG = {
  FJERN: 'FJERN',
  OPPRETT: 'OPPRETT',
};

interface OwnProps {
  fagsak: Fagsak;
  alleBehandlinger: BehandlingAppKontekst[];
  oppfriskBehandlinger: () => void;
  behandlingId?: number;
  behandlingVersjon?: number;
}

const BehandlingMenuDataResolver: FunctionComponent<OwnProps> = ({
  fagsak,
  alleBehandlinger,
  oppfriskBehandlinger,
  behandlingId,
  behandlingVersjon,
}) => {
  const behandling = alleBehandlinger.find(b => b.id === behandlingId);
  const skalHenteVergeMenyvalg = behandling && YTELSE_BEHANDLINGTYPER.includes(behandling.type.kode);
  const { data: vergeMenyvalgData, state: stateVerge } = restApiHooks.useRestApi<{ vergeBehandlingsmeny: string }>(
    FpsakApiKeys.VERGE_MENYVALG,
    { saksnummer: fagsak.saksnummer, behandlingId },
    {
      updateTriggers: [behandlingId, behandlingVersjon],
      suspendRequest: !skalHenteVergeMenyvalg,
    },
  );

  const { data: menyhandlingRettigheter, state } = restApiHooks.useRestApi<{ harSoknad: boolean }>(
    FpsakApiKeys.MENYHANDLING_RETTIGHETER,
    undefined,
    {
      updateTriggers: [behandlingId, behandlingVersjon],
      suspendRequest: !behandlingId,
      keepData: true,
    },
  );

  if (
    (skalHenteVergeMenyvalg && stateVerge === RestApiState.LOADING) ||
    (behandlingId && state === RestApiState.LOADING)
  ) {
    return <LoadingPanel />;
  }

  const history = useHistory();
  const location = useLocation();

  const vergeMenyvalg = vergeMenyvalgData?.vergeBehandlingsmeny;
  const fjernVergeFn =
    vergeMenyvalg === VERGE_MENYVALG.FJERN
      ? fjernVerge(location, history.push, fagsak.saksnummer, behandlingId, behandlingVersjon)
      : undefined;
  const opprettVergeFn =
    vergeMenyvalg === VERGE_MENYVALG.OPPRETT
      ? opprettVerge(location, history.push, fagsak.saksnummer, behandlingId, behandlingVersjon)
      : undefined;

  return (
    <BehandlingMenuIndex
      fagsak={fagsak}
      alleBehandlinger={alleBehandlinger}
      saksnummer={fagsak.saksnummer}
      behandlingId={behandlingId}
      behandlingVersion={behandlingVersjon}
      fjernVerge={fjernVergeFn}
      opprettVerge={opprettVergeFn}
      pushLocation={history.push}
      location={location}
      menyhandlingRettigheter={menyhandlingRettigheter}
      oppfriskBehandlinger={oppfriskBehandlinger}
    />
  );
};

export default BehandlingMenuDataResolver;
