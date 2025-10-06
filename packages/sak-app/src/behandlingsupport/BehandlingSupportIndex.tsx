import { FormidlingClientContext } from '@k9-sak-web/gui/app/FormidlingClientContext.js';
import MeldingerBackendClient from '@k9-sak-web/gui/sak/meldinger/MeldingerBackendClient.js';
import NotatBackendClient from '@k9-sak-web/gui/sak/notat/NotatBackendClient.js';
import {
  ArbeidsgiverOpplysningerWrapper,
  BehandlingAppKontekst,
  Fagsak,
  FeatureToggles,
  NavAnsatt,
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
import { useQuery } from '@tanstack/react-query';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { getSupportPanelLocationCreator } from '../app/paths';
import useTrackRouteParam from '../app/useTrackRouteParam';
import BehandlingRettigheter from '../behandling/behandlingRettigheterTsType';
import styles from './behandlingSupportIndex.module.css';
import DokumentIndex from './dokument/DokumentIndex';
import HistorikkIndex from '@k9-sak-web/gui/behandling/support/historikk/k9/HistorikkIndex.js';
import MeldingIndex from './melding/MeldingIndex';
import Notater from './notater/Notater';
import SupportTabs from './supportTabs';
import TotrinnskontrollIndex from './totrinnskontroll/TotrinnskontrollIndex';
import { HistorikkBackendClient } from '@k9-sak-web/gui/behandling/support/historikk/k9/HistorikkBackendClient.js';
import { K9KodeverkoppslagContext } from '@k9-sak-web/gui/kodeverk/oppslag/K9KodeverkoppslagContext.js';
import HistorikkBackendApiContext from '@k9-sak-web/gui/behandling/support/historikk/k9/HistorikkBackendApiContext.js';
import { TotrinnskontrollApi } from '@k9-sak-web/gui/behandling/support/totrinnskontroll/TotrinnskontrollApi.js';
import { BehandlingType } from '@k9-sak-web/backend/combined/kodeverk/behandling/BehandlingType.js';
import { K9TilbakeTotrinnskontrollBackendClient } from '@k9-sak-web/gui/behandling/support/totrinnskontroll/k9/K9TilbakeTotrinnskontrollBackendClient.js';
import { K9KlageTotrinnskontrollBackendClient } from '@k9-sak-web/gui/behandling/support/totrinnskontroll/k9/K9KlageTotrinnskontrollBackendClient.js';
import { K9SakTotrinnskontrollBackendClient } from '@k9-sak-web/gui/behandling/support/totrinnskontroll/k9/K9SakTotrinnskontrollBackendClient.js';

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
  behandlingRettigheter?: BehandlingRettigheter,
): string[] =>
  synligePaneler.filter(supportPanel => {
    if (supportPanel === SupportTabs.MELDINGER) {
      return behandlingRettigheter ? behandlingRettigheter.behandlingKanSendeMelding : false;
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
  behandlingId: number;
  behandlingVersjon: number;
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
  const [antallUlesteNotater, setAntallUlesteNotater] = useState(0);

  const kodeverkoppslag = useContext(K9KodeverkoppslagContext);
  const formidlingClient = useContext(FormidlingClientContext);
  const meldingerBackendClient = new MeldingerBackendClient(formidlingClient);
  const historikkBackendClient = new HistorikkBackendClient(kodeverkoppslag);
  const notatBackendClient = new NotatBackendClient('k9Sak');

  const notaterQueryKey = ['notater', fagsak?.saksnummer];
  const { data: notater } = useQuery({
    queryKey: notaterQueryKey,
    queryFn: () => notatBackendClient.getNotater(fagsak.saksnummer),
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

  const synligeSupportPaneler = useMemo(() => hentSynligePaneler(behandlingRettigheter), [behandlingRettigheter]);
  const valgbareSupportPaneler = useMemo(
    () => hentValgbarePaneler(synligeSupportPaneler, behandlingRettigheter),
    [synligeSupportPaneler, behandlingRettigheter],
  );

  const defaultSupportPanel = synligeSupportPaneler.find(() => true) || SupportTabs.HISTORIKK;
  const aktivtSupportPanel = synligeSupportPaneler.includes(valgtSupportPanel)
    ? valgtSupportPanel
    : defaultSupportPanel;

  const changeRouteCallback = useCallback(
    async index => {
      const supportPanel = synligeSupportPaneler[index];
      const getSupportPanelLocation = getSupportPanelLocationCreator(location);
      await navigate(getSupportPanelLocation(supportPanel));
    },
    [location, synligeSupportPaneler],
  );

  const valgtIndex = synligeSupportPaneler.findIndex(p => p === aktivtSupportPanel);

  const tabs = useMemo(
    () => lagTabs(synligeSupportPaneler, valgtIndex),
    [synligeSupportPaneler, valgtIndex, antallUlesteNotater],
  );

  const behandlingTypeKode = behandling?.type.kode;
  const totrinnskontrollApi: TotrinnskontrollApi = useMemo(() => {
    const erTilbakekreving =
      behandlingTypeKode == BehandlingType.TILBAKEKREVING ||
      behandlingTypeKode == BehandlingType.REVURDERING_TILBAKEKREVING;
    const erKlage = behandlingTypeKode == BehandlingType.KLAGE;
    if (erTilbakekreving) {
      return new K9TilbakeTotrinnskontrollBackendClient(kodeverkoppslag.k9tilbake);
    }
    if (erKlage) {
      return new K9KlageTotrinnskontrollBackendClient(kodeverkoppslag.k9klage);
    }
    return new K9SakTotrinnskontrollBackendClient(kodeverkoppslag.k9sak);
  }, [behandlingTypeKode, kodeverkoppslag]);
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
              onClick={async () => {
                await changeRouteCallback(index);
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
              api={totrinnskontrollApi}
            />
          </Tabs.Panel>
          <Tabs.Panel value={SupportTabs.FRA_BESLUTTER}>
            <TotrinnskontrollIndex
              fagsak={fagsak}
              alleBehandlinger={alleBehandlinger}
              behandlingId={behandlingId}
              api={totrinnskontrollApi}
            />
          </Tabs.Panel>
          <Tabs.Panel value={SupportTabs.HISTORIKK}>
            {behandlingId !== undefined && (
              <HistorikkBackendApiContext value={historikkBackendClient}>
                <HistorikkIndex
                  saksnummer={fagsak.saksnummer}
                  behandlingId={behandlingId}
                  behandlingVersjon={behandlingVersjon}
                />
              </HistorikkBackendApiContext>
            )}
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
              featureToggles={featureToggles}
            />
          </Tabs.Panel>
          <Tabs.Panel value={SupportTabs.NOTATER}>
            <Notater navAnsatt={navAnsatt} fagsak={fagsak} />
          </Tabs.Panel>
        </div>
      </div>
    </Tabs>
  );
};

export default BehandlingSupportIndex;
