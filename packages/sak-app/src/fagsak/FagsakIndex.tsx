import React, { FunctionComponent, useState, useCallback } from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';

import { RestApiState } from '@k9-sak-web/rest-api-hooks';
import VisittkortSakIndex from '@fpsak-frontend/sak-visittkort';
import {
  KodeverkMedNavn,
  Personopplysninger,
  Fagsak,
  FagsakPerson,
  Kodeverk,
  ArbeidsgiverOpplysningerWrapper,
} from '@k9-sak-web/types';

import { LoadingPanel, DataFetchPendingModal } from '@fpsak-frontend/shared-components';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';

import BehandlingerIndex from '../behandling/BehandlingerIndex';
import useBehandlingEndret from '../behandling/useBehandlingEndret';
import useTrackRouteParam from '../app/useTrackRouteParam';
import BehandlingSupportIndex from '../behandlingsupport/BehandlingSupportIndex';
import FagsakProfileIndex from '../fagsakprofile/FagsakProfileIndex';
import { pathToMissingPage, erUrlUnderBehandling, erBehandlingValgt, behandlingerPath } from '../app/paths';
import FagsakGrid from './components/FagsakGrid';
import { K9sakApiKeys, restApiHooks } from '../data/k9sakApi';
import useHentFagsakRettigheter from './useHentFagsakRettigheter';
import useHentAlleBehandlinger from './useHentAlleBehandlinger';
import BehandlingRettigheter from '../behandling/behandlingRettigheterTsType';
import RelatertFagsak from '../../../types/src/relatertFagsak';

const erTilbakekreving = (behandlingType: Kodeverk): boolean =>
  behandlingType &&
  (BehandlingType.TILBAKEKREVING === behandlingType.kode ||
    BehandlingType.TILBAKEKREVING_REVURDERING === behandlingType.kode);

/**
 * FagsakIndex
 *
 * Container komponent. Er rot for for fagsakdelen av hovedvinduet, og har ansvar å legge valgt saksnummer fra URL-en i staten.
 */
