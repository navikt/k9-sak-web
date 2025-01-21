import { Location } from 'history';
import React, { Suspense, useCallback, useContext, useEffect, useMemo } from 'react';
import { NavigateFunction, useLocation, useNavigate } from 'react-router';

import BehandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { parseQueryString, replaceNorwegianCharacters } from '@fpsak-frontend/utils';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import {
  ArbeidsgiverOpplysningerWrapper,
  BehandlingAppKontekst,
  Fagsak,
  FagsakPerson,
  KodeverkMedNavn,
  NavAnsatt,
} from '@k9-sak-web/types';

import BehandlingPleiepengerSluttfaseIndex from '@k9-sak-web/behandling-pleiepenger-sluttfase/src/BehandlingPleiepengerSluttfaseIndex';
import { erFagytelseTypeUtvidetRett } from '@k9-sak-web/behandling-utvidet-rett/src/utils/utvidetRettHjelpfunksjoner';
import FeatureTogglesContext from '@k9-sak-web/gui/utils/featureToggles/FeatureTogglesContext.js';
import ErrorBoundary from '../app/ErrorBoundary';
import {
  getFaktaLocation,
  getLocationWithDefaultProsessStegAndFakta,
  getPathToK9Los,
  getProsessStegLocation,
} from '../app/paths';
import useTrackRouteParam from '../app/useTrackRouteParam';
import getAccessRights from '../app/util/access';
import { K9sakApiKeys, LinkCategory, requestApi, restApiHooks } from '../data/k9sakApi';
import behandlingEventHandler from './BehandlingEventHandler';

const BehandlingPleiepengerIndex = React.lazy(() => import('@k9-sak-web/behandling-pleiepenger'));
const BehandlingOmsorgspengerIndex = React.lazy(() => import('@k9-sak-web/behandling-omsorgspenger'));
const BehandlingKlageIndex = React.lazy(() => import('@k9-sak-web/behandling-klage'));
const BehandlingTilbakekrevingIndex = React.lazy(() => import('@k9-sak-web/behandling-tilbakekreving'));
const BehandlingAnkeIndex = React.lazy(() => import('@k9-sak-web/behandling-anke'));
const BehandlingFrisinnIndex = React.lazy(() => import('@k9-sak-web/behandling-frisinn'));
const BehandlingUnntakIndex = React.lazy(() => import('@k9-sak-web/behandling-unntak'));
const BehandlingUtvidetRettIndex = React.lazy(() => import('@k9-sak-web/behandling-utvidet-rett'));
const BehandlingOpplaeringspengerIndex = React.lazy(() => import('@k9-sak-web/behandling-opplaeringspenger'));

const erTilbakekreving = (behandlingTypeKode: string): boolean =>
  behandlingTypeKode === BehandlingType.TILBAKEKREVING ||
  behandlingTypeKode === BehandlingType.TILBAKEKREVING_REVURDERING;

const formatName = (bpName = ''): string => replaceNorwegianCharacters(bpName.toLowerCase());

const getOppdaterProsessStegOgFaktaPanelIUrl =
  (location: Location, navigate: NavigateFunction) =>
  (prosessStegId: string, faktaPanelId: string): void => {
    let newLocation;
    if (prosessStegId === 'default') {
      newLocation = getLocationWithDefaultProsessStegAndFakta(location);
    } else if (prosessStegId) {
      newLocation = getProsessStegLocation(location)(formatName(prosessStegId));
    } else {
      newLocation = getProsessStegLocation(location)(null);
    }

    if (faktaPanelId === 'default') {
      newLocation = getFaktaLocation(newLocation)('default');
    } else if (faktaPanelId) {
      newLocation = getFaktaLocation(newLocation)(formatName(faktaPanelId));
    } else {
      newLocation = getFaktaLocation(newLocation)(null);
    }

    navigate(newLocation);
  };

interface OwnProps {
  setBehandlingIdOgVersjon: (behandlingId: number, behandlingVersjon: number) => void;
  fagsak: Fagsak;
  alleBehandlinger: BehandlingAppKontekst[];
  arbeidsgiverOpplysninger?: ArbeidsgiverOpplysningerWrapper;
  setRequestPendingMessage: (message: string) => void;
}

