import SupportMenySakIndex, { SupportTabs } from '@fpsak-frontend/sak-support-meny';
import { httpErrorHandler } from '@fpsak-frontend/utils';
import { apiPaths } from '@k9-sak-web/rest-api';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import {
  ArbeidsgiverOpplysningerWrapper,
  BehandlingAppKontekst,
  Fagsak,
  FeatureToggles,
  NavAnsatt,
  NotatResponse,
  Personopplysninger,
} from '@k9-sak-web/types';
import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import MeldingBackendClient from './melding/MeldingBackendClient';

export const hentSynligePaneler = (
  behandlingRettigheter?: BehandlingRettigheter,
  featureToggles?: FeatureToggles,
): string[] =>
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
  featureToggles?: FeatureToggles;
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
  featureToggles,
}: OwnProps) => {
  const { addErrorMessage } = useRestApiErrorDispatcher();
  const [antallUlesteNotater, setAntallUlesteNotater] = useState(0);

  const getNotater = (signal: AbortSignal) =>
    axios
      .get<NotatResponse[]>(apiPaths.notatISak, {
        signal,
        params: {
          saksnummer: fagsak.saksnummer,
        },
      })
      .then(({ data }) => data)
      .catch(error => {
        httpErrorHandler(error?.response?.status, addErrorMessage, error?.response?.headers?.location);
      });

  const notaterQueryKey = ['notater', fagsak?.saksnummer];
  const { data: notater } = useQuery({
    queryKey: notaterQueryKey,
    queryFn: ({ signal }) => getNotater(signal),
    enabled: !!fagsak,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const ulesteNotater = (notater || []).filter(notat => !notat.skjult);
    setAntallUlesteNotater(ulesteNotater?.length);
  }, [notater]);

  const { selected: valgtSupportPanel, location } = useTrackRouteParam<string>({
    paramName: 'stotte',
    isQueryParam: true,
  });

  const behandling = alleBehandlinger.find(b => b.id === behandlingId);

  const navigate = useNavigate();

  const erPaVent = behandling ? behandling.behandlingPaaVent : false;
  const erSendMeldingRelevant = fagsak && !erPaVent;

  const synligeSupportPaneler = useMemo(
    () => hentSynligePaneler(behandlingRettigheter, featureToggles),
    [behandlingRettigheter, featureToggles],
  );
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
            backendApi={new MeldingBackendClient()}
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
        {aktivtSupportPanel === SupportTabs.NOTATER && <NotaterIndex navAnsatt={navAnsatt} fagsak={fagsak} />}
      </div>
    </>
  );
};

export default BehandlingSupportIndex;
