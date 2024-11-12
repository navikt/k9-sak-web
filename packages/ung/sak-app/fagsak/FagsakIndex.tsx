import VisittkortSakIndex from '@fpsak-frontend/sak-visittkort';
import { DataFetchPendingModal, LoadingPanel } from '@fpsak-frontend/shared-components';
import {
  ArbeidsgiverOpplysningerWrapper,
  Fagsak,
  FagsakPerson,
  FeatureToggles,
  KodeverkMedNavn,
  NavAnsatt,
  Personopplysninger,
  SaksbehandlereInfo,
} from '@k9-sak-web/types';
import OvergangFraInfotrygd from '@k9-sak-web/types/src/overgangFraInfotrygd';
import RelatertFagsak from '@k9-sak-web/types/src/relatertFagsak';
import { useCallback, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import { isRequestNotDone } from '@k9-sak-web/rest-api-hooks/src/RestApiState';
import BehandlingRettigheter from '@k9-sak-web/sak-app/src/behandling/behandlingRettigheterTsType';
import FagsakGrid from '@k9-sak-web/sak-app/src/fagsak/components/FagsakGrid';
import { SaksbehandlernavnContext } from '@navikt/ft-plattform-komponenter';
import { behandlingerRoutePath, erBehandlingValgt, erUrlUnderBehandling, pathToMissingPage } from '../app/paths';
import useTrackRouteParam from '../app/useTrackRouteParam';
import BehandlingerIndex from '../behandling/BehandlingerIndex';
import useBehandlingEndret from '../behandling/useBehandlingEndret';
import BehandlingSupportIndex from '../behandlingsupport/BehandlingSupportIndex';
import { restApiHooks, UngSakApiKeys } from '../data/ungsakApi';
import FagsakProfileIndex from '../fagsakprofile/FagsakProfileIndex';
import useHentAlleBehandlinger from './useHentAlleBehandlinger';
import useHentFagsakRettigheter from './useHentFagsakRettigheter';

/**
 * FagsakIndex
 *
 * Container komponent. Er rot for fagsakdelen av hovedvinduet, og har ansvar å legge valgt saksnummer fra URL-en i staten.
 */
const FagsakIndex = () => {
  const [behandlingerTeller, setBehandlingTeller] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [requestPendingMessage, setRequestPendingMessage] = useState<string>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [behandlingIdOgVersjon, setIdOgVersjon] = useState({ behandlingId: undefined, behandlingVersjon: undefined });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setBehandlingIdOgVersjon = useCallback(
    (behandlingId, behandlingVersjon) => setIdOgVersjon({ behandlingId, behandlingVersjon }),
    [],
  );
  const { behandlingId, behandlingVersjon } = behandlingIdOgVersjon;

  const oppfriskBehandlinger = useCallback(() => setBehandlingTeller(behandlingerTeller + 1), [behandlingerTeller]);

  const { selected: selectedSaksnummer } = useTrackRouteParam<string>({
    paramName: 'saksnummer',
  });

  const alleKodeverkUngSak = restApiHooks.useGlobalStateRestApiData<{ [key: string]: KodeverkMedNavn[] }>(
    UngSakApiKeys.KODEVERK,
  );

  const erBehandlingEndretFraUndefined = useBehandlingEndret(behandlingId, behandlingVersjon);

  const { data: fagsakPerson, state: fagsakPersonState } = restApiHooks.useGlobalStateRestApi<FagsakPerson>(
    UngSakApiKeys.SAK_BRUKER,
    { saksnummer: selectedSaksnummer },
    {
      updateTriggers: [selectedSaksnummer],
      suspendRequest: !selectedSaksnummer,
    },
  );

  const { data: fagsak, state: fagsakState } = restApiHooks.useRestApi<Fagsak>(
    UngSakApiKeys.FETCH_FAGSAK,
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
    restApiHooks.useRestApi<Personopplysninger>(UngSakApiKeys.BEHANDLING_PERSONOPPLYSNINGER, undefined, options);

  const behandling = alleBehandlinger.find(b => b.id === behandlingId);

  const { data: arbeidsgiverOpplysninger } = restApiHooks.useRestApi<ArbeidsgiverOpplysningerWrapper>(
    UngSakApiKeys.ARBEIDSGIVERE,
    {},
    {
      updateTriggers: [!behandling],
      suspendRequest: !behandling,
    },
  );

  const { data: behandlingRettigheter } = restApiHooks.useRestApi<BehandlingRettigheter>(
    UngSakApiKeys.BEHANDLING_RETTIGHETER,
    { uuid: behandling?.uuid },
    options,
  );

  const { data: saksbehandlereSomHarGjortEndringerIBehandlingen } = restApiHooks.useRestApi<SaksbehandlereInfo>(
    UngSakApiKeys.HENT_SAKSBEHANDLERE,
    { behandlingUuid: behandling?.uuid },
    options,
  );

  const { data: relaterteFagsaker } = restApiHooks.useRestApi<RelatertFagsak>(
    UngSakApiKeys.FAGSAK_RELATERTE_SAKER,
    {},
    {
      updateTriggers: [behandlingId],
      suspendRequest: !behandling,
    },
  );

  const { data: direkteOvergangFraInfotrygd } = restApiHooks.useRestApi<OvergangFraInfotrygd>(
    UngSakApiKeys.DIREKTE_OVERGANG_FRA_INFOTRYGD,
    {},
    {
      updateTriggers: [!behandling],
      suspendRequest: !behandling,
    },
  );

  const featureTogglesData = restApiHooks.useGlobalStateRestApiData<{ key: string; value: string }[]>(
    UngSakApiKeys.FEATURE_TOGGLE,
  );
  const featureToggles = useMemo<FeatureToggles>(
    () =>
      featureTogglesData?.reduce((acc, curr) => {
        acc[curr.key] = `${curr.value}`.toLowerCase() === 'true';
        return acc;
      }, {}),
    [featureTogglesData],
  );

  const navAnsatt = restApiHooks.useGlobalStateRestApiData<NavAnsatt>(UngSakApiKeys.NAV_ANSATT);

  if (!fagsak) {
    if (isRequestNotDone(fagsakState)) {
      return <LoadingPanel />;
    }
    return <Navigate to={pathToMissingPage()} />;
  }

  const harIkkeHentetfagsakPersonData = isRequestNotDone(fagsakPersonState);

  if (harIkkeHentetfagsakPersonData || !harFerdighentetfagsakRettigheter) {
    return <LoadingPanel />;
  }

  if (fagsak.saksnummer !== selectedSaksnummer) {
    return <Navigate to={pathToMissingPage()} />;
  }

  return (
    <>
      <KodeverkProvider behandlingType={behandling ? behandling?.type?.kode : undefined} kodeverk={alleKodeverkUngSak}>
        <SaksbehandlernavnContext.Provider value={saksbehandlereSomHarGjortEndringerIBehandlingen?.saksbehandlere}>
          <FagsakGrid
            behandlingContent={
              <Routes>
                <Route
                  path={behandlingerRoutePath}
                  element={
                    <BehandlingerIndex
                      fagsak={fagsak}
                      alleBehandlinger={alleBehandlinger}
                      arbeidsgiverOpplysninger={arbeidsgiverOpplysninger}
                      setBehandlingIdOgVersjon={setBehandlingIdOgVersjon}
                      setRequestPendingMessage={setRequestPendingMessage}
                    />
                  }
                />
              </Routes>
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
                personopplysninger={behandlingPersonopplysninger}
                arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysninger?.arbeidsgivere ?? {}}
              />
            }
            supportContent={() => {
              if (isRequestNotDone(personopplysningerState)) {
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
                  navAnsatt={navAnsatt}
                  featureToggles={featureToggles}
                />
              );
            }}
            visittkortContent={() => {
              if (skalIkkeHenteData) {
                return null;
              }

              if (isRequestNotDone(personopplysningerState)) {
                return <LoadingPanel />;
              }

              return (
                <div style={{ overflow: 'hidden' }}>
                  <VisittkortSakIndex
                    personopplysninger={behandlingPersonopplysninger}
                    alleKodeverk={alleKodeverkUngSak}
                    sprakkode={behandling?.sprakkode}
                    fagsakPerson={fagsakPerson || fagsak.person}
                    relaterteFagsaker={relaterteFagsaker}
                    direkteOvergangFraInfotrygd={direkteOvergangFraInfotrygd}
                    erPbSak={fagsak.erPbSak}
                  />
                </div>
              );
            }}
          />
        </SaksbehandlernavnContext.Provider>
      </KodeverkProvider>
      {requestPendingMessage && <DataFetchPendingModal pendingMessage={requestPendingMessage} />}
    </>
  );
};

export default FagsakIndex;