/**
 * BehandlingIndex
 *
 * Er rot for for den delen av hovedvinduet som har innhold for en valgt behandling, og styrer livssyklusen til de mekanismene som er
 * relatert til den valgte behandlingen.
 */
const BehandlingIndex = ({
  setBehandlingIdOgVersjon,
  fagsak,
  alleBehandlinger,
  arbeidsgiverOpplysninger,
  setRequestPendingMessage,
}: OwnProps) => {
  const { selected: behandlingId } = useTrackRouteParam<number>({
    paramName: 'behandlingId',
    parse: behandlingFromUrl => Number.parseInt(behandlingFromUrl, 10),
  });

  const behandling = alleBehandlinger.find(b => b.id === behandlingId);
  const behandlingVersjon = behandling?.versjon;

  useEffect(() => {
    if (behandling) {
      requestApi.setLinks(behandling.links, LinkCategory.BEHANDLING);
      setBehandlingIdOgVersjon(behandlingId, behandlingVersjon);
    }
  }, [behandling]);

  const { addErrorMessage } = useRestApiErrorDispatcher();

  const oppdaterBehandlingVersjon = useCallback(
    versjon => setBehandlingIdOgVersjon(behandlingId, versjon),
    [behandlingId],
  );

  const kodeverk = restApiHooks.useGlobalStateRestApiData<{ [key: string]: [KodeverkMedNavn] }>(K9sakApiKeys.KODEVERK);
  const klageKodeverk = restApiHooks.useGlobalStateRestApiData<{ [key: string]: [KodeverkMedNavn] }>(
    K9sakApiKeys.KODEVERK_KLAGE,
  );

  const fagsakPerson = restApiHooks.useGlobalStateRestApiData<FagsakPerson>(K9sakApiKeys.SAK_BRUKER);
  const featureToggles = useContext(FeatureTogglesContext);

  const navAnsatt = restApiHooks.useGlobalStateRestApiData<NavAnsatt>(K9sakApiKeys.NAV_ANSATT);
  const rettigheter = useMemo(
    () => getAccessRights(navAnsatt, fagsak.status, behandling?.status, behandling?.type),
    [fagsak.status, behandlingId, behandling?.status, behandling?.type],
  );

  const location = useLocation();
  const navigate = useNavigate();
  const opneSokeside = useCallback(() => {
    window.location.assign(getPathToK9Los() || '/');
  }, []);
  const oppdaterProsessStegOgFaktaPanelIUrl = useCallback(getOppdaterProsessStegOgFaktaPanelIUrl(location, navigate), [
    location,
    navigate,
  ]);

  const query = parseQueryString(location.search);

  const behandlingTypeKode = behandling?.type ? behandling.type.kode : undefined;

  const defaultProps = {
    behandlingId,
    oppdaterBehandlingVersjon,
    behandlingEventHandler,
    kodeverk: behandlingTypeKode === BehandlingType.KLAGE ? klageKodeverk : kodeverk,
    fagsak,
    fagsakPerson,
    rettigheter,
    arbeidsgiverOpplysninger,
    featureToggles,
    opneSokeside,
    setRequestPendingMessage,
    valgtProsessSteg: query.punkt,
  };

  const fagsakBehandlingerInfo = useMemo(
    () =>
      alleBehandlinger
        .filter(b => !b.behandlingHenlagt)
        .map(b => ({
          id: b.id,
          uuid: b.uuid,
          type: b.type,
          status: b.status,
          opprettet: b.opprettet,
          avsluttet: b.avsluttet,
        })),
    [alleBehandlinger],
  );

  if (!behandlingId) {
    return <LoadingPanel />;
  }

  if (behandlingTypeKode === BehandlingType.KLAGE) {
    return (
      <Suspense fallback={<LoadingPanel />}>
        <ErrorBoundary errorMessageCallback={addErrorMessage}>
          <BehandlingKlageIndex
            oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
            alleBehandlinger={fagsakBehandlingerInfo}
            key={behandlingId}
            {...defaultProps}
          />
        </ErrorBoundary>
      </Suspense>
    );
  }

  if (behandlingTypeKode === BehandlingType.ANKE) {
    return (
      <Suspense fallback={<LoadingPanel />}>
        <ErrorBoundary errorMessageCallback={addErrorMessage}>
          <BehandlingAnkeIndex
            oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
            alleBehandlinger={fagsakBehandlingerInfo}
            key={behandlingId}
            {...defaultProps}
          />
        </ErrorBoundary>
      </Suspense>
    );
  }

  if (behandlingTypeKode === BehandlingType.UNNTAK) {
    return (
      <Suspense fallback={<LoadingPanel />}>
        <ErrorBoundary errorMessageCallback={addErrorMessage}>
          <BehandlingUnntakIndex
            oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
            valgtFaktaSteg={query.fakta}
            key={behandlingId}
            {...defaultProps}
          />
        </ErrorBoundary>
      </Suspense>
    );
  }

  if (erTilbakekreving(behandlingTypeKode)) {
    return (
      <Suspense fallback={<LoadingPanel />}>
        <ErrorBoundary errorMessageCallback={addErrorMessage}>
          <BehandlingTilbakekrevingIndex
            oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
            harApenRevurdering={fagsakBehandlingerInfo.some(
              b => b.type.kode === BehandlingType.REVURDERING && b.status.kode !== BehandlingStatus.AVSLUTTET,
            )}
            valgtFaktaSteg={query.fakta}
            key={behandlingId}
            {...defaultProps}
          />
        </ErrorBoundary>
      </Suspense>
    );
  }

  if (fagsak.sakstype === fagsakYtelsesType.OMP) {
    return (
      <Suspense fallback={<LoadingPanel />}>
        <ErrorBoundary errorMessageCallback={addErrorMessage}>
          <BehandlingOmsorgspengerIndex
            oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
            valgtFaktaSteg={query.fakta}
            key={behandlingId}
            {...defaultProps}
          />
        </ErrorBoundary>
      </Suspense>
    );
  }

  if (fagsak.sakstype === fagsakYtelsesType.PPN) {
    return (
      <Suspense fallback={<LoadingPanel />}>
        <ErrorBoundary errorMessageCallback={addErrorMessage}>
          <BehandlingPleiepengerSluttfaseIndex
            oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
            valgtFaktaSteg={query.fakta}
            key={behandlingId}
            {...defaultProps}
          />
        </ErrorBoundary>
      </Suspense>
    );
  }

  if (erFagytelseTypeUtvidetRett(fagsak.sakstype)) {
    return (
      <Suspense fallback={<LoadingPanel />}>
        <ErrorBoundary errorMessageCallback={addErrorMessage}>
          <BehandlingUtvidetRettIndex
            oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
            valgtFaktaSteg={query.fakta}
            key={behandlingId}
            {...defaultProps}
          />
        </ErrorBoundary>
      </Suspense>
    );
  }

  if (fagsak.sakstype === fagsakYtelsesType.FRISINN) {
    return (
      <Suspense fallback={<LoadingPanel />}>
        <ErrorBoundary errorMessageCallback={addErrorMessage}>
          <BehandlingFrisinnIndex
            oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
            valgtFaktaSteg={query.fakta}
            key={behandlingId}
            {...defaultProps}
          />
        </ErrorBoundary>
      </Suspense>
    );
  }

  if (fagsak.sakstype === fagsakYtelsesType.OLP) {
    return (
      <Suspense fallback={<LoadingPanel />}>
        <ErrorBoundary errorMessageCallback={addErrorMessage}>
          <BehandlingOpplaeringspengerIndex
            oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
            valgtFaktaSteg={query.fakta}
            key={behandlingId}
            {...defaultProps}
          />
        </ErrorBoundary>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<LoadingPanel />}>
      <ErrorBoundary errorMessageCallback={addErrorMessage}>
        <BehandlingPleiepengerIndex
          oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
          valgtFaktaSteg={query.fakta}
          key={behandlingId}
          {...defaultProps}
        />
      </ErrorBoundary>
    </Suspense>
  );
};

export default BehandlingIndex;
