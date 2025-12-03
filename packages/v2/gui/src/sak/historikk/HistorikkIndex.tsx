import { useCallback, useContext } from 'react';
import { useLocation } from 'react-router';

import { LoadingPanel } from '@k9-sak-web/gui/shared/loading-panel/LoadingPanel.js';

import dayjs from 'dayjs';
import { Alert } from '@navikt/ds-react';
import type {
  BeriketHistorikkInnslag,
  HistorikkBackendApi,
} from '@k9-sak-web/gui/sak/historikk/api/HistorikkBackendApi.js';
import { useQuery } from '@tanstack/react-query';
import { InnslagBoble } from '@k9-sak-web/gui/sak/historikk/innslag/InnslagBoble.js';
import { HistorikkBackendApiContext } from './api/HistorikkBackendApiContext.js';
import { pathToBehandling } from '../../utils/paths.js';

interface OwnProps {
  saksnummer: string;
  behandlingId: number;
  behandlingVersjon?: number;
}

// Bør få inn behandlingUuid på historikkinnslagDto i alle backends slik at vi kan fjerne denne kode.
const behandlingIdOrUuid = (historikkinnslag: BeriketHistorikkInnslag): string | number | undefined => {
  if ('behandlingId' in historikkinnslag && typeof historikkinnslag.behandlingId === 'number') {
    return historikkinnslag.behandlingId;
  }
  if ('behandlingUuid' in historikkinnslag && typeof historikkinnslag.behandlingUuid === 'string') {
    return historikkinnslag.behandlingUuid;
  }
  return undefined;
};

/**
 * HistorikkIndex
 *
 * Container komponent. Har ansvar for å hente historiken for en fagsak fra state og vise den
 */
export const HistorikkIndex = ({ saksnummer, behandlingId, behandlingVersjon }: OwnProps) => {
  const historikkBackendApi: HistorikkBackendApi | null = useContext(HistorikkBackendApiContext);

  if (historikkBackendApi == null) {
    throw new Error('HistorikkBackendApiContext ikke satt');
  }

  const { data: historikk, isLoading } = useQuery({
    queryKey: ['historikk', saksnummer, behandlingId, behandlingVersjon, historikkBackendApi.backend], // XXX Burde ikkje vere nødvendig å alltid hente på nytt fordi behandlingId endra seg.
    queryFn: () => historikkBackendApi.hentAlleInnslag(saksnummer),
    enabled: saksnummer != null && saksnummer.length > 0,
    select: ({ innslag, feilet }) => {
      // Sorterer alle innslaga frå nyaste til eldste
      return {
        innslag: innslag.toSorted((a, b) => dayjs(b.opprettetTidspunkt).diff(a.opprettetTidspunkt)),
        feilet,
      };
    },
  });

  const location = useLocation();
  const getBehandlingLocation = useCallback(
    (behandlingIdOrUuid: number | string) => ({
      ...location,
      pathname: pathToBehandling(saksnummer, behandlingIdOrUuid),
    }),
    [location, saksnummer],
  );

  if (isLoading) {
    return <LoadingPanel />;
  }

  return (
    <div className="grid gap-5">
      {historikk?.feilet.map(feil => (
        <Alert variant="error" size="small" key={feil.backend}>
          Det har oppstått en feil ved henting av historikk fra {feil.backend}. Ingen innslag derifra vises.
        </Alert>
      ))}
      {historikk?.innslag.map((innslag, idx) => {
        return (
          <InnslagBoble
            key={`${innslag.opprettetTidspunkt}-${innslag?.aktør?.ident}-${idx}`}
            innslag={innslag}
            behandlingLocation={getBehandlingLocation(behandlingIdOrUuid(innslag) ?? behandlingId)}
          />
        );
      })}
    </div>
  );
};
