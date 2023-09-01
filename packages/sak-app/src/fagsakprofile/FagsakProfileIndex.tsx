import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import FagsakProfilSakIndex from '@fpsak-frontend/sak-fagsak-profil';
import { LoadingPanel, requireProps } from '@fpsak-frontend/shared-components';
import { RestApiState } from '@k9-sak-web/rest-api-hooks';
import BehandlingVelgerSakIndex from '@k9-sak-web/sak-behandling-velger';
import {
  Aksjonspunkt,
  ArbeidsgiverOpplysningerPerId,
  BehandlingAppKontekst,
  Fagsak,
  KodeverkMedNavn,
  Personopplysninger,
  Risikoklassifisering,
} from '@k9-sak-web/types';
import { Location } from 'history';
import React, { useCallback, useEffect, useState } from 'react';
import { Navigate, useLocation, useMatch } from 'react-router-dom';
import {
  createLocationForSkjermlenke,
  getLocationWithDefaultProsessStegAndFakta,
  pathToBehandling,
  pathToBehandlinger,
} from '../app/paths';
import BehandlingRettigheter from '../behandling/behandlingRettigheterTsType';
import BehandlingMenuIndex, { BehandlendeEnheter } from '../behandlingmenu/BehandlingMenuIndex';
import { K9sakApiKeys, requestApi, restApiHooks } from '../data/k9sakApi';
import { useFpSakKodeverkMedNavn, useGetKodeverkFn } from '../data/useKodeverk';
import SakRettigheter from '../fagsak/sakRettigheterTsType';
import styles from './fagsakProfileIndex.module.css';
import RisikoklassifiseringIndex from './risikoklassifisering/RisikoklassifiseringIndex';

const findPathToBehandling = (saksnummer: string, location: Location, alleBehandlinger: BehandlingAppKontekst[]) => {
  if (alleBehandlinger.length === 1) {
    return getLocationWithDefaultProsessStegAndFakta({
      ...location,
      pathname: pathToBehandling(saksnummer, alleBehandlinger[0].id),
    });
  }
  return pathToBehandlinger(saksnummer);
};

interface OwnProps {
  fagsak: Fagsak;
  alleBehandlinger: BehandlingAppKontekst[];
  behandlingId?: number;
  behandlingVersjon?: number;
  harHentetBehandlinger: boolean;
  oppfriskBehandlinger: () => void;
  fagsakRettigheter: SakRettigheter;
  behandlingRettigheter?: BehandlingRettigheter;
  personopplysninger?: Personopplysninger;
  arbeidsgiverOpplysningerPerId?: ArbeidsgiverOpplysningerPerId;
}

