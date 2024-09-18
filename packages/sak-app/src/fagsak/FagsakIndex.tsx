import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import VisittkortSakIndex from '@fpsak-frontend/sak-visittkort';
import {
  AndreSakerPåSøkerStripe,
  DataFetchPendingModal,
  LoadingPanel,
  Punsjstripe,
} from '@fpsak-frontend/shared-components';
import { Merknadkode } from '@k9-sak-web/sak-meny-marker-behandling';
import Soknadsperiodestripe from '@k9-sak-web/sak-soknadsperiodestripe';
import {
  ArbeidsgiverOpplysningerWrapper,
  BehandlingPerioderårsakMedVilkår,
  Fagsak,
  FagsakPerson,
  FeatureToggles,
  Kodeverk,
  KodeverkMedNavn,
  MerknadFraLos,
  NavAnsatt,
  Personopplysninger,
} from '@k9-sak-web/types';
import OvergangFraInfotrygd from '@k9-sak-web/types/src/overgangFraInfotrygd';
import RelatertFagsak from '@k9-sak-web/types/src/relatertFagsak';
import React, { useCallback, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { isRequestNotDone } from '@k9-sak-web/rest-api-hooks/src/RestApiState';
import {
  behandlingerRoutePath,
  erBehandlingValgt,
  erUrlUnderBehandling,
  getPathToK9Los,
  pathToMissingPage,
} from '../app/paths';
import useTrackRouteParam from '../app/useTrackRouteParam';
import BehandlingerIndex from '../behandling/BehandlingerIndex';
import BehandlingRettigheter from '../behandling/behandlingRettigheterTsType';
import useBehandlingEndret from '../behandling/useBehandlingEndret';
import BehandlingSupportIndex from '../behandlingsupport/BehandlingSupportIndex';
import { K9sakApiKeys, restApiHooks } from '../data/k9sakApi';
import FagsakProfileIndex from '../fagsakprofile/FagsakProfileIndex';
import FagsakGrid from './components/FagsakGrid';
import useHentAlleBehandlinger from './useHentAlleBehandlinger';
import useHentFagsakRettigheter from './useHentFagsakRettigheter';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';

const erTilbakekreving = (behandlingType: Kodeverk): boolean =>
  behandlingType &&
  (BehandlingType.TILBAKEKREVING === behandlingType.kode ||
    BehandlingType.TILBAKEKREVING_REVURDERING === behandlingType.kode);

const erPleiepengerSyktBarn = (fagsak: Fagsak) => fagsak?.sakstype?.kode === fagsakYtelseType.PLEIEPENGER;
const erPleiepengerLivetsSluttfase = (fagsak: Fagsak) =>
  fagsak?.sakstype?.kode === fagsakYtelseType.PLEIEPENGER_SLUTTFASE;
const erOmsorgspenger = (fagsak: Fagsak) =>
  [
    fagsakYtelseType.OMSORGSPENGER,
    fagsakYtelseType.OMSORGSPENGER_KRONISK_SYKT_BARN,
    fagsakYtelseType.OMSORGSPENGER_ALENE_OM_OMSORGEN,
    fagsakYtelseType.OMSORGSPENGER_MIDLERTIDIG_ALENE,
  ].includes(fagsak?.sakstype?.kode);

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

  const alleKodeverkK9Sak = restApiHooks.useGlobalStateRestApiData<{ [key: string]: KodeverkMedNavn[] }>(
    K9sakApiKeys.KODEVERK,
  );
  const alleKodeverkTilbake = restApiHooks.useGlobalStateRestApiData<{ [key: string]: KodeverkMedNavn[] }>(
    K9sakApiKeys.KODEVERK_TILBAKE,
  );
  const alleKodeverkKlage = restApiHooks.useGlobalStateRestApiData<{ [key: string]: KodeverkMedNavn[] }>(
    K9sakApiKeys.KODEVERK_KLAGE,
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

  restApiHooks.useGlobalStateRestApi(K9sakApiKeys.HENT_SAKSBEHANDLERE, { behandlingUuid: behandling?.uuid }, options);

  const { data: relaterteFagsaker } = restApiHooks.useRestApi<RelatertFagsak>(
    K9sakApiKeys.FAGSAK_RELATERTE_SAKER,
    {},
    {
      updateTriggers: [behandlingId],
      suspendRequest: !behandling,
    },
  );

  const { data: direkteOvergangFraInfotrygd } = restApiHooks.useRestApi<OvergangFraInfotrygd>(
    K9sakApiKeys.DIREKTE_OVERGANG_FRA_INFOTRYGD,
    {},
    {
      updateTriggers: [!behandling],
      suspendRequest: !behandling,
    },
  );

  const featureTogglesData = restApiHooks.useGlobalStateRestApiData<{ key: string; value: string }[]>(
    K9sakApiKeys.FEATURE_TOGGLE,
  );
  const featureToggles = useMemo<FeatureToggles>(
    () =>
      featureTogglesData?.reduce((acc, curr) => {
        acc[curr.key] = `${curr.value}`.toLowerCase() === 'true';
        return acc;
      }, {}),
    [featureTogglesData],
  );

  const showSøknadsperiodestripe = featureToggles?.SOKNADPERIODESTRIPE && erPleiepengerSyktBarn(fagsak);

  const { data: behandlingPerioderMedVilkår } = restApiHooks.useRestApi<BehandlingPerioderårsakMedVilkår>(
    K9sakApiKeys.BEHANDLING_PERIODER_ÅRSAK_MED_VILKÅR,
    {},
    {
      updateTriggers: [behandlingId, behandlingVersjon],
      suspendRequest:
        !behandling ||
        (!erPleiepengerSyktBarn(fagsak) && !erPleiepengerLivetsSluttfase(fagsak)) ||
        !showSøknadsperiodestripe,
    },
  );

  const { data: merknaderFraLos } = restApiHooks.useGlobalStateRestApi<MerknadFraLos>(
    K9sakApiKeys.LOS_HENTE_MERKNAD,
    {},
    {
      updateTriggers: [!behandling],
      suspendRequest: !behandling || !featureToggles?.LOS_MARKER_BEHANDLING,
    },
  );

  const navAnsatt = restApiHooks.useGlobalStateRestApiData<NavAnsatt>(K9sakApiKeys.NAV_ANSATT);

  const erHastesak = merknaderFraLos && merknaderFraLos.merknadKoder?.includes(Merknadkode.HASTESAK);

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

  const harVerge = behandling ? behandling.harVerge : false;
  const showPunsjStripe =
    erPleiepengerSyktBarn(fagsak) ||
    erPleiepengerLivetsSluttfase(fagsak) ||
    (erOmsorgspenger(fagsak) && featureToggles?.OMS_PUNSJSTRIPE);
  const showFagsakPåSøkerStripe = erPleiepengerSyktBarn(fagsak) || erPleiepengerLivetsSluttfase(fagsak);

  return (
    <>
      <KodeverkProvider
        behandlingType={behandling ? behandling?.type?.kode : undefined}
        kodeverk={alleKodeverkK9Sak}
        klageKodeverk={alleKodeverkKlage}
        tilbakeKodeverk={alleKodeverkTilbake}
      >
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
                  alleKodeverk={alleKodeverkK9Sak}
                  sprakkode={behandling?.sprakkode}
                  fagsakPerson={fagsakPerson || fagsak.person}
                  harTilbakekrevingVerge={erTilbakekreving(behandling?.type) && harVerge}
                  relaterteFagsaker={relaterteFagsaker}
                  direkteOvergangFraInfotrygd={direkteOvergangFraInfotrygd}
                  erPbSak={fagsak.erPbSak}
                  erHastesak={erHastesak}
                />

                {behandling && (
                  <>
                    {showPunsjStripe && <Punsjstripe saksnummer={fagsak.saksnummer} pathToLos={getPathToK9Los()} />}
                    {showFagsakPåSøkerStripe && (
                      <AndreSakerPåSøkerStripe
                        søkerIdent={fagsakPerson.personnummer}
                        saksnummer={fagsak.saksnummer}
                        fagsakYtelseType={fagsak.sakstype.kode}
                      />
                    )}
                  </>
                )}

                {showSøknadsperiodestripe && (
                  <Soknadsperiodestripe behandlingPerioderMedVilkår={behandlingPerioderMedVilkår} />
                )}
              </div>
            );
          }}
        />
      </KodeverkProvider>
      {requestPendingMessage && <DataFetchPendingModal pendingMessage={requestPendingMessage} />}
    </>
  );
};

export default FagsakIndex;
