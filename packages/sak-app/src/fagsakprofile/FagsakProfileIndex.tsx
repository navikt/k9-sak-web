import { LoadingPanel } from '@k9-sak-web/gui/shared/loading-panel/LoadingPanel.js';
import { requireProps } from '@fpsak-frontend/shared-components';
import { k9_klage_kodeverk_behandling_BehandlingType as KlageBehandlingType } from '@k9-sak-web/backend/k9klage/generated/types.js';
import BehandlingVelgerBackendClient from '@k9-sak-web/gui/sak/behandling-velger/BehandlingVelgerBackendClient.js';
import BehandlingVelgerSakV2 from '@k9-sak-web/gui/sak/behandling-velger/BehandlingVelgerSakIndex.js';
import FagsakProfilSakIndex from '@k9-sak-web/gui/sak/fagsak-profil/FagsakProfilSakIndex.js';
import { k9SakOrUngSak } from '@k9-sak-web/gui/utils/multibackend.js';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import {
  ArbeidsgiverOpplysningerPerId,
  BehandlingAppKontekst,
  Fagsak,
  KodeverkMedNavn,
  Personopplysninger,
} from '@k9-sak-web/types';
import { Location } from 'history';
import { useCallback, useMemo } from 'react';
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
import { useFpSakKodeverkMedNavn } from '../data/useKodeverk';
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

const behandlingVelgerBackendClient = new BehandlingVelgerBackendClient(k9SakOrUngSak.k9Sak);

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

  const { behandlingerV2, fagsakV2 } = useMemo(() => {
    const behandlingerCopy = JSON.parse(JSON.stringify(alleBehandlinger));
    const fagsakCopy = JSON.parse(JSON.stringify(fagsak));

    behandlingerCopy.forEach(behandling => {
      const erTilbakekreving = behandling.type.kode === KlageBehandlingType.TILBAKEKREVING;
      konverterKodeverkTilKode(behandling, erTilbakekreving);
    });
    konverterKodeverkTilKode(fagsakCopy, false);

    return {
      behandlingerV2: behandlingerCopy,
      fagsakV2: fagsakCopy,
    };
  }, [alleBehandlinger, fagsak]);

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
          }}
        />
      )}
    </div>
  );
};

export default requireProps(['fagsak'], <LoadingPanel />)(FagsakProfileIndex);
