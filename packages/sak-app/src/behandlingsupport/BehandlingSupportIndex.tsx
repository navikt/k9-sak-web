import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import SupportMenySakIndex, { SupportTabs } from '@fpsak-frontend/sak-support-meny';
import { Fagsak, BehandlingAppKontekst, Personopplysninger, ArbeidsgiverOpplysningerWrapper } from '@k9-sak-web/types';

import { getSupportPanelLocationCreator } from '../app/paths';
import HistorikkIndex from './historikk/HistorikkIndex';
import MeldingIndex from './melding/MeldingIndex';
import DokumentIndex from './dokument/DokumentIndex';
import TotrinnskontrollIndex from './totrinnskontroll/TotrinnskontrollIndex';
import useTrackRouteParam from '../app/useTrackRouteParam';
import styles from './behandlingSupportIndex.less';
import BehandlingRettigheter from '../behandling/behandlingRettigheterTsType';

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
}

/**
 * BehandlingSupportIndex
 *
 * Har ansvar for å lage navigasjonsrad med korrekte navigasjonsvalg, og route til rett
 * støttepanelkomponent ihht. gitt parameter i URL-en.
 */
const BehandlingSupportIndex: FunctionComponent<OwnProps> = ({
  fagsak,
  alleBehandlinger,
  behandlingId,
  behandlingVersjon,
  behandlingRettigheter,
  personopplysninger,
  arbeidsgiverOpplysninger,
}) => {
  const { selected: valgtSupportPanel, location } = useTrackRouteParam<string>({
    paramName: 'stotte',
    isQueryParam: true,
  });

  const behandling = alleBehandlinger.find(b => b.id === behandlingId);

  const history = useHistory();

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
      history.push(getSupportPanelLocation(supportPanel));
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
          />
        )}
      </div>
    </>
  );
};

export default BehandlingSupportIndex;
