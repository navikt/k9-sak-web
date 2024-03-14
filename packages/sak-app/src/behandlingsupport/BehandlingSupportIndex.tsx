import { httpErrorHandler } from '@fpsak-frontend/utils';
import { K9SakClientContext } from '@k9-sak-web/gui/app/K9SakClientContext.js';
import MeldingerBackendClient from '@k9-sak-web/gui/sak/meldinger/MeldingerBackendClient.js';
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
import {
  ArrowUndoIcon,
  ClockDashedIcon,
  FolderIcon,
  PaperplaneIcon,
  PencilWritingIcon,
  PersonGavelIcon,
} from '@navikt/aksel-icons';
import { Tabs } from '@navikt/ds-react';
import axios from 'axios';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { getSupportPanelLocationCreator } from '../app/paths';
import useTrackRouteParam from '../app/useTrackRouteParam';
import BehandlingRettigheter from '../behandling/behandlingRettigheterTsType';
import styles from './behandlingSupportIndex.module.css';
import DokumentIndex from './dokument/DokumentIndex';
import HistorikkIndex from './historikk/HistorikkIndex';
import MeldingBackendClient from './melding/MeldingBackendClient';
import MeldingIndex from './melding/MeldingIndex';
import NotaterIndex from './notater/NotaterIndex';
import SupportTabs from './supportTabs';
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

interface GetSvgProps {
  tooltip: string;
  antallUlesteNotater: number;
}

const TABS = {
  [SupportTabs.TIL_BESLUTTER]: {
    getSvg: ({ tooltip }: GetSvgProps) => <PersonGavelIcon title={tooltip} fontSize="1.625rem" />,
    tooltipTextCode: 'SupportMenySakIndex.Godkjenning',
    tabKey: SupportTabs.TIL_BESLUTTER,
  },
  [SupportTabs.FRA_BESLUTTER]: {
    getSvg: ({ tooltip }: GetSvgProps) => (
      <ArrowUndoIcon title={tooltip} fontSize="1.625rem" style={{ transform: 'rotateX(180deg)' }} />
    ),
    tooltipTextCode: 'SupportMenySakIndex.FraBeslutter',
    tabKey: SupportTabs.FRA_BESLUTTER,
  },
  [SupportTabs.HISTORIKK]: {
    getSvg: ({ tooltip }: GetSvgProps) => <ClockDashedIcon title={tooltip} fontSize="1.625rem" />,
    tooltipTextCode: 'Historikk',
    tabKey: SupportTabs.HISTORIKK,
  },
  [SupportTabs.MELDINGER]: {
    getSvg: ({ tooltip }: GetSvgProps) => <PaperplaneIcon title={tooltip} fontSize="1.625rem" />,
    tooltipTextCode: 'Send melding',
    tabKey: SupportTabs.MELDINGER,
  },
  [SupportTabs.DOKUMENTER]: {
    getSvg: ({ tooltip }: GetSvgProps) => <FolderIcon title={tooltip} fontSize="1.625rem" />,
    tooltipTextCode: 'Dokumenter',
    tabKey: SupportTabs.DOKUMENTER,
  },
  [SupportTabs.NOTATER]: {
    getSvg: ({ antallUlesteNotater }: GetSvgProps) => (
      <div className={styles.pencilSvgContainer}>
        {antallUlesteNotater > 0 && <div className={styles.ulesteNotater}>{antallUlesteNotater}</div>}
        <PencilWritingIcon title="Notater" fontSize="1.625rem" className={styles.pencilSvg} />
      </div>
    ),
    tooltipTextCode: 'Notater',
    tabKey: SupportTabs.NOTATER,
  },
};

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

  const meldingerBackendClientFactory = useCallback(() => {
    const k9SakClient = useContext(K9SakClientContext);
    if (featureToggles?.USE_NEW_BACKEND_CLIENT === true) {
      return new MeldingerBackendClient(k9SakClient);
    }
    return new MeldingBackendClient();
  }, [K9SakClientContext, featureToggles]);

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

  const lagTabs = (tilgjengeligeTabs: string[], valgbareTabs: string[], valgtIndex?: number) =>
    Object.keys(TABS)
      .filter(key => tilgjengeligeTabs.includes(key))
      .filter(key => valgbareTabs.includes(key))
      .map((key, index) => ({
        getSvg: TABS[key].getSvg,
        tooltip: TABS[key].tooltipTextCode,
        isActive: index === valgtIndex,
        antallUlesteNotater,
        tabKey: TABS[key].tabKey,
      }));

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

  const valgtIndex = synligeSupportPaneler.findIndex(p => p === aktivtSupportPanel);

  const tabs = useMemo(
    () => lagTabs(synligeSupportPaneler, valgbareSupportPaneler, valgtIndex),
    [synligeSupportPaneler, valgbareSupportPaneler, valgtIndex],
  );

  return (
    <Tabs defaultValue={valgtSupportPanel} className={styles.tablistWrapper}>
      <div className={styles.meny}>
        <Tabs.List className={styles.tablist}>
          {tabs.map((tab, index) => (
            <Tabs.Tab
              key={tab.tooltip}
              value={tab.tabKey}
              icon={tab.getSvg({
                tooltip: tab.tooltip,
                antallUlesteNotater: tab.antallUlesteNotater,
              })}
              onClick={() => {
                changeRouteCallback(index);
              }}
              className={styles.tabButton}
            />
          ))}
        </Tabs.List>
      </div>
      <div className={aktivtSupportPanel === SupportTabs.HISTORIKK ? styles.containerHistorikk : styles.container}>
        <Tabs.Panel value={SupportTabs.TIL_BESLUTTER}>
          <TotrinnskontrollIndex
            fagsak={fagsak}
            alleBehandlinger={alleBehandlinger}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
          />
        </Tabs.Panel>
        <Tabs.Panel value={SupportTabs.FRA_BESLUTTER}>
          <TotrinnskontrollIndex
            fagsak={fagsak}
            alleBehandlinger={alleBehandlinger}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
          />
        </Tabs.Panel>
        <Tabs.Panel value={SupportTabs.HISTORIKK}>
          <HistorikkIndex
            saksnummer={fagsak.saksnummer}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
          />
        </Tabs.Panel>
        <Tabs.Panel value={SupportTabs.MELDINGER}>
          <MeldingIndex
            fagsak={fagsak}
            alleBehandlinger={alleBehandlinger}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            personopplysninger={personopplysninger}
            arbeidsgiverOpplysninger={arbeidsgiverOpplysninger}
            backendApi={meldingerBackendClientFactory()}
          />
        </Tabs.Panel>
        <Tabs.Panel value={SupportTabs.DOKUMENTER}>
          <DokumentIndex
            saksnummer={fagsak.saksnummer}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            fagsak={fagsak}
            behandlingUuid={behandling?.uuid}
          />
        </Tabs.Panel>
        <Tabs.Panel value={SupportTabs.NOTATER}>
          <NotaterIndex navAnsatt={navAnsatt} fagsak={fagsak} />
        </Tabs.Panel>
      </div>
    </Tabs>
  );
};

export default BehandlingSupportIndex;
