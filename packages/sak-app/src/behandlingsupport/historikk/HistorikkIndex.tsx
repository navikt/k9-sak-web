import moment from 'moment';
import React, { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import HistorikkSakIndex from '@fpsak-frontend/sak-historikk';
import { LoadingPanel, usePrevious } from '@fpsak-frontend/shared-components';
import { Historikkinnslag, KodeverkMedNavn } from '@k9-sak-web/types';

import { isRequestNotDone } from '@k9-sak-web/rest-api-hooks/src/RestApiState';
import ApplicationContextPath from '../../app/ApplicationContextPath';
import { createLocationForSkjermlenke, pathToBehandling } from '../../app/paths';
import useGetEnabledApplikasjonContext from '../../app/useGetEnabledApplikasjonContext';
import useBehandlingEndret from '../../behandling/useBehandlingEndret';
import { K9sakApiKeys, restApiHooks } from '../../data/k9sakApi';

type HistorikkMedTilbakekrevingIndikator = Historikkinnslag & {
  erTilbakekreving?: boolean;
  erKlage?: boolean;
};

const sortAndTagTilbakekrevingOgKlage = (
  historikkK9sak: Historikkinnslag[] = [],
  historikkTilbake: Historikkinnslag[] = [],
  historikkKlage: Historikkinnslag[] = [],
): HistorikkMedTilbakekrevingIndikator[] => {
  const historikkFraTilbakekrevingMedMarkor = historikkTilbake.map(ht => ({
    ...ht,
    erTilbakekreving: true,
  }));
  const historikkFraKlageMedMarkor = historikkKlage.map(ht => ({
    ...ht,
    erKlage: true,
  }));
  return historikkK9sak
    .concat(historikkFraTilbakekrevingMedMarkor)
    .concat(historikkFraKlageMedMarkor)
    .sort((a, b) => moment(b.opprettetTidspunkt).diff(moment(a.opprettetTidspunkt)));
};

interface OwnProps {
  saksnummer: string;
  behandlingId?: number;
  behandlingVersjon?: number;
}

/**
 * HistorikkIndex
 *
 * Container komponent. Har ansvar for å hente historiken for en fagsak fra state og vise den
 */
const HistorikkIndex = ({ saksnummer, behandlingId, behandlingVersjon }: OwnProps) => {
  const enabledApplicationContexts = useGetEnabledApplikasjonContext();

  const alleKodeverkK9Sak = restApiHooks.useGlobalStateRestApiData<{ [key: string]: KodeverkMedNavn[] }>(
    K9sakApiKeys.KODEVERK,
  );
  const alleKodeverkTilbake = restApiHooks.useGlobalStateRestApiData<{ [key: string]: KodeverkMedNavn[] }>(
    K9sakApiKeys.KODEVERK_TILBAKE,
  );
  const alleKodeverkKlage = restApiHooks.useGlobalStateRestApiData<{ [key: string]: KodeverkMedNavn[] }>(
    K9sakApiKeys.KODEVERK_KLAGE,
  );

  const location = useLocation();
  const getBehandlingLocation = useCallback(
    (bId: number) => ({
      ...location,
      pathname: pathToBehandling(saksnummer, bId),
    }),
    [location],
  );

  const skalBrukeFpTilbakeHistorikk = enabledApplicationContexts.includes(ApplicationContextPath.TILBAKE);
  const skalBrukeKlageHistorikk = enabledApplicationContexts.includes(ApplicationContextPath.KLAGE);
  const erBehandlingEndretFraUndefined = useBehandlingEndret(behandlingId, behandlingVersjon);
  const forrigeSaksnummer = usePrevious(saksnummer);
  const erBehandlingEndret = forrigeSaksnummer && erBehandlingEndretFraUndefined;

  const { data: historikkK9Sak, state: historikkK9SakState } = restApiHooks.useRestApi<Historikkinnslag[]>(
    K9sakApiKeys.HISTORY_K9SAK,
    { saksnummer },
    {
      updateTriggers: [behandlingId, behandlingVersjon],
      suspendRequest: erBehandlingEndret,
    },
  );

  const { data: historikkTilbake, state: historikkTilbakeState } = restApiHooks.useRestApi<Historikkinnslag[]>(
    K9sakApiKeys.HISTORY_TILBAKE,
    { saksnummer },
    {
      updateTriggers: [behandlingId, behandlingVersjon],
      suspendRequest: !skalBrukeFpTilbakeHistorikk || erBehandlingEndret,
    },
  );

  const { data: historikkKlage, state: historikkKlageState } = restApiHooks.useRestApi<Historikkinnslag[]>(
    K9sakApiKeys.HISTORY_KLAGE,
    { saksnummer },
    {
      updateTriggers: [behandlingId, behandlingVersjon],
      suspendRequest: !skalBrukeKlageHistorikk || erBehandlingEndret,
    },
  );

  const historikkInnslag = useMemo(
    () => sortAndTagTilbakekrevingOgKlage(historikkK9Sak, historikkTilbake, historikkKlage),
    [historikkK9Sak, historikkTilbake, historikkKlage],
  );

  if (
    isRequestNotDone(historikkK9SakState) ||
    (skalBrukeFpTilbakeHistorikk && isRequestNotDone(historikkTilbakeState)) ||
    (skalBrukeKlageHistorikk && isRequestNotDone(historikkKlageState))
  ) {
    return <LoadingPanel />;
  }

  return (
    <div className="grid gap-5">
      {historikkInnslag.map(innslag => {
        let alleKodeverk = alleKodeverkK9Sak;
        if (innslag.erTilbakekreving) {
          alleKodeverk = alleKodeverkTilbake;
        }
        if (innslag.erKlage) {
          alleKodeverk = alleKodeverkKlage;
        }
        return (
          <HistorikkSakIndex
            key={innslag.opprettetTidspunkt + innslag.type.kode}
            historikkinnslag={innslag}
            saksnummer={saksnummer}
            alleKodeverk={alleKodeverk}
            erTilbakekreving={!!innslag.erTilbakekreving}
            getBehandlingLocation={getBehandlingLocation}
            createLocationForSkjermlenke={createLocationForSkjermlenke}
          />
        );
      })}
    </div>
  );
};

export default HistorikkIndex;
