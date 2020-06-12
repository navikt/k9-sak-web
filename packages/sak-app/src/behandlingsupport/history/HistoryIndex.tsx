import React, { FunctionComponent, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { RouteProps } from 'react-router';
import moment from 'moment';

import { LoadingPanel } from '@fpsak-frontend/shared-components';
import HistorikkSakIndex from '@fpsak-frontend/sak-historikk';
import { KodeverkMedNavn, Kodeverk } from '@k9-sak-web/types';
import { DataFetcher, DataFetcherTriggers, EndpointOperations } from '@fpsak-frontend/rest-api-redux';

import { pathToBehandling, createLocationForSkjermlenke } from '../../app/paths';
import ApplicationContextPath from '../../behandling/ApplicationContextPath';
import { getEnabledApplicationContexts } from '../../app/duck';
import fpsakApi from '../../data/fpsakApi';
import { getSelectedSaksnummer } from '../../fagsak/fagsakSelectors';
import { getSelectedBehandlingId, getBehandlingVersjon } from '../../behandling/duck';

const historyRestApis = {
  [ApplicationContextPath.FPSAK]: fpsakApi.HISTORY_FPSAK,
  [ApplicationContextPath.FPTILBAKE]: fpsakApi.HISTORY_FPTILBAKE,
  [ApplicationContextPath.KLAGE]: fpsakApi.HISTORY_KLAGE,
};

interface History {
  opprettetTidspunkt: string;
  erTilbakekreving?: boolean;
  erKlage?: boolean;
  type: Kodeverk;
}

const sortAndTagTilbakekrevingAndKlage = createSelector<
  {
    historyFpsak: History[];
    historyFptilbake?: History[];
    historyKlage?: History[];
  },
  History[],
  History[]
>(
  [props => props.historyFpsak, props => props.historyFptilbake, props => props.historyKlage],
  (historyFpsak = [], historyFptilbake = [], historyKlage = []) => {
    const historikkFraTilbakekrevingMedMarkor = historyFptilbake.map(ht => ({
      ...ht,
      erTilbakekreving: true,
    }));
    const historikkFraKlageMedMarkor = historyKlage.map(ht => ({
      ...ht,
      erKlage: true,
    }));
    return historyFpsak
      .concat(historikkFraTilbakekrevingMedMarkor)
      .concat(historikkFraKlageMedMarkor)
      .sort((a, b) => moment(b.opprettetTidspunkt).diff(moment(a.opprettetTidspunkt)));
  },
);

interface OwnProps {
  enabledContexts: EndpointOperations[];
  saksnummer: string;
  behandlingId?: number;
  behandlingVersjon?: number;
  location: RouteProps['location'];
  alleKodeverkFpsak: { [key: string]: [KodeverkMedNavn] };
  alleKodeverkFptilbake?: { [key: string]: [KodeverkMedNavn] };
  alleKodeverkKlage?: { [key: string]: [KodeverkMedNavn] };
}

/**
 * HistoryIndex
 *
 * Container komponent. Har ansvar for å hente historiken for en fagsak fra state og vise den
 */
export const HistoryIndex: FunctionComponent<OwnProps> = ({
  enabledContexts,
  saksnummer,
  behandlingId,
  behandlingVersjon,
  location,
  alleKodeverkFpsak,
  alleKodeverkFptilbake,
  alleKodeverkKlage,
}) => {
  const getBehandlingLocation = useCallback(
    bId => ({
      ...location,
      pathname: pathToBehandling(saksnummer, bId),
    }),
    [location],
  );

  return (
    <DataFetcher
      fetchingTriggers={new DataFetcherTriggers({ behandlingId, behandlingVersion: behandlingVersjon }, false)}
      endpointParams={{
        [fpsakApi.HISTORY_FPSAK.name]: { saksnummer },
        [fpsakApi.HISTORY_FPTILBAKE.name]: { saksnummer },
      }}
      showOldDataWhenRefetching
      endpoints={enabledContexts}
      loadingPanel={<LoadingPanel />}
      render={(props: { historyFpsak: History[]; historyFptilbake?: History[] }) =>
        sortAndTagTilbakekrevingAndKlage(props).map(innslag => {
          let alleKodeverk;
          if (innslag.erTilbakekreving) alleKodeverk = alleKodeverkFptilbake;
          else if (innslag.erKlage) alleKodeverk = alleKodeverkKlage;
          else alleKodeverk = alleKodeverkFpsak;

          return (
            <HistorikkSakIndex
              key={innslag.opprettetTidspunkt + innslag.type.kode}
              historieInnslag={innslag}
              saksnummer={saksnummer}
              alleKodeverk={alleKodeverk}
              getBehandlingLocation={getBehandlingLocation}
              createLocationForSkjermlenke={createLocationForSkjermlenke}
            />
          );
        })
      }
    />
  );
};

const getEnabledContexts = createSelector([getEnabledApplicationContexts], enabledApplicationContexts =>
  enabledApplicationContexts.map(c => historyRestApis[c]),
);

const mapStateToProps = state => ({
  enabledContexts: getEnabledContexts(state),
  saksnummer: getSelectedSaksnummer(state),
  behandlingId: getSelectedBehandlingId(state),
  behandlingVersjon: getBehandlingVersjon(state),
  alleKodeverkFpsak: fpsakApi.KODEVERK.getRestApiData()(state),
  alleKodeverkFptilbake: fpsakApi.KODEVERK_FPTILBAKE.getRestApiData()(state),
  alleKodeverkKlage: fpsakApi.KODEVERK_KLAGE.getRestApiData()(state),
});

export default withRouter(connect(mapStateToProps)(HistoryIndex));
