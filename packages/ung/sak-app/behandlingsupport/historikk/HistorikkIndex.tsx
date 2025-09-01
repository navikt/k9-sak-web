import HistorikkSakIndex from '@fpsak-frontend/sak-historikk';
import { usePrevious } from '@fpsak-frontend/shared-components';
import { LoadingPanel } from '@k9-sak-web/gui/shared/loading-panel/LoadingPanel.js';
import { Kjønn } from '@k9-sak-web/backend/k9sak/kodeverk/Kjønn.js';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/hooks/useKodeverkContext.js';
import { Snakkeboble } from '@k9-sak-web/gui/sak/historikk/snakkeboble/Snakkeboble.js';
import { HistorikkinnslagV2 } from '@k9-sak-web/gui/sak/historikk/tilbake/historikkinnslagTsTypeV2.js';
import { isRequestNotDone } from '@k9-sak-web/rest-api-hooks/src/RestApiState';
import ApplicationContextPath from '@k9-sak-web/sak-app/src/app/ApplicationContextPath';
import { Historikkinnslag, KodeverkMedNavn } from '@k9-sak-web/types';
import dayjs from 'dayjs';
import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router';
import { createLocationForSkjermlenke, pathToBehandling } from '../../app/paths';
import useGetEnabledApplikasjonContext from '../../app/useGetEnabledApplikasjonContext';
import useBehandlingEndret from '../../behandling/useBehandlingEndret';
import { restApiHooks, UngSakApiKeys } from '../../data/ungsakApi';

type UngSakHistorikkinnslagV2 = HistorikkinnslagV2 & {
  historikkinnslagUuid?: string;
  erKlage?: never;
  erTilbakekreving?: never;
  erSak: boolean;
};

type KlageHistorikkInnslagV1 = Historikkinnslag & {
  erKlage: boolean;
  erTilbakekreving?: never;
  erSak?: never;
};

type TilbakeHistorikkInnslagV1 = Historikkinnslag & {
  erKlage?: never;
  erTilbakekreving: boolean;
  erSak?: never;
};

type UlikeHistorikkinnslagTyper = UngSakHistorikkinnslagV2 | KlageHistorikkInnslagV1 | TilbakeHistorikkInnslagV1;

const sortAndTagUlikeHistorikkinnslagTyper = (
  historikkUngsak: HistorikkinnslagV2[] = [],
  historikkTilbake: Historikkinnslag[] = [],
  historikkKlage: Historikkinnslag[] = [],
): UlikeHistorikkinnslagTyper[] => {
  return [
    ...historikkTilbake.map(v => ({ ...v, erTilbakekreving: true })),
    ...historikkKlage.map(v => ({ ...v, erKlage: true })),
    ...historikkUngsak.map(v => ({ ...v, erSak: true })),
  ].toSorted((a, b) => dayjs(b.opprettetTidspunkt).diff(a.opprettetTidspunkt));
};

interface OwnProps {
  saksnummer: string;
  behandlingId: number;
  behandlingVersjon?: number;
  kjønn: Kjønn;
}

/**
 * HistorikkIndex
 *
 * Container komponent. Har ansvar for å hente historiken for en fagsak fra state og vise den
 */
