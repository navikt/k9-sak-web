import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import * as Sentry from '@sentry/browser';

import HistorikkSakIndex from '@fpsak-frontend/sak-historikk';
import { LoadingPanel, usePrevious } from '@fpsak-frontend/shared-components';
import { Historikkinnslag, KodeverkMedNavn } from '@k9-sak-web/types';

import { isRequestNotDone } from '@k9-sak-web/rest-api-hooks/src/RestApiState';
import ApplicationContextPath from '../../app/ApplicationContextPath';
import { createLocationForSkjermlenke, pathToBehandling } from '../../app/paths';
import useGetEnabledApplikasjonContext from '../../app/useGetEnabledApplikasjonContext';
import useBehandlingEndret from '../../behandling/useBehandlingEndret';
import { K9sakApiKeys, restApiHooks } from '../../data/k9sakApi';
import { HistorikkinnslagV2 as TilbakeHistorikkinnslagV2 } from '@k9-sak-web/gui/sak/historikk/tilbake/historikkinnslagTsTypeV2.js';
import { Snakkeboble } from '@k9-sak-web/gui/sak/historikk/snakkeboble/Snakkeboble.js';
import dayjs from 'dayjs';
import { Kjønn } from '@k9-sak-web/backend/k9sak/kodeverk/Kjønn.js';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/hooks/useKodeverkContext.js';
import { Alert, HelpText, HStack, Switch } from '@navikt/ds-react';
import { HistorikkBackendApi } from '@k9-sak-web/gui/sak/historikk/HistorikkBackendApi.js';
import { useQuery } from '@tanstack/react-query';
import { InnslagBoble } from '@k9-sak-web/gui/sak/historikk/innslag/InnslagBoble.jsx';
import { compareRenderedElementTexts } from './v1v2Sammenligningssjekk.js';
import { EtablerteUlikeHistorikkinnslagTyper } from './historikkTypes.js';
import ErrorBoundary from '@k9-sak-web/gui/app/feilmeldinger/ErrorBoundary.js';
import HistorikkBackendApiContext from '@k9-sak-web/gui/sak/historikk/HistorikkBackendApiContext.js';
import {
  KlageHistorikkInnslagV2,
  NyeUlikeHistorikkinnslagTyper,
  SakHistorikkInnslagV2,
} from '@k9-sak-web/gui/sak/historikk/historikkTypeBerikning.js';
import { isDev } from '@k9-sak-web/lib/paths/paths.js';

const sortAndTagUlikeEtablerteHistorikkinnslagTyper = (
  historikkK9sak: Historikkinnslag[] = [],
  historikkTilbake: TilbakeHistorikkinnslagV2[] = [],
  historikkKlage: Historikkinnslag[] = [],
): EtablerteUlikeHistorikkinnslagTyper[] => {
  return [
    ...historikkTilbake.map(v => ({ ...v, erTilbakekreving: true })),
    ...historikkKlage.map(v => ({ ...v, erKlage: true })),
    ...historikkK9sak.map(v => ({ ...v, erSak: true })),
  ].toSorted((a, b) => dayjs(b.opprettetTidspunkt).diff(a.opprettetTidspunkt));
};

