import { LoadingPanel, requireProps } from '@fpsak-frontend/shared-components';
import { K9SakClientContext } from '@k9-sak-web/gui/app/K9SakClientContext.js';
import BehandlingVelgerBackendClient from '@k9-sak-web/gui/sak/behandling-velger/BehandlingVelgerBackendClient.js';
import BehandlingVelgerSakV2 from '@k9-sak-web/gui/sak/behandling-velger/BehandlingVelgerSakIndex.js';
import FagsakProfilSakIndex from '@k9-sak-web/gui/sak/fagsak-profil/FagsakProfilSakIndex.js';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import BehandlingVelgerSakIndex from '@k9-sak-web/sak-behandling-velger';
import {
  ArbeidsgiverOpplysningerPerId,
  BehandlingAppKontekst,
  Fagsak,
  KodeverkMedNavn,
  Personopplysninger,
} from '@k9-sak-web/types';
import { BehandlingDtoType } from '@k9-sak-web/backend/k9klage/generated/types.js';
import { Location } from 'history';
import { useCallback, useContext } from 'react';
import { Navigate, useLocation, useMatch } from 'react-router';
import {
  createLocationForSkjermlenke,
  getLocationWithDefaultProsessStegAndFakta,
  pathToBehandling,
  pathToBehandlinger,
} from '../app/paths';
import BehandlingRettigheter from '../behandling/behandlingRettigheterTsType';
import BehandlingMenuIndex, { BehandlendeEnheter } from '../behandlingmenu/BehandlingMenuIndex';
import { K9sakApiKeys, restApiHooks } from '../data/k9sakApi';
import { useFpSakKodeverkMedNavn, useGetKodeverkFn } from '../data/useKodeverk';
import SakRettigheter from '../fagsak/sakRettigheterTsType';
import styles from './fagsakProfileIndex.module.css';

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
  const getKodeverkFn = useGetKodeverkFn();
  const featureToggles = useContext(FeatureTogglesContext);
  const k9SakClient = useContext(K9SakClientContext);
  const behandlingVelgerBackendClient = new BehandlingVelgerBackendClient(k9SakClient);

  const fagsakStatusMedNavn = useFpSakKodeverkMedNavn<KodeverkMedNavn>(fagsak.status);

  const { data: behandlendeEnheter } = restApiHooks.useRestApi<BehandlendeEnheter>(K9sakApiKeys.BEHANDLENDE_ENHETER, {
    ytelseType: fagsak.sakstype,
  });

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

  return (
    <div className={styles.panelPadding}>
      {!harHentetBehandlinger && <LoadingPanel />}
      {harHentetBehandlinger && shouldRedirectToBehandlinger && (
        <Navigate to={findPathToBehandling(fagsak.saksnummer, location, alleBehandlinger)} />
      )}
      {harHentetBehandlinger && !shouldRedirectToBehandlinger && (
        <FagsakProfilSakIndex
          saksnummer={fagsak.saksnummer}
          fagsakYtelseType={fagsak.sakstype}
          fagsakStatus={fagsakStatusMedNavn.kode}
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
          renderBehandlingVelger={() => {
            if (featureToggles?.BRUK_V2_BEHANDLING_VELGER) {
              const behandlingerV2 = JSON.parse(JSON.stringify(alleBehandlinger));
              const fagsakV2 = JSON.parse(JSON.stringify(fagsak));
              const erTilbakekreving = alleBehandlinger.some(
                behandling => behandling.type.kode === BehandlingDtoType.TILBAKEKREVING,
              );
              konverterKodeverkTilKode(behandlingerV2, erTilbakekreving);
              konverterKodeverkTilKode(fagsakV2, erTilbakekreving);
              return (
                <BehandlingVelgerSakV2
                  behandlinger={behandlingerV2}
                  getBehandlingLocation={getBehandlingLocation}
                  noExistingBehandlinger={alleBehandlinger.length === 0}
                  behandlingId={behandlingId}
                  fagsak={fagsakV2}
                  createLocationForSkjermlenke={createLocationForSkjermlenke}
                  api={behandlingVelgerBackendClient}
                />
              );
            }
            return (
              <BehandlingVelgerSakIndex
                behandlinger={alleBehandlinger}
                getBehandlingLocation={getBehandlingLocation}
                noExistingBehandlinger={alleBehandlinger.length === 0}
                behandlingId={behandlingId}
                getKodeverkFn={getKodeverkFn}
                fagsak={fagsak}
                createLocationForSkjermlenke={createLocationForSkjermlenke}
              />
            );
          }}
        />
      )}
    </div>
  );
};

export default requireProps(['fagsak'], <LoadingPanel />)(FagsakProfileIndex);
