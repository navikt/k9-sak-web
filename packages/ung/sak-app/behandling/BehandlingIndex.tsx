import { Location } from 'history';
import { lazy, Suspense, useCallback, useContext, useEffect, useMemo } from 'react';
import { NavigateFunction, useLocation, useNavigate, useParams } from 'react-router';

import BehandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { parseQueryString, replaceNorwegianCharacters } from '@fpsak-frontend/utils';
import BehandlingKlageUngdomsytelseIndex from '@k9-sak-web/behandling-klage-ungdomsytelse';
import BehandlingUngdomsytelseIndex from '@k9-sak-web/behandling-ungdomsytelse/src/BehandlingUngdomsytelseIndex';
import ErrorBoundary from '@k9-sak-web/gui/app/feilmeldinger/ErrorBoundary.js';
import { AvregningFormProvider } from '@k9-sak-web/gui/context/AvregningContext.js';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import { LoadingPanel } from '@k9-sak-web/gui/shared/loading-panel/LoadingPanel.js';
import { gyldigBehandlingId, gyldigBehandlingUuid } from '@k9-sak-web/gui/utils/paths.js';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import getAccessRights from '@k9-sak-web/sak-app/src/app/util/access';
import {
  ArbeidsgiverOpplysningerWrapper,
  BehandlingAppKontekst,
  Fagsak,
  FagsakPerson,
  KodeverkMedNavn,
  NavAnsatt,
} from '@k9-sak-web/types';
import { getFaktaLocation, getLocationWithDefaultProsessStegAndFakta, getProsessStegLocation } from '../app/paths';
import { LinkCategory, requestApi, restApiHooks, UngSakApiKeys } from '../data/ungsakApi';
import behandlingEventHandler from './BehandlingEventHandler';

const BehandlingTilbakekrevingUngdomsytelseIndex = lazy(
  () => import('@k9-sak-web/behandling-tilbakekreving-ungdomsytelse'),
);

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

    void navigate(newLocation);
  };

interface OwnProps {
  setBehandlingIdOgVersjon: (behandlingId: number | undefined, behandlingVersjon: number | undefined) => void;
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
  const { behandlingIdOrUuid } = useParams();
  const behandling = alleBehandlinger.find(
    b => b.id === gyldigBehandlingId(behandlingIdOrUuid) || b.uuid === gyldigBehandlingUuid(behandlingIdOrUuid),
  );

  useEffect(() => {
    if (behandling != null) {
      requestApi.setLinks(behandling.links, LinkCategory.BEHANDLING);
      setBehandlingIdOgVersjon(behandling.id, behandling.versjon);
    }
  }, [behandling]);

  const { addErrorMessage } = useRestApiErrorDispatcher();

  const oppdaterBehandlingVersjon = useCallback(
    versjon => setBehandlingIdOgVersjon(behandling?.id, versjon),
    [behandling?.id],
  );

  const kodeverk = restApiHooks.useGlobalStateRestApiData<{ [key: string]: [KodeverkMedNavn] }>(UngSakApiKeys.KODEVERK);

  const fagsakPerson = restApiHooks.useGlobalStateRestApiData<FagsakPerson>(UngSakApiKeys.SAK_BRUKER);
  const featureToggles = useContext(FeatureTogglesContext);

  const navAnsatt = restApiHooks.useGlobalStateRestApiData<NavAnsatt>(UngSakApiKeys.NAV_ANSATT);
  const rettigheter = useMemo(
    () => getAccessRights(navAnsatt, fagsak.status, behandling?.status, behandling?.type),
    [fagsak.status, behandling?.id, behandling?.status, behandling?.type],
  );

  const location = useLocation();
  const navigate = useNavigate();
  const opneSokeside = useCallback(() => {
    window.location.assign('/');
  }, []);
  const oppdaterProsessStegOgFaktaPanelIUrl = useCallback(getOppdaterProsessStegOgFaktaPanelIUrl(location, navigate), [
    location,
    navigate,
  ]);

  const query = parseQueryString(location.search);

  const defaultProps = {
    behandlingId: behandling?.id,
    behandlingUuid: behandling?.uuid,
    oppdaterBehandlingVersjon,
    behandlingEventHandler,
    kodeverk: kodeverk,
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
          visningsnavn: b.visningsnavn,
        })),
    [alleBehandlinger],
  );

  const behandlingTypeKode = behandling?.type.kode ?? '';

  if (behandling == null) {
    return <LoadingPanel />;
  }

  const renderContent = () => {
    if (erTilbakekreving(behandlingTypeKode)) {
      return (
        <Suspense fallback={<LoadingPanel />}>
          <ErrorBoundary errorMessageCallback={addErrorMessage}>
            <BehandlingTilbakekrevingUngdomsytelseIndex
              oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
              harApenRevurdering={fagsakBehandlingerInfo.some(
                b => b.type.kode === BehandlingType.REVURDERING && b.status.kode !== BehandlingStatus.AVSLUTTET,
              )}
              valgtFaktaSteg={query.fakta}
              key={behandling.id}
              {...defaultProps}
            />
          </ErrorBoundary>
        </Suspense>
      );
    }

    if (behandlingTypeKode === BehandlingType.KLAGE && featureToggles?.UNG_KLAGE) {
      return (
        <Suspense fallback={<LoadingPanel />}>
          <ErrorBoundary errorMessageCallback={addErrorMessage}>
            <BehandlingKlageUngdomsytelseIndex
              oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
              alleBehandlinger={fagsakBehandlingerInfo}
              key={behandling.id}
              {...defaultProps}
            />
          </ErrorBoundary>
        </Suspense>
      );
    }

    return (
      <Suspense fallback={<LoadingPanel />}>
        <ErrorBoundary errorMessageCallback={addErrorMessage}>
          <BehandlingUngdomsytelseIndex
            oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
            valgtFaktaSteg={query.fakta}
            key={behandling.id}
            {...defaultProps}
          />
        </ErrorBoundary>
      </Suspense>
    );
  };

  return <AvregningFormProvider behandlingId={behandling.id}>{renderContent()}</AvregningFormProvider>;
};

export default BehandlingIndex;