const HistorikkIndex = ({ saksnummer, behandlingId, behandlingVersjon, kjønn }: OwnProps) => {
  const enabledApplicationContexts = useGetEnabledApplikasjonContext();
  const { getKodeverkNavnFraKodeFn } = useKodeverkContext();

  const alleKodeverkUngSak = restApiHooks.useGlobalStateRestApiData<{ [key: string]: KodeverkMedNavn[] }>(
    UngSakApiKeys.KODEVERK,
  );
  const alleKodeverkTilbake = restApiHooks.useGlobalStateRestApiData<{ [key: string]: KodeverkMedNavn[] }>(
    UngSakApiKeys.KODEVERK_TILBAKE,
  );
  const alleKodeverkKlage = restApiHooks.useGlobalStateRestApiData<{ [key: string]: KodeverkMedNavn[] }>(
    UngSakApiKeys.KODEVERK_KLAGE,
  );

  const location = useLocation();
  const getBehandlingLocation = useCallback(
    (behandlingId: number) => ({
      ...location,
      pathname: pathToBehandling(saksnummer, behandlingId),
    }),
    [location, saksnummer],
  );

  const skalBrukeFpTilbakeHistorikk = enabledApplicationContexts.includes(ApplicationContextPath.TILBAKE);
  const skalBrukeKlageHistorikk = enabledApplicationContexts.includes(ApplicationContextPath.KLAGE);
  const erBehandlingEndretFraUndefined = useBehandlingEndret(behandlingId, behandlingVersjon);
  const forrigeSaksnummer = usePrevious(saksnummer);
  const erBehandlingEndret: boolean =
    forrigeSaksnummer !== undefined && forrigeSaksnummer.length > 0 && erBehandlingEndretFraUndefined;

  const { data: historikkUngSak, state: historikkUngSakState } = restApiHooks.useRestApi<HistorikkinnslagV2[]>(
    UngSakApiKeys.HISTORY_UNGSAK,
    { saksnummer },
    {
      updateTriggers: [behandlingId, behandlingVersjon],
      suspendRequest: erBehandlingEndret,
    },
  );

  const { data: historikkTilbake, state: historikkTilbakeState } = restApiHooks.useRestApi<Historikkinnslag[]>(
    UngSakApiKeys.HISTORY_TILBAKE,
    { saksnummer },
    {
      updateTriggers: [behandlingId, behandlingVersjon],
      suspendRequest: !skalBrukeFpTilbakeHistorikk || erBehandlingEndret,
    },
  );

  const { data: historikkKlage, state: historikkKlageState } = restApiHooks.useRestApi<Historikkinnslag[]>(
    UngSakApiKeys.HISTORY_KLAGE,
    { saksnummer },
    {
      updateTriggers: [behandlingId, behandlingVersjon],
      suspendRequest: !skalBrukeKlageHistorikk || erBehandlingEndret,
    },
  );

  const historikkInnslagV1V2 = useMemo(
    () => sortAndTagUlikeHistorikkinnslagTyper(historikkUngSak, historikkTilbake, historikkKlage),
    [historikkUngSak, historikkTilbake, historikkKlage],
  );

  const getTilbakeKodeverknavn = getKodeverkNavnFraKodeFn('kodeverkTilbake');

  const v2HistorikkElementer = historikkInnslagV1V2.map((innslag, idx) => {
    let alleKodeverk = alleKodeverkUngSak;
    if (innslag.erTilbakekreving) {
      alleKodeverk = alleKodeverkTilbake;
    }
    if (innslag.erKlage) {
      alleKodeverk = alleKodeverkKlage;
    }
    if (innslag.erSak) {
      const key = innslag.historikkinnslagUuid ?? `${innslag.opprettetTidspunkt}-${innslag.aktør.ident}-${idx}`;
      return (
        <Snakkeboble
          key={key}
          saksnummer={saksnummer}
          historikkInnslag={innslag}
          kjønn={kjønn}
          createLocationForSkjermlenke={createLocationForSkjermlenke}
          getKodeverknavn={getTilbakeKodeverknavn}
          behandlingLocation={getBehandlingLocation(behandlingId)}
        />
      );
    } else if (innslag.erKlage || innslag.erTilbakekreving) {
      return (
        <HistorikkSakIndex
          key={`${innslag.opprettetTidspunkt}-${innslag.aktoer.kode}-${idx}`}
          historikkinnslag={innslag}
          saksnummer={saksnummer}
          alleKodeverk={alleKodeverk}
          erTilbakekreving={!!innslag.erTilbakekreving}
          getBehandlingLocation={getBehandlingLocation}
          createLocationForSkjermlenke={createLocationForSkjermlenke}
        />
      );
    } else {
      throw new Error(`Ugylding innslag objekt på saksnummer ${saksnummer}`);
    }
  });

  const isLoading =
    isRequestNotDone(historikkUngSakState) ||
    (skalBrukeFpTilbakeHistorikk && isRequestNotDone(historikkTilbakeState)) ||
    (skalBrukeKlageHistorikk && isRequestNotDone(historikkKlageState));

  if (isLoading) {
    return <LoadingPanel />;
  }

  return <div className="grid gap-5">{v2HistorikkElementer}</div>;
};

export default HistorikkIndex;