const sortAndTagUlikeNyeHistorikkinnslagTyper = (
  historikkK9sak: SakHistorikkInnslagV2[] = [],
  historikkTilbake: TilbakeHistorikkinnslagV2[] = [],
  historikkKlage: KlageHistorikkInnslagV2[] = [],
): NyeUlikeHistorikkinnslagTyper[] => {
  return [
    ...historikkTilbake.map(v => ({ ...v, erTilbakekreving: true })),
    ...historikkKlage,
    ...historikkK9sak,
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
  const historikkBackendApi: HistorikkBackendApi | null = useContext(HistorikkBackendApiContext);
  const [visV2, setVisV2] = useState(true); // Rendra historikk innslag v2 skal visast (ikkje berre samanliknast)
  const compareDone = useRef(false);
  const enabledApplicationContexts = useGetEnabledApplikasjonContext();
  const { getKodeverkNavnFraKodeFn } = useKodeverkContext();
  const compareTimeoutIdRef = useRef(0);

  if (historikkBackendApi == null) {
    throw new Error('HistorikkBackendApiContext ikke satt');
  }

  const alleKodeverkK9Sak = restApiHooks.useGlobalStateRestApiData<{ [key: string]: KodeverkMedNavn[] }>(
    K9sakApiKeys.KODEVERK,
  );
  const alleKodeverkTilbake = restApiHooks.useGlobalStateRestApiData<{ [key: string]: KodeverkMedNavn[] }>(
    K9sakApiKeys.KODEVERK_TILBAKE,
  );
  const alleKodeverkKlage = restApiHooks.useGlobalStateRestApiData<{ [key: string]: KodeverkMedNavn[] }>(
    K9sakApiKeys.KODEVERK_KLAGE,
  );

  const historikkK9SakV2Query = useQuery({
    queryKey: ['historikk/k9sak/v2', saksnummer, behandlingId, behandlingVersjon],
    queryFn: () => historikkBackendApi.hentAlleInnslagK9sak(saksnummer),
    enabled: saksnummer != null && saksnummer.length > 0,
    retry: 1, // <- 1 Nedjustert retry i starten, for å unngå å vente lenge når ein heller vil falle tilbake til v1 visning ved feil.
  });

  const historikkK9KlageV2Query = useQuery({
    queryKey: ['historikk/k9klage/v2', saksnummer, behandlingId, behandlingVersjon],
    queryFn: () => historikkBackendApi.hentAlleInnslagK9klage(saksnummer),
    enabled: saksnummer != null && saksnummer.length > 0,
    retry: 1, // <- 1 Nedjustert retry i starten, for å unngå å vente lenge når ein heller vil falle tilbake til v1 visning ved feil.
  });

  const location = useLocation();
  const getBehandlingLocation = useCallback(
    (behandlingId: number) => ({
      ...location,
      pathname: pathToBehandling(saksnummer, behandlingId),
    }),
    [location],
  );

  const skalBrukeFpTilbakeHistorikk = enabledApplicationContexts.includes(ApplicationContextPath.TILBAKE);
  const skalBrukeKlageHistorikk = enabledApplicationContexts.includes(ApplicationContextPath.KLAGE);
  const erBehandlingEndretFraUndefined = useBehandlingEndret(behandlingId, behandlingVersjon);
  const forrigeSaksnummer = usePrevious(saksnummer);
  const erBehandlingEndret: boolean =
    forrigeSaksnummer !== undefined && forrigeSaksnummer.length > 0 && erBehandlingEndretFraUndefined;

  const { data: historikkK9Sak, state: historikkK9SakState } = restApiHooks.useRestApi<Historikkinnslag[]>(
    K9sakApiKeys.HISTORY_K9SAK,
    { saksnummer },
    {
      updateTriggers: [behandlingId, behandlingVersjon],
      suspendRequest: erBehandlingEndret,
    },
  );

  const { data: historikkTilbakeV2, state: historikkTilbakeStateV2 } = restApiHooks.useRestApi<
    TilbakeHistorikkinnslagV2[]
  >(
    K9sakApiKeys.HISTORY_TILBAKE_V2,
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

  const isLoading =
    historikkK9SakV2Query.isPending ||
    historikkK9KlageV2Query.isPending ||
    isRequestNotDone(historikkK9SakState) ||
    (skalBrukeKlageHistorikk && isRequestNotDone(historikkKlageState)) ||
    (skalBrukeFpTilbakeHistorikk && isRequestNotDone(historikkTilbakeStateV2));

  const etablerteHistorikkInnslag = useMemo(
    () => sortAndTagUlikeEtablerteHistorikkinnslagTyper(historikkK9Sak, historikkTilbakeV2, historikkKlage),
    [historikkK9Sak, historikkTilbakeV2, historikkKlage],
  );

  const nyeHistorikkInnslag = useMemo(
    () =>
      sortAndTagUlikeNyeHistorikkinnslagTyper(
        historikkK9SakV2Query.data,
        historikkTilbakeV2,
        historikkK9KlageV2Query.data,
      ),
    [historikkK9SakV2Query.data, historikkTilbakeV2, historikkK9KlageV2Query.data],
  );

  const getTilbakeKodeverknavn = getKodeverkNavnFraKodeFn('kodeverkTilbake');

  const etablerteHistorikkElementer = etablerteHistorikkInnslag.map((innslag, idx) => {
    let alleKodeverk = alleKodeverkK9Sak;
    if (innslag.erTilbakekreving) {
      alleKodeverk = alleKodeverkTilbake;
    }
    if (innslag.erKlage) {
      alleKodeverk = alleKodeverkKlage;
    }
    // tilbakekreving har her (tilbake) historikk innslag v2
    if (innslag.erTilbakekreving) {
      return (
        <Snakkeboble
          key={`${innslag.opprettetTidspunkt}-${innslag.aktør.ident}-${idx}`}
          saksnummer={saksnummer}
          historikkInnslag={innslag}
          kjønn={kjønn}
          createLocationForSkjermlenke={createLocationForSkjermlenke}
          getKodeverknavn={getTilbakeKodeverknavn}
          behandlingLocation={getBehandlingLocation(behandlingId)}
        />
      );
    } else if (innslag.erSak || innslag.erKlage) {
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

  const nyeHistorikkElementer = nyeHistorikkInnslag.map((innslag, idx) => {
    // tilbakekreving har her (tilbake) historikk innslag v2
    if (innslag.erTilbakekreving) {
      return (
        <Snakkeboble
          key={`${innslag.opprettetTidspunkt}-${innslag.aktør.ident}-${idx}`}
          saksnummer={saksnummer}
          historikkInnslag={innslag}
          kjønn={kjønn}
          createLocationForSkjermlenke={createLocationForSkjermlenke}
          getKodeverknavn={getTilbakeKodeverknavn}
          behandlingLocation={getBehandlingLocation(behandlingId)}
        />
      );
    } else if (innslag.erKlage) {
      return (
        <InnslagBoble
          key={`${innslag.uuid}`}
          saksnummer={saksnummer}
          innslag={innslag}
          kjønn={kjønn}
          createLocationForSkjermlenke={createLocationForSkjermlenke}
          behandlingLocation={getBehandlingLocation(behandlingId)}
        />
      );
    } else if (innslag.erSak) {
      return (
        <InnslagBoble
          key={`${innslag.opprettetTidspunkt}-${innslag.aktør.ident}-${idx}`}
          saksnummer={saksnummer}
          innslag={innslag}
          kjønn={kjønn}
          createLocationForSkjermlenke={createLocationForSkjermlenke}
          behandlingLocation={getBehandlingLocation(behandlingId)}
        />
      );
    } else {
      throw new Error(`Ugyldig innslag objekt på saksnummer ${saksnummer}`);
    }
  });

  // Samanlikning av etablert og nytt render resultat. Sjekker at alle ord rendra i etablerte historikkinnslag også bli rendra i nye.
  // (Uavhengig av rekkefølge på orda.) For å unngå fleire køyringer av sjekk pga re-rendering ved initiell lasting
  // er køyring forsinka litt, med clearTimeout på forrige timeout id.
  useEffect(() => {
    if (compareTimeoutIdRef.current > 0) {
      window.clearTimeout(compareTimeoutIdRef.current);
    }
    if (!isLoading) {
      compareTimeoutIdRef.current = window.setTimeout(async () => {
        if (compareDone.current === false) {
          // Ønsker berre å gjere samanlikningssjekk ein gong.
          try {
            await compareRenderedElementTexts(
              etablerteHistorikkInnslag,
              etablerteHistorikkElementer,
              nyeHistorikkElementer,
            );
          } catch (err) {
            setVisV2(false);
            Sentry.captureException(err, { level: 'warning' });
            if (isDev()) {
              console.info('compareRenderedElementTexts kasta feil', err);
            }
          } finally {
            compareDone.current = true;
          }
        }
      }, 3_000);
    }
  }, [isLoading, etablerteHistorikkInnslag, nyeHistorikkInnslag, etablerteHistorikkElementer, nyeHistorikkElementer]); // Ønsker bevisst å berre køyre samanlikningssjekk ein gang.

  if (isLoading) {
    return <LoadingPanel />;
  }

  const nyeHistorikkElementerMedFeilgrense = (
    <ErrorBoundary errorMessageCallback={() => setVisV2(false)}>{nyeHistorikkElementer}</ErrorBoundary>
  );

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

  return (
    <div className="grid gap-5">
      <HStack align="center">
        <Switch data-testid="NyVisningSwitch" size="small" checked={visV2} onChange={ev => setVisV2(ev.target.checked)}>
          Ny visning&nbsp;
        </Switch>
        <HelpText>
          <p>Vi er i ferd med å gå over til nytt format/visning av historikk innslag.</p>
          <p>I en overgangsperiode kan du med denne bryter bytte mellom ny og gammel visning.</p>
          <p>Pr nå er forskjell mellom gammel og ny versjon historikkinnslag fra k9-sak.</p>
          <p>
            Historikk fra tilbakekreving vises utelukkende i nytt format. Historikk fra k9-klage vises fremdeles bare
            med gammelt format. Dette blir snart også tilgjengelig i nytt format.
          </p>
        </HelpText>
      </HStack>
      {visV2 ? sakHentFeilAlert : null}
      {visV2 ? klageHentFeilAlert : null}
      {visV2 ? nyeHistorikkElementerMedFeilgrense : etablerteHistorikkElementer}
    </div>
  );
};

export default HistorikkIndex;