export const FagsakProfileIndex = ({
  fagsak,
  alleBehandlinger,
  harHentetBehandlinger,
  behandlingId,
  behandlingVersjon,
  oppfriskBehandlinger,
  fagsakRettigheter,
  behandlingRettigheter,
  personopplysninger,
  arbeidsgiverOpplysningerPerId,
}: OwnProps) => {
  const [showAll, setShowAll] = useState(!behandlingId);
  const toggleShowAll = useCallback(() => setShowAll(!showAll), [showAll]);

  const getKodeverkFn = useGetKodeverkFn();

  const fagsakStatusMedNavn = useFpSakKodeverkMedNavn<KodeverkMedNavn>(fagsak.status);
  const fagsakYtelseTypeMedNavn = useFpSakKodeverkMedNavn<KodeverkMedNavn>(fagsak.sakstype);

  const { data: risikoAksjonspunkt, state: risikoAksjonspunktState } = restApiHooks.useRestApi<Aksjonspunkt>(
    K9sakApiKeys.RISIKO_AKSJONSPUNKT,
    undefined,
    {
      updateTriggers: [behandlingId, behandlingVersjon],
      suspendRequest: !requestApi.hasPath(K9sakApiKeys.RISIKO_AKSJONSPUNKT),
    },
  );
  const { data: kontrollresultat, state: kontrollresultatState } = restApiHooks.useRestApi<Risikoklassifisering>(
    K9sakApiKeys.KONTROLLRESULTAT,
    undefined,
    {
      updateTriggers: [behandlingId, behandlingVersjon],
      suspendRequest: !requestApi.hasPath(K9sakApiKeys.KONTROLLRESULTAT),
    },
  );

  const { data: behandlendeEnheter } = restApiHooks.useRestApi<BehandlendeEnheter>(K9sakApiKeys.BEHANDLENDE_ENHETER, {
    ytelseType: fagsak.sakstype.kode,
  });

  useEffect(() => {
    setShowAll(!behandlingId);
  }, [behandlingId]);

  const match = useMatch('/fagsak/:saksnummer/');
  const shouldRedirectToBehandlinger = !!match;

  const location = useLocation();
  const getBehandlingLocation = useCallback(
    valgtBehandlingId =>
      getLocationWithDefaultProsessStegAndFakta({
        ...location,
        pathname: pathToBehandling(fagsak.saksnummer, valgtBehandlingId),
      }),
    [fagsak.saksnummer],
  );

  const skalViseRisikoklassifisering = () => {
    const isFagsakPleiepenger = fagsakYtelseTypeMedNavn.kode === fagsakYtelseType.PLEIEPENGER;
    return (
      kontrollresultatState === RestApiState.SUCCESS &&
      risikoAksjonspunktState === RestApiState.SUCCESS &&
      !isFagsakPleiepenger
    );
  };

  return (
    <div className={styles.panelPadding}>
      {!harHentetBehandlinger && <LoadingPanel />}
      {harHentetBehandlinger && shouldRedirectToBehandlinger && (
        <Navigate to={findPathToBehandling(fagsak.saksnummer, location, alleBehandlinger)} />
      )}
      {harHentetBehandlinger && !shouldRedirectToBehandlinger && (
        <FagsakProfilSakIndex
          saksnummer={fagsak.saksnummer}
          fagsakYtelseType={fagsakYtelseTypeMedNavn}
          fagsakStatus={fagsakStatusMedNavn}
          dekningsgrad={fagsak.dekningsgrad}
          renderBehandlingMeny={() => {
            if (!fagsakRettigheter || !behandlendeEnheter) {
              return <LoadingPanel />;
            }
            return (
              <BehandlingMenuIndex
                fagsak={fagsak}
                alleBehandlinger={alleBehandlinger}
                behandlingId={behandlingId}
                behandlingVersjon={behandlingVersjon}
                oppfriskBehandlinger={oppfriskBehandlinger}
                behandlingRettigheter={behandlingRettigheter}
                sakRettigheter={fagsakRettigheter}
                behandlendeEnheter={behandlendeEnheter}
                personopplysninger={personopplysninger}
                arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
              />
            );
          }}
          renderBehandlingVelger={() => (
            <BehandlingVelgerSakIndex
              behandlinger={alleBehandlinger}
              getBehandlingLocation={getBehandlingLocation}
              noExistingBehandlinger={alleBehandlinger.length === 0}
              behandlingId={behandlingId}
              getKodeverkFn={getKodeverkFn}
              showAll={showAll}
              toggleShowAll={toggleShowAll}
              fagsak={fagsak}
              createLocationForSkjermlenke={createLocationForSkjermlenke}
            />
          )}
        />
      )}
      {(kontrollresultatState === RestApiState.LOADING || risikoAksjonspunktState === RestApiState.LOADING) && (
        <LoadingPanel />
      )}
      {skalViseRisikoklassifisering() && (
        <RisikoklassifiseringIndex
          fagsak={fagsak}
          alleBehandlinger={alleBehandlinger}
          risikoAksjonspunkt={risikoAksjonspunkt}
          kontrollresultat={kontrollresultat}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
        />
      )}
    </div>
  );
};

export default requireProps(['fagsak'], <LoadingPanel />)(FagsakProfileIndex);
