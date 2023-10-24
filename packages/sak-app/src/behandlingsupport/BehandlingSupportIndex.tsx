import SupportMenySakIndex, { SupportTabs } from '@fpsak-frontend/sak-support-meny';
import { httpErrorHandler, useLocalStorage } from '@fpsak-frontend/utils';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import {
  ArbeidsgiverOpplysningerWrapper,
  BehandlingAppKontekst,
  Fagsak,
  NavAnsatt,
  Personopplysninger,
} from '@k9-sak-web/types';
import axios from 'axios';
import React, { useCallback, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { getSupportPanelLocationCreator } from '../app/paths';
import useTrackRouteParam from '../app/useTrackRouteParam';
import BehandlingRettigheter from '../behandling/behandlingRettigheterTsType';
import styles from './behandlingSupportIndex.module.css';
import DokumentIndex from './dokument/DokumentIndex';
import HistorikkIndex from './historikk/HistorikkIndex';
import MeldingIndex from './melding/MeldingIndex';
import NotaterIndex from './notater/NotaterIndex';
import TotrinnskontrollIndex from './totrinnskontroll/TotrinnskontrollIndex';

export const hentSynligePaneler = (behandlingRettigheter?: BehandlingRettigheter): string[] =>
  Object.values(SupportTabs).filter(supportPanel => {
    switch (supportPanel) {
      case SupportTabs.TIL_BESLUTTER:
        return behandlingRettigheter && behandlingRettigheter.behandlingTilGodkjenning;
      case SupportTabs.FRA_BESLUTTER:
        return behandlingRettigheter && behandlingRettigheter.behandlingFraBeslutter;
      default:
        return true;
    }
  });

export const hentValgbarePaneler = (
  synligePaneler: string[],
  sendMeldingErRelevant: boolean,
  behandlingRettigheter?: BehandlingRettigheter,
): string[] =>
  synligePaneler.filter(supportPanel => {
    if (supportPanel === SupportTabs.MELDINGER) {
      return behandlingRettigheter && sendMeldingErRelevant ? behandlingRettigheter.behandlingKanSendeMelding : false;
    }
    return true;
  });

interface OwnProps {
  fagsak: Fagsak;
  alleBehandlinger: BehandlingAppKontekst[];
  behandlingId?: number;
  behandlingVersjon?: number;
  behandlingRettigheter?: BehandlingRettigheter;
  personopplysninger?: Personopplysninger;
  arbeidsgiverOpplysninger?: ArbeidsgiverOpplysningerWrapper;
  navAnsatt: NavAnsatt;
}

/**
 * BehandlingSupportIndex
 *
 * Har ansvar for å lage navigasjonsrad med korrekte navigasjonsvalg, og route til rett
 * støttepanelkomponent ihht. gitt parameter i URL-en.
 */
const BehandlingSupportIndex = ({
  fagsak,
  alleBehandlinger,
  behandlingId,
  behandlingVersjon,
  behandlingRettigheter,
  personopplysninger,
  arbeidsgiverOpplysninger,
  navAnsatt,
}: OwnProps) => {
  const { addErrorMessage } = useRestApiErrorDispatcher();
  const [antallUlesteNotater, setAntallUlesteNotater] = useState(0);
  const [lesteNotater] = useLocalStorage('lesteNotater', []);

  const getNotater = (signal: AbortSignal) => {
    axios
      .get(`/k9/sak/api/notat`, {
        signal,
        params: {
          saksnummer: fagsak.saksnummer,
        },
      })
      .then(response => {
        const ulesteNotater = response.data.filter(
          notat => lesteNotater.findIndex(lestNotatId => lestNotatId === notat.notatId) === -1,
        );
        setAntallUlesteNotater(ulesteNotater.length);
      })
      .catch(error => {
        httpErrorHandler(error?.response?.status, addErrorMessage, error?.response?.headers?.location);
      });
  };

  useQuery('notater', ({ signal }) => getNotater(signal));

  const { selected: valgtSupportPanel, location } = useTrackRouteParam<string>({
    paramName: 'stotte',
    isQueryParam: true,
  });

  const behandling = alleBehandlinger.find(b => b.id === behandlingId);

  const navigate = useNavigate();

  const erPaVent = behandling ? behandling.behandlingPaaVent : false;
  const erSendMeldingRelevant = fagsak && !erPaVent;

  const synligeSupportPaneler = useMemo(() => hentSynligePaneler(behandlingRettigheter), [behandlingRettigheter]);
  const valgbareSupportPaneler = useMemo(
    () => hentValgbarePaneler(synligeSupportPaneler, erSendMeldingRelevant, behandlingRettigheter),
    [synligeSupportPaneler, erSendMeldingRelevant, behandlingRettigheter],
  );

  const defaultSupportPanel = valgbareSupportPaneler.find(() => true) || SupportTabs.HISTORIKK;
  const aktivtSupportPanel = valgbareSupportPaneler.includes(valgtSupportPanel)
    ? valgtSupportPanel
    : defaultSupportPanel;

  const changeRouteCallback = useCallback(
    index => {
      const supportPanel = synligeSupportPaneler[index];
      const getSupportPanelLocation = getSupportPanelLocationCreator(location);
      navigate(getSupportPanelLocation(supportPanel));
    },
    [location, synligeSupportPaneler],
  );

  return (
    <>
      <div className={styles.meny}>
        <SupportMenySakIndex
          tilgjengeligeTabs={synligeSupportPaneler}
          valgbareTabs={valgbareSupportPaneler}
          valgtIndex={synligeSupportPaneler.findIndex(p => p === aktivtSupportPanel)}
          onClick={changeRouteCallback}
          antallUlesteNotater={antallUlesteNotater}
        />
      </div>
      <div className={aktivtSupportPanel === SupportTabs.HISTORIKK ? styles.containerHistorikk : styles.container}>
        {(aktivtSupportPanel === SupportTabs.TIL_BESLUTTER || aktivtSupportPanel === SupportTabs.FRA_BESLUTTER) && (
          <TotrinnskontrollIndex
            fagsak={fagsak}
            alleBehandlinger={alleBehandlinger}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
          />
        )}
        {aktivtSupportPanel === SupportTabs.HISTORIKK && (
          <HistorikkIndex
            saksnummer={fagsak.saksnummer}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
          />
        )}
        {aktivtSupportPanel === SupportTabs.MELDINGER && (
          <MeldingIndex
            fagsak={fagsak}
            alleBehandlinger={alleBehandlinger}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            personopplysninger={personopplysninger}
            arbeidsgiverOpplysninger={arbeidsgiverOpplysninger}
          />
        )}
        {aktivtSupportPanel === SupportTabs.DOKUMENTER && (
          <DokumentIndex
            saksnummer={fagsak.saksnummer}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            fagsak={fagsak}
            behandlingUuid={behandling?.uuid}
          />
        )}
        {aktivtSupportPanel === SupportTabs.NOTATER && (
          <NotaterIndex
            saksnummer={fagsak.saksnummer}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            fagsakPerson={fagsak.person}
            navAnsatt={navAnsatt}
          />
        )}
      </div>
    </>
  );
};

export default BehandlingSupportIndex;