const FagsakIndex: FunctionComponent = () => {
  const [behandlingerTeller, setBehandlingTeller] = useState(0);
  const [requestPendingMessage, setRequestPendingMessage] = useState<string>();

  const [behandlingIdOgVersjon, setIdOgVersjon] = useState({ behandlingId: undefined, behandlingVersjon: undefined });
  const setBehandlingIdOgVersjon = useCallback(
    (behandlingId, behandlingVersjon) => setIdOgVersjon({ behandlingId, behandlingVersjon }),
    [],
  );
  const { behandlingId, behandlingVersjon } = behandlingIdOgVersjon;

  const oppfriskBehandlinger = useCallback(() => setBehandlingTeller(behandlingerTeller + 1), [behandlingerTeller]);

  const { selected: selectedSaksnummer } = useTrackRouteParam<string>({
    paramName: 'saksnummer',
  });

  const alleKodeverk = restApiHooks.useGlobalStateRestApiData<{ [key: string]: [KodeverkMedNavn] }>(
    K9sakApiKeys.KODEVERK,
  );

  const erBehandlingEndretFraUndefined = useBehandlingEndret(behandlingId, behandlingVersjon);

  const { data: fagsakPerson, state: fagsakPersonState } = restApiHooks.useGlobalStateRestApi<FagsakPerson>(
    K9sakApiKeys.SAK_BRUKER,
    { saksnummer: selectedSaksnummer },
    {
      updateTriggers: [selectedSaksnummer],
      suspendRequest: !selectedSaksnummer,
    },
  );

  const { data: fagsak, state: fagsakState } = restApiHooks.useRestApi<Fagsak>(
    K9sakApiKeys.FETCH_FAGSAK,
    { saksnummer: selectedSaksnummer },
    {
      updateTriggers: [selectedSaksnummer, behandlingId, behandlingVersjon],
      suspendRequest: !selectedSaksnummer || erBehandlingEndretFraUndefined,
      keepData: true,
    },
  );

  const [fagsakRettigheter, harFerdighentetfagsakRettigheter] = useHentFagsakRettigheter(
    selectedSaksnummer,
    behandlingId,
    behandlingVersjon,
  );

  const [alleBehandlinger, harFerdighentetAlleBehandlinger] = useHentAlleBehandlinger(
    selectedSaksnummer,
    behandlingId,
    behandlingVersjon,
    behandlingerTeller,
  );

  const location = useLocation();
  const skalIkkeHenteData =
    !selectedSaksnummer || erUrlUnderBehandling(location) || (erBehandlingValgt(location) && !behandlingId);

  const options = {
    updateTriggers: [skalIkkeHenteData, behandlingId, behandlingVersjon],
    suspendRequest: skalIkkeHenteData,
    keepData: true,
  };

  const { data: behandlingPersonopplysninger, state: personopplysningerState } =
    restApiHooks.useRestApi<Personopplysninger>(K9sakApiKeys.BEHANDLING_PERSONOPPLYSNINGER, undefined, options);

  const behandling = alleBehandlinger.find(b => b.id === behandlingId);

  const { data: arbeidsgiverOpplysninger } = restApiHooks.useRestApi<ArbeidsgiverOpplysningerWrapper>(
    K9sakApiKeys.ARBEIDSGIVERE,
    {},
    {
      updateTriggers: [!behandling],
      suspendRequest: !behandling,
    },
  );

  const { data: behandlingRettigheter } = restApiHooks.useRestApi<BehandlingRettigheter>(
    K9sakApiKeys.BEHANDLING_RETTIGHETER,
    { uuid: behandling?.uuid },
    options,
  );

  const { data: relaterteFagsaker } = restApiHooks.useRestApi<RelatertFagsak>(
    K9sakApiKeys.FAGSAK_RELATERTE_SAKER,
    {},
    {
      updateTriggers: [!behandling],
      suspendRequest: !behandling,
    },
  );

  if (!fagsak) {
    if (fagsakState === RestApiState.NOT_STARTED || fagsakState === RestApiState.LOADING) {
      return <LoadingPanel />;
    }
    return <Redirect to={pathToMissingPage()} />;
  }

  const harIkkeHentetfagsakPersonData =
    fagsakPersonState === RestApiState.LOADING || fagsakPersonState === RestApiState.NOT_STARTED;

  if (harIkkeHentetfagsakPersonData || !harFerdighentetfagsakRettigheter) {
    return <LoadingPanel />;
  }

  if (fagsak.saksnummer !== selectedSaksnummer) {
    return <Redirect to={pathToMissingPage()} />;
  }

  const harVerge = behandling ? behandling.harVerge : false;

  return (
    <>
      <FagsakGrid
        behandlingContent={
          <Route
            strict
            path={behandlingerPath}
            render={props => (
              <BehandlingerIndex
                {...props}
                fagsak={fagsak}
                alleBehandlinger={alleBehandlinger}
                arbeidsgiverOpplysninger={arbeidsgiverOpplysninger}
                setBehandlingIdOgVersjon={setBehandlingIdOgVersjon}
                setRequestPendingMessage={setRequestPendingMessage}
              />
            )}
          />
        }
        profileAndNavigationContent={
          <FagsakProfileIndex
            fagsak={fagsak}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            alleBehandlinger={alleBehandlinger}
            harHentetBehandlinger={harFerdighentetAlleBehandlinger}
            oppfriskBehandlinger={oppfriskBehandlinger}
            fagsakRettigheter={fagsakRettigheter}
            behandlingRettigheter={behandlingRettigheter}
          />
        }
        supportContent={() => {
          if (personopplysningerState === RestApiState.LOADING) {
            return <LoadingPanel />;
          }

          return (
            <BehandlingSupportIndex
              fagsak={fagsak}
              alleBehandlinger={alleBehandlinger}
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersjon}
              behandlingRettigheter={behandlingRettigheter}
              personopplysninger={behandlingPersonopplysninger}
              arbeidsgiverOpplysninger={arbeidsgiverOpplysninger}
            />
          );
        }}
        visittkortContent={() => {
          if (skalIkkeHenteData) {
            return null;
          }

          if (personopplysningerState === RestApiState.LOADING) {
            return <LoadingPanel />;
          }

          return (
            <VisittkortSakIndex
              personopplysninger={behandlingPersonopplysninger}
              alleKodeverk={alleKodeverk}
              sprakkode={behandling?.sprakkode}
              fagsakPerson={fagsakPerson || fagsak.person}
              harTilbakekrevingVerge={erTilbakekreving(behandling?.type) && harVerge}
              relaterteFagsaker={relaterteFagsaker}
            />
          );
        }}
      />
      {requestPendingMessage && <DataFetchPendingModal pendingMessage={requestPendingMessage} />}
    </>
  );
};

export default FagsakIndex;
