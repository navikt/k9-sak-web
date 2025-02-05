import React, { useCallback, useState, useContext, useMemo, useRef, useEffect } from 'react';
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
import { HistorikkinnslagV2 } from '@k9-sak-web/gui/sak/historikk/historikkinnslagTsTypeV2.js';
import { Snakkeboble } from '@k9-sak-web/gui/sak/historikk/snakkeboble/Snakkeboble.js';
import dayjs from 'dayjs';
import { Kjønn } from '@k9-sak-web/backend/k9sak/kodeverk/Kjønn.js';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/hooks/useKodeverkContext.js';
import FeatureTogglesContext from '@k9-sak-web/gui/utils/featureToggles/FeatureTogglesContext.js';
import { compareRenderedElementTexts } from './v1v2Sammenligningssjekk.js';
import { HStack, Switch, HelpText } from '@navikt/ds-react';

type HistorikkMedTilbakekrevingIndikator = Historikkinnslag & {
  erTilbakekreving?: boolean;
  erKlage?: boolean;
};

type SakHistorikkInnslagV1 = Historikkinnslag & {
  erKlage?: never;
  erTilbakekreving?: never;
  erSak: boolean;
};

type KlageHistorikkInnslagV1 = Historikkinnslag & {
  erKlage: boolean;
  erTilbakekreving?: never;
  erSak?: never;
};

type TilbakeHistorikkInnslagV2 = HistorikkinnslagV2 & {
  erKlage?: never;
  erTilbakekreving: boolean;
  erSak?: never;
};

type UlikeHistorikkinnslagTyper = SakHistorikkInnslagV1 | KlageHistorikkInnslagV1 | TilbakeHistorikkInnslagV2;

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
    .sort((a, b) => dayjs(b.opprettetTidspunkt).diff(dayjs(a.opprettetTidspunkt)));
};

const sortAndTagUlikeHistorikkinnslagTyper = (
  historikkK9sak: Historikkinnslag[] = [],
  historikkTilbake: HistorikkinnslagV2[] = [],
  historikkKlage: Historikkinnslag[] = [],
): UlikeHistorikkinnslagTyper[] => {
  return [
    ...historikkTilbake.map(v => ({ ...v, erTilbakekreving: true })),
    ...historikkKlage.map(v => ({ ...v, erKlage: true })),
    ...historikkK9sak.map(v => ({ ...v, erSak: true })),
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
  const featureToggles = useContext(FeatureTogglesContext);
  const [visV2, setVisV2] = useState(featureToggles?.['HISTORIKK_V2_VIS'] === true); // Rendra historikk innslag v2 skal visast (ikkje berre samanliknast)
  const enabledApplicationContexts = useGetEnabledApplikasjonContext();
  const { getKodeverkNavnFraKodeFn } = useKodeverkContext();
  const compareTimeoutIdRef = useRef(0);

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

  const { data: historikkTilbake, state: historikkTilbakeState } = restApiHooks.useRestApi<Historikkinnslag[]>(
    K9sakApiKeys.HISTORY_TILBAKE,
    { saksnummer },
    {
      updateTriggers: [behandlingId, behandlingVersjon],
      suspendRequest: !skalBrukeFpTilbakeHistorikk || erBehandlingEndret,
    },
  );

  const { data: historikkTilbakeV2, state: historikkTilbakeStateV2 } = restApiHooks.useRestApi<HistorikkinnslagV2[]>(
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

  const historikkInnslag = useMemo(
    () => sortAndTagTilbakekrevingOgKlage(historikkK9Sak, historikkTilbake, historikkKlage),
    [historikkK9Sak, historikkTilbake, historikkKlage],
  );
  const historikkInnslagV1V2 = useMemo(
    () => sortAndTagUlikeHistorikkinnslagTyper(historikkK9Sak, historikkTilbakeV2, historikkKlage),
    [historikkK9Sak, historikkTilbakeV2, historikkKlage],
  );

  if (
    isRequestNotDone(historikkK9SakState) ||
    (skalBrukeFpTilbakeHistorikk && isRequestNotDone(historikkTilbakeState)) ||
    (skalBrukeKlageHistorikk && isRequestNotDone(historikkKlageState)) ||
    (skalBrukeFpTilbakeHistorikk && isRequestNotDone(historikkTilbakeStateV2))
  ) {
    return <LoadingPanel />;
  }

  const getTilbakeKodeverknavn = getKodeverkNavnFraKodeFn('kodeverkTilbake');

  const v1HistorikkElementer = historikkInnslag.map(innslag => {
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
  });
  const v2HistorikkElementer = historikkInnslagV1V2.map((innslag, idx) => {
    let alleKodeverk = alleKodeverkK9Sak;
    if (innslag.erTilbakekreving) {
      alleKodeverk = alleKodeverkTilbake;
    }
    if (innslag.erKlage) {
      alleKodeverk = alleKodeverkKlage;
    }
    // tilbakekreving har her historikk innslag v2
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
  if (v2HistorikkElementer.length > 0) {
    // Samanlikning av v1 og v2 render resultat. Sjekker at alle ord rendra i v1 historikkinnslag også bli rendra i v2.
    // (Uavhengig av rekkefølge på orda.) For å unngå fleire køyringer av sjekk pga re-rendering ved initiell lasting
    // er køyring forsinka litt, med clearTimeout på forrige timeout id.
    useEffect(() => {
      if (compareTimeoutIdRef.current > 0) {
        window.clearTimeout(compareTimeoutIdRef.current);
      }
      compareTimeoutIdRef.current = window.setTimeout(() => {
        try {
          compareRenderedElementTexts(historikkInnslag, v1HistorikkElementer, v2HistorikkElementer);
        } catch (err) {
          setVisV2(false);
          Sentry.captureException(err, { level: 'warning' });
        }
      }, 1_000);
    }, [historikkInnslag]); // Ønsker bevisst å berre køyre samanlikningssjekk ein gang.
  }

  return (
    <div className="grid gap-5">
      <HStack align="center">
        <Switch size="small" checked={visV2} onChange={ev => setVisV2(ev.target.checked)}>
          Ny visning&nbsp;
        </Switch>
        <HelpText>
          <p>Vi er i ferd med å gå over til nytt format/visning av historikk innslag.</p>
          <p>I en overgangsperiode kan du med denne bryter bytte mellom ny og gammel visning.</p>
          <p>
            Ved å gjøre det kan du undersøke om ny visning har mangler, og melde fra om dette så vi kan korrigere evt
            mangler før gammel visning forsvinner.
          </p>
          <p>
            Bare noen av innslagene vil ha ny/gammel visning tilgjengelig samtidig, så ikke alle vil forandre seg når du
            skrur på/av denne bryter.
          </p>
        </HelpText>
      </HStack>
      {visV2 ? v2HistorikkElementer : v1HistorikkElementer}
    </div>
  );
};

export default HistorikkIndex;
