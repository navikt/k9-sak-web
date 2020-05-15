import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import moment from 'moment';

import { DataFetcher } from '@fpsak-frontend/fp-felles';
import HistorikkSakIndex from '@fpsak-frontend/sak-historikk';

import ApplicationContextPath from '../../behandling/ApplicationContextPath';
import { getEnabledApplicationContexts } from '../../app/duck';
import fpsakApi from '../../data/fpsakApi';
import { getSelectedSaksnummer } from '../../fagsak/fagsakSelectors';
import { getSelectedBehandlingId, getBehandlingVersjon } from '../../behandling/duck';
import { getAlleFpSakKodeverk, getAlleFpTilbakeKodeverk, getAlleKlagekodeverk } from "../../kodeverk/duck";

const historyRestApis = {
  [ApplicationContextPath.FPSAK]: fpsakApi.HISTORY_FPSAK,
  [ApplicationContextPath.FPTILBAKE]: fpsakApi.HISTORY_FPTILBAKE,
  [ApplicationContextPath.KLAGE]: fpsakApi.HISTORY_KLAGE
};

const sortAndTagTilbakekrevingAndKlage = createSelector(
  [props => props.historyFpsak, props => props.historyFptilbake, props => props.historyKlage],
  (historyFpsak = [], historyFptilbake = [], historyKlage = []) => {
    const historikkFraTilbakekrevingMedMarkor = historyFptilbake.map((ht) => ({
      ...ht,
      erTilbakekreving: true,
    }));
    const historikkFraKlageMedMarkor = historyKlage.map((ht) => ({
      ...ht,
      erKlage: true
    }));
    return historyFpsak
      .concat(historikkFraTilbakekrevingMedMarkor)
      .concat(historikkFraKlageMedMarkor)
      .sort((a, b) => moment(b.opprettetTidspunkt) - moment(a.opprettetTidspunkt));
  },
);


/**
 * HistoryIndex
 *
 * Container komponent. Har ansvar for å hente historiken for en fagsak fra state og vise den
 */
export const HistoryIndex = ({
  enabledContexts,
  saksnummer,
  behandlingId,
  behandlingVersjon,
  location,
  alleKodeverkFpsak,
  alleKodeverkFptilbake,
  alleKodeverkKlage
}) => (
  <DataFetcher
    behandlingId={behandlingId}
    behandlingVersjon={behandlingVersjon}
    showLoadingIcon
    behandlingNotRequired
    endpointParams={{
      [fpsakApi.HISTORY_FPSAK.name]: {saksnummer},
      [fpsakApi.HISTORY_FPTILBAKE.name]: {saksnummer},
      [fpsakApi.HISTORY_KLAGE.name]: {saksnummer}
    }}
    keepDataWhenRefetching
    endpoints={enabledContexts}
    allowErrors
    render={(props) => sortAndTagTilbakekrevingAndKlage(props)
      .map((innslag) => {

        let alleKodeverk;
        if (innslag.erTilbakekreving) alleKodeverk = alleKodeverkFptilbake;
        else if (innslag.erKlage) alleKodeverk = alleKodeverkKlage;
        else alleKodeverk = alleKodeverkFpsak;

        return (
          <HistorikkSakIndex
            key={innslag.opprettetTidspunkt + innslag.type.kode}
            historieInnslag={innslag}
            saksnummer={saksnummer}
            location={location}
            alleKodeverk={alleKodeverk}
          />
        );
      })}
  />
);

HistoryIndex.propTypes = {
  enabledContexts: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  saksnummer: PropTypes.string.isRequired,
  behandlingId: PropTypes.number,
  behandlingVersjon: PropTypes.number,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  alleKodeverkFpsak: PropTypes.shape().isRequired,
  alleKodeverkFptilbake: PropTypes.shape(),
  alleKodeverkKlage: PropTypes.shape()
};

HistoryIndex.defaultProps = {
  alleKodeverkFptilbake: {},
  behandlingId: undefined,
  behandlingVersjon: undefined,
};

const getEnabledContexts = createSelector(
  [getEnabledApplicationContexts],
  (enabledApplicationContexts) => enabledApplicationContexts.map((c) => historyRestApis[c]),
);

const mapStateToProps = (state) => ({
  enabledContexts: getEnabledContexts(state),
  saksnummer: getSelectedSaksnummer(state),
  behandlingId: getSelectedBehandlingId(state),
  behandlingVersjon: getBehandlingVersjon(state),
  alleKodeverkFpsak: getAlleFpSakKodeverk(state),
  alleKodeverkFptilbake: getAlleFpTilbakeKodeverk(state),
  alleKodeverkKlage: getAlleKlagekodeverk(state)
});

export default withRouter(connect(mapStateToProps)(HistoryIndex));
