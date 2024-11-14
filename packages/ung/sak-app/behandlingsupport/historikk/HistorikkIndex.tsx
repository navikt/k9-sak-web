import moment from 'moment';
import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import HistorikkSakIndex from '@fpsak-frontend/sak-historikk';
import { LoadingPanel, usePrevious } from '@fpsak-frontend/shared-components';
import { Historikkinnslag, KodeverkMedNavn } from '@k9-sak-web/types';

import { isRequestNotDone } from '@k9-sak-web/rest-api-hooks/src/RestApiState';
import { createLocationForSkjermlenke, pathToBehandling } from '../../app/paths';
import useBehandlingEndret from '../../behandling/useBehandlingEndret';
import { UngSakApiKeys, restApiHooks } from '../../data/ungsakApi';

type HistorikkMedTilbakekrevingIndikator = Historikkinnslag;

const sortHistorikkinnslag = (historikkK9sak: Historikkinnslag[] = []): HistorikkMedTilbakekrevingIndikator[] => {
  return historikkK9sak.sort((a, b) => moment(b.opprettetTidspunkt).diff(moment(a.opprettetTidspunkt)));
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
  const alleKodeverkK9Sak = restApiHooks.useGlobalStateRestApiData<{ [key: string]: KodeverkMedNavn[] }>(
    UngSakApiKeys.KODEVERK,
  );

  const location = useLocation();
  const getBehandlingLocation = useCallback(
    (bId: number) => ({
      ...location,
      pathname: pathToBehandling(saksnummer, bId),
    }),
    [location],
  );

  const erBehandlingEndretFraUndefined = useBehandlingEndret(behandlingId, behandlingVersjon);
  const forrigeSaksnummer = usePrevious(saksnummer);
  const erBehandlingEndret = forrigeSaksnummer && erBehandlingEndretFraUndefined;

  const { data: historikkK9Sak, state: historikkK9SakState } = restApiHooks.useRestApi<Historikkinnslag[]>(
    UngSakApiKeys.HISTORY_UNGSAK,
    { saksnummer },
    {
      updateTriggers: [behandlingId, behandlingVersjon],
      suspendRequest: erBehandlingEndret,
    },
  );

  const historikkInnslag = useMemo(() => sortHistorikkinnslag(historikkK9Sak), [historikkK9Sak]);

  if (isRequestNotDone(historikkK9SakState)) {
    return <LoadingPanel />;
  }

  return (
    <div className="grid gap-5">
      {historikkInnslag.map(innslag => {
        return (
          <HistorikkSakIndex
            key={innslag.opprettetTidspunkt + innslag.type.kode}
            historikkinnslag={innslag}
            saksnummer={saksnummer}
            alleKodeverk={alleKodeverkK9Sak}
            erTilbakekreving={false}
            getBehandlingLocation={getBehandlingLocation}
            createLocationForSkjermlenke={createLocationForSkjermlenke}
          />
        );
      })}
    </div>
  );
};

export default HistorikkIndex;
