import FagsakProfilSakIndex from '@fpsak-frontend/sak-fagsak-profil';
import { LoadingPanel, requireProps } from '@fpsak-frontend/shared-components';
import BehandlingVelgerSakV2 from '@k9-sak-web/gui/sak/behandling-velger/BehandlingVelgerSakIndex.js';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import BehandlingRettigheter from '@k9-sak-web/sak-app/src/behandling/behandlingRettigheterTsType';
import SakRettigheter from '@k9-sak-web/sak-app/src/fagsak/sakRettigheterTsType';
import {
  ArbeidsgiverOpplysningerPerId,
  BehandlingAppKontekst,
  Fagsak,
  KodeverkMedNavn,
  Personopplysninger,
} from '@k9-sak-web/types';
import { behandlingType } from '@navikt/k9-klage-typescript-client';
import { Location } from 'history';
import { useCallback } from 'react';
import { Navigate, useLocation, useMatch } from 'react-router';
import {
  createLocationForSkjermlenke,
  getLocationWithDefaultProsessStegAndFakta,
  pathToBehandling,
  pathToBehandlinger,
} from '../app/paths';
import BehandlingMenuIndex, { BehandlendeEnheter } from '../behandlingmenu/BehandlingMenuIndex';
import { UngSakApiKeys, restApiHooks } from '../data/ungsakApi';
import { useUngSakKodeverkMedNavn } from '../data/useKodeverk';
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
  const fagsakStatusMedNavn = useUngSakKodeverkMedNavn<KodeverkMedNavn>(fagsak.status);

  const { data: behandlendeEnheter } = restApiHooks.useRestApi<BehandlendeEnheter>(UngSakApiKeys.BEHANDLENDE_ENHETER, {
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
          renderBehandlingVelger={() => {
            const behandlingerV2 = JSON.parse(JSON.stringify(alleBehandlinger));
            const fagsakV2 = JSON.parse(JSON.stringify(fagsak));
            const erTilbakekreving = alleBehandlinger.some(
              behandling => behandling.type.kode === behandlingType.BT_007,
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
              />
            );
          }}
        />
      )}
    </div>
  );
};

export default requireProps(['fagsak'], <LoadingPanel />)(FagsakProfileIndex);
