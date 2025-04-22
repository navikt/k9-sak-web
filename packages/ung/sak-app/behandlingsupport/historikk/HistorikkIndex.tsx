import * as Sentry from '@sentry/browser';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router';

import HistorikkSakIndex from '@fpsak-frontend/sak-historikk';
import { LoadingPanel, usePrevious } from '@fpsak-frontend/shared-components';
import { Historikkinnslag, KodeverkMedNavn } from '@k9-sak-web/types';

import { Kjønn } from '@k9-sak-web/backend/k9sak/kodeverk/Kjønn.js';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/hooks/useKodeverkContext.js';
import { HistorikkinnslagV2 } from '@k9-sak-web/gui/sak/historikk/tilbake/historikkinnslagTsTypeV2.js';
import { Snakkeboble } from '@k9-sak-web/gui/sak/historikk/snakkeboble/Snakkeboble.js';
import { isRequestNotDone } from '@k9-sak-web/rest-api-hooks/src/RestApiState';
import ApplicationContextPath from '@k9-sak-web/sak-app/src/app/ApplicationContextPath';
import { compareRenderedElementTexts } from '@k9-sak-web/sak-app/src/behandlingsupport/historikk/v1v2Sammenligningssjekk';
import { HelpText, HStack, Switch } from '@navikt/ds-react';
import dayjs from 'dayjs';
import { createLocationForSkjermlenke, pathToBehandling } from '../../app/paths';
import useGetEnabledApplikasjonContext from '../../app/useGetEnabledApplikasjonContext';
import useBehandlingEndret from '../../behandling/useBehandlingEndret';
import { restApiHooks, UngSakApiKeys } from '../../data/ungsakApi';

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
  historikkKlage: Historikkinnslag[] = [],
): UlikeHistorikkinnslagTyper[] => {
  return [
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
    [location],
  );

  const skalBrukeFpTilbakeHistorikk = enabledApplicationContexts.includes(ApplicationContextPath.TILBAKE);
  const skalBrukeKlageHistorikk = enabledApplicationContexts.includes(ApplicationContextPath.KLAGE);
  const erBehandlingEndretFraUndefined = useBehandlingEndret(behandlingId, behandlingVersjon);
  const forrigeSaksnummer = usePrevious(saksnummer);
  const erBehandlingEndret: boolean =
    forrigeSaksnummer !== undefined && forrigeSaksnummer.length > 0 && erBehandlingEndretFraUndefined;

  const { data: historikkK9Sak, state: historikkK9SakState } = restApiHooks.useRestApi<Historikkinnslag[]>(
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

  const historikkInnslag = useMemo(
    () => sortAndTagTilbakekrevingOgKlage(historikkK9Sak, historikkTilbake, historikkKlage),
    [historikkK9Sak, historikkTilbake, historikkKlage],
  );
  const historikkInnslagV1V2 = useMemo(
    () => sortAndTagUlikeHistorikkinnslagTyper(historikkK9Sak, historikkKlage),
    [historikkK9Sak, historikkKlage],
  );

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

  const isLoading =
    isRequestNotDone(historikkK9SakState) ||
    (skalBrukeFpTilbakeHistorikk && isRequestNotDone(historikkTilbakeState)) ||
    (skalBrukeKlageHistorikk && isRequestNotDone(historikkKlageState));

  // Samanlikning av v1 og v2 render resultat. Sjekker at alle ord rendra i v1 historikkinnslag også bli rendra i v2.
  // (Uavhengig av rekkefølge på orda.) For å unngå fleire køyringer av sjekk pga re-rendering ved initiell lasting
  // er køyring forsinka litt, med clearTimeout på forrige timeout id.
  useEffect(() => {
    if (compareTimeoutIdRef.current > 0) {
      window.clearTimeout(compareTimeoutIdRef.current);
    }
    if (!isLoading) {
      compareTimeoutIdRef.current = window.setTimeout(async () => {
        try {
          await compareRenderedElementTexts(historikkInnslag, v1HistorikkElementer, v2HistorikkElementer);
        } catch (err) {
          setVisV2(false);
          Sentry.captureException(err, { level: 'warning' });
        }
      }, 1_000);
    }
  }, [isLoading, historikkInnslag, historikkInnslagV1V2]); // Ønsker bevisst å berre køyre samanlikningssjekk ein gang.

  if (isLoading) {
    return <LoadingPanel />;
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
