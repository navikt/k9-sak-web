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
import {
  ArrowUndoIcon,
  ClockDashedIcon,
  FolderFillIcon,
  FolderIcon,
  PaperplaneFillIcon,
  PaperplaneIcon,
  PencilWritingFillIcon,
  PencilWritingIcon,
  PersonGavelFillIcon,
  PersonGavelIcon,
} from '@navikt/aksel-icons';
import { BodyShort, Tabs, Tooltip } from '@navikt/ds-react';
import axios from 'axios';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { K9SakClientContext } from '@k9-sak-web/gui/app/K9SakClientContext.js';
import MeldingerBackendClient from '@k9-sak-web/gui/sak/meldinger/MeldingerBackendClient.js';
import { FormidlingClientContext } from '@k9-sak-web/gui/app/FormidlingClientContext.js';
import { getSupportPanelLocationCreator } from '../app/paths';
import useTrackRouteParam from '../app/useTrackRouteParam';
import BehandlingRettigheter from '../behandling/behandlingRettigheterTsType';
import styles from './behandlingSupportIndex.module.css';
import DokumentIndex from './dokument/DokumentIndex';
import HistorikkIndex from './historikk/HistorikkIndex';
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
  isActive: boolean;
}

const TABS = {
  [SupportTabs.TIL_BESLUTTER]: {
    getSvg: ({ tooltip, isActive }: GetSvgProps) =>
      isActive ? (
        <PersonGavelFillIcon title={tooltip} fontSize="1.625rem" />
      ) : (
        <PersonGavelIcon title={tooltip} fontSize="1.625rem" />
      ),
    tooltipTextCode: 'Til beslutter',
    tabKey: SupportTabs.TIL_BESLUTTER,
  },
  [SupportTabs.FRA_BESLUTTER]: {
    getSvg: ({ tooltip }: GetSvgProps) => (
      <ArrowUndoIcon title={tooltip} fontSize="1.625rem" style={{ transform: 'rotateX(180deg)' }} />
    ),
    tooltipTextCode: 'Fra beslutter',
    tabKey: SupportTabs.FRA_BESLUTTER,
  },
  [SupportTabs.HISTORIKK]: {
    getSvg: ({ tooltip }: GetSvgProps) => <ClockDashedIcon title={tooltip} fontSize="1.625rem" />,
    tooltipTextCode: 'Historikk',
    tabKey: SupportTabs.HISTORIKK,
  },
  [SupportTabs.MELDINGER]: {
    getSvg: ({ tooltip, isActive }: GetSvgProps) =>
      isActive ? (
        <PaperplaneFillIcon title={tooltip} fontSize="1.625rem" />
      ) : (
        <PaperplaneIcon title={tooltip} fontSize="1.625rem" />
      ),
    tooltipTextCode: 'Send melding',
    tabKey: SupportTabs.MELDINGER,
  },
  [SupportTabs.DOKUMENTER]: {
    getSvg: ({ tooltip, isActive }: GetSvgProps) =>
      isActive ? (
        <FolderFillIcon title={tooltip} fontSize="1.625rem" />
      ) : (
        <FolderIcon title={tooltip} fontSize="1.625rem" />
      ),
    tooltipTextCode: 'Dokumenter',
    tabKey: SupportTabs.DOKUMENTER,
  },
  [SupportTabs.NOTATER]: {
    getSvg: ({ antallUlesteNotater, isActive }: GetSvgProps) => (
      <div className={styles.pencilSvgContainer}>
        {antallUlesteNotater > 0 && <div className={styles.ulesteNotater}>{antallUlesteNotater}</div>}
        {isActive ? (
          <PencilWritingFillIcon title="Notater" fontSize="1.625rem" className={styles.pencilSvg} />
        ) : (
          <PencilWritingIcon title="Notater" fontSize="1.625rem" className={styles.pencilSvg} />
        )}
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

  const k9SakClient = useContext(K9SakClientContext);
  const formidlingClient = useContext(FormidlingClientContext);
  const meldingerBackendClient = new MeldingerBackendClient(k9SakClient, formidlingClient);

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

  const lagTabs = (tilgjengeligeTabs: string[], valgtIndex?: number) =>
    Object.keys(TABS)
      .filter(key => tilgjengeligeTabs.includes(key))
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

  const defaultSupportPanel = synligeSupportPaneler.find(() => true) || SupportTabs.HISTORIKK;
  const aktivtSupportPanel = synligeSupportPaneler.includes(valgtSupportPanel)
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

  const tabs = useMemo(() => lagTabs(synligeSupportPaneler, valgtIndex), [synligeSupportPaneler, valgtIndex]);

  const isPanelDisabled = () => (valgtSupportPanel ? !valgbareSupportPaneler.includes(valgtSupportPanel) : false);

  return (
    <Tabs defaultValue={aktivtSupportPanel} className={styles.tablistWrapper}>
      <div className={styles.meny}>
        <Tabs.List className={styles.tablist}>
          {tabs.map((tab, index) => (
            <Tabs.Tab
              key={tab.tooltip}
              value={tab.tabKey}
              icon={
                <Tooltip content={tab.tooltip}>
                  {tab.getSvg({
                    tooltip: tab.tooltip,
                    antallUlesteNotater: tab.antallUlesteNotater,
                    isActive: tab.isActive,
                  })}
                </Tooltip>
              }
              onClick={() => {
                changeRouteCallback(index);
              }}
              className={styles.tabButton}
            />
          ))}
        </Tabs.List>
      </div>
      <div className={aktivtSupportPanel === SupportTabs.HISTORIKK ? styles.containerHistorikk : styles.container}>
        {isPanelDisabled() && <BodyShort>Dette panelet er ikke tilgjengelig</BodyShort>}
        <div hidden={isPanelDisabled()}>
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
            {behandlingId && (
              <MeldingIndex
                fagsak={fagsak}
                alleBehandlinger={alleBehandlinger}
                behandlingId={behandlingId}
                behandlingVersjon={behandlingVersjon}
                personopplysninger={personopplysninger}
                arbeidsgiverOpplysninger={arbeidsgiverOpplysninger}
                featureToggles={featureToggles}
                backendApi={meldingerBackendClient}
              />
            )}
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
      </div>
    </Tabs>
  );
};

export default BehandlingSupportIndex;
