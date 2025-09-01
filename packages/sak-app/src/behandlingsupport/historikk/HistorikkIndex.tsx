import React, { useCallback, useContext, useMemo } from 'react';
import { useLocation } from 'react-router';

import { LoadingPanel } from '@k9-sak-web/gui/shared/loading-panel/LoadingPanel.js';

import { createLocationForSkjermlenke, pathToBehandling } from '../../app/paths';
import {
  KlageHistorikkInnslagV2,
  NyeUlikeHistorikkinnslagTyper,
  SakHistorikkInnslagV2,
  TilbakeHistorikkInnslagV2,
} from '@k9-sak-web/gui/sak/historikk/historikkTypeBerikning.js';
import dayjs from 'dayjs';
import { Alert } from '@navikt/ds-react';
import { HistorikkBackendApi } from '@k9-sak-web/gui/sak/historikk/HistorikkBackendApi.js';
import { useQuery } from '@tanstack/react-query';
import { InnslagBoble } from '@k9-sak-web/gui/sak/historikk/innslag/InnslagBoble.jsx';
import HistorikkBackendApiContext from '@k9-sak-web/gui/sak/historikk/HistorikkBackendApiContext.js';

const sortHistorikkinnslag = (
  historikkK9sak: SakHistorikkInnslagV2[] = [],
  historikkTilbake: TilbakeHistorikkInnslagV2[] = [],
  historikkKlage: KlageHistorikkInnslagV2[] = [],
): NyeUlikeHistorikkinnslagTyper[] => {
  return [...historikkTilbake, ...historikkKlage, ...historikkK9sak].toSorted((a, b) =>
    dayjs(b.opprettetTidspunkt).diff(a.opprettetTidspunkt),
  );
};

interface OwnProps {
  saksnummer: string;
  behandlingId: number;
  behandlingVersjon?: number;
}

/**
 * HistorikkIndex
 *
 * Container komponent. Har ansvar for å hente historiken for en fagsak fra state og vise den
 */
const HistorikkIndex = ({ saksnummer, behandlingId, behandlingVersjon }: OwnProps) => {
  const historikkBackendApi: HistorikkBackendApi | null = useContext(HistorikkBackendApiContext);

  if (historikkBackendApi == null) {
    throw new Error('HistorikkBackendApiContext ikke satt');
  }

  const historikkK9SakV2Query = useQuery({
    queryKey: ['historikk/k9sak/v2', saksnummer, behandlingId, behandlingVersjon],
    queryFn: () => historikkBackendApi.hentAlleInnslagK9sak(saksnummer),
    enabled: saksnummer != null && saksnummer.length > 0,
  });

  const historikkK9KlageV2Query = useQuery({
    queryKey: ['historikk/k9klage/v2', saksnummer, behandlingId, behandlingVersjon],
    queryFn: () => historikkBackendApi.hentAlleInnslagK9klage(saksnummer),
    enabled: saksnummer != null && saksnummer.length > 0,
  });

  const historikkK9TilbakeV2Query = useQuery({
    queryKey: ['historikk/k9tilbake/v2', saksnummer, behandlingId, behandlingVersjon],
    queryFn: () => historikkBackendApi.hentAlleInnslagK9tilbake(saksnummer),
    enabled: saksnummer != null && saksnummer.length > 0,
  });

  const location = useLocation();
  const getBehandlingLocation = useCallback(
    (behandlingId: number) => ({
      ...location,
      pathname: pathToBehandling(saksnummer, behandlingId),
    }),
    [location, saksnummer],
  );

  const isLoading =
    historikkK9SakV2Query.isPending || historikkK9KlageV2Query.isPending || historikkK9TilbakeV2Query.isPending;

  const nyeHistorikkInnslag = useMemo(
    () =>
      sortHistorikkinnslag(historikkK9SakV2Query.data, historikkK9TilbakeV2Query.data, historikkK9KlageV2Query.data),
    [historikkK9SakV2Query.data, historikkK9TilbakeV2Query.data, historikkK9KlageV2Query.data],
  );

  const nyeHistorikkElementer = nyeHistorikkInnslag.map((innslag, idx) => {
    return (
      <InnslagBoble
        key={`${innslag.opprettetTidspunkt}-${innslag?.aktør?.ident}-${idx}`}
        saksnummer={saksnummer}
        innslag={innslag}
        createLocationForSkjermlenke={createLocationForSkjermlenke}
        behandlingLocation={getBehandlingLocation(behandlingId)}
      />
    );
  });

  if (isLoading) {
    return <LoadingPanel />;
  }

  // Viss henting av data har feila, vis varsel om det.
  const sakHentFeilAlert = historikkK9SakV2Query.isError ? (
    <Alert variant="error" size="small">
      Det har oppstått en feil ved henting av historikk fra k9-sak. Ingen innslag derifra vises.
    </Alert>
  ) : null;
  const klageHentFeilAlert = historikkK9KlageV2Query.isError ? (
    <Alert variant="error" size="small">
      Det har oppstått en feil ved henting av historikk fra k9-klage. Ingen innslag derifra vises.
    </Alert>
  ) : null;
  const tilbakeHentFeilAlert = historikkK9TilbakeV2Query.isError ? (
    <Alert variant="error" size="small">
      Det har oppstått en feil ved henting av historikk fra k9-tilbake. Ingen innslag derifra vises.
    </Alert>
  ) : null;

  return (
    <div className="grid gap-5">
      {sakHentFeilAlert}
      {klageHentFeilAlert}
      {tilbakeHentFeilAlert}
      {nyeHistorikkElementer}
    </div>
  );
};

export default HistorikkIndex;
