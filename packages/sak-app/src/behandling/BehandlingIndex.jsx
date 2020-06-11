import React, { Component, Suspense } from 'react';
import { createSelector } from 'reselect';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';

import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import errorHandler from '@fpsak-frontend/error-api-redux';
import { replaceNorwegianCharacters } from '@fpsak-frontend/utils';
import { LoadingPanel, requireProps } from '@fpsak-frontend/shared-components';
import {
  getBehandlingspunktLocation,
  getFaktaLocation,
  getLocationWithDefaultBehandlingspunktAndFakta,
} from '@fpsak-frontend/fp-felles';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { navAnsattPropType } from '@fpsak-frontend/prop-types';

import { getAlleKodeverkForBehandlingstype } from '../kodeverk/duck';
import {
  getSelectedFagsakStatus,
  getFagsakPerson,
  getSaksnummer,
  getFagsakYtelseType,
  isForeldrepengerFagsak,
  getKanRevurderingOpprettes,
  getSkalBehandlesAvInfotrygd,
} from '../fagsak/fagsakSelectors';
import { getNavAnsatt, getFeatureToggles } from '../app/duck';
import trackRouteParam from '../app/trackRouteParam';
import { reduxRestApi } from '../data/fpsakApi';
import {
  setUrlBehandlingId,
  setSelectedBehandlingIdOgVersjon,
  getTempBehandlingVersjon,
  getUrlBehandlingId,
  oppdaterBehandlingVersjon as oppdaterVersjon,
  resetBehandlingContext as resetBehandlingContextActionCreator,
} from './duck';
import {
  getBehandlingerTypesMappedById,
  getBehandlingerInfo,
  getBehandlingerLinksMappedById,
} from './selectors/behandlingerSelectors';
import behandlingEventHandler from './BehandlingEventHandler';
import ErrorBoundary from './ErrorBoundary';

const BehandlingPleiepengerIndex = React.lazy(() => import('@fpsak-frontend/behandling-pleiepenger'));
const BehandlingOmsorgspengerIndex = React.lazy(() => import('@fpsak-frontend/behandling-omsorgspenger'));
const BehandlingInnsynIndex = React.lazy(() => import('@fpsak-frontend/behandling-innsyn'));
const BehandlingKlageIndex = React.lazy(() => import('@fpsak-frontend/behandling-klage'));
const BehandlingTilbakekrevingIndex = React.lazy(() => import('@fpsak-frontend/behandling-tilbakekreving'));
const BehandlingAnkeIndex = React.lazy(() => import('@fpsak-frontend/behandling-anke'));
const BehandlingFrisinnIndex = React.lazy(() => import('@fpsak-frontend/behandling-frisinn'));

const erTilbakekreving = behandlingType =>
  behandlingType === BehandlingType.TILBAKEKREVING || behandlingType === BehandlingType.TILBAKEKREVING_REVURDERING;
const formatName = (bpName = '') => replaceNorwegianCharacters(bpName.toLowerCase());

/**
 * BehandlingIndex
 *
 * Container-komponent. Er rot for for den delen av hovedvinduet som har innhold for en valgt behandling, og styrer livssyklusen til de mekanismene som er
 * relatert til den valgte behandlingen.
 *
 * Komponenten har ansvar å legge valgt behandlingId fra URL-en i staten.
 */
export class BehandlingIndex extends Component {
  static propTypes = {
    behandlingId: PropTypes.number.isRequired,
    behandlingType: PropTypes.string.isRequired,
    behandlingVersjon: PropTypes.number.isRequired,
    location: PropTypes.shape().isRequired,
    oppdaterBehandlingVersjon: PropTypes.func.isRequired,
    resetBehandlingContext: PropTypes.func.isRequired,
    setBehandlingIdOgVersjon: PropTypes.func.isRequired,
    featureToggles: PropTypes.shape().isRequired,
    kodeverk: PropTypes.shape().isRequired,
    fagsak: PropTypes.shape({
      fagsakStatus: PropTypes.shape().isRequired,
      fagsakPerson: PropTypes.shape().isRequired,
      fagsakYtelseType: PropTypes.shape().isRequired,
      isForeldrepengerFagsak: PropTypes.bool.isRequired,
      kanRevurderingOpprettes: PropTypes.bool.isRequired,
      skalBehandlesAvInfotrygd: PropTypes.bool.isRequired,
    }).isRequired,
    fagsakBehandlingerInfo: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        type: PropTypes.shape({
          kode: PropTypes.string.isRequired,
        }).isRequired,
        avsluttet: PropTypes.string,
      }),
    ).isRequired,
    behandlingLinks: PropTypes.arrayOf(
      PropTypes.shape({
        href: PropTypes.string.isRequired,
        rel: PropTypes.string.isRequired,
        requestPayload: PropTypes.any,
        type: PropTypes.string.isRequired,
      }),
    ).isRequired,
    navAnsatt: navAnsattPropType.isRequired,
    push: PropTypes.func.isRequired,
    visFeilmelding: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const { setBehandlingIdOgVersjon, behandlingVersjon } = props;
    reduxRestApi.injectPaths(props.behandlingLinks);
    setBehandlingIdOgVersjon(behandlingVersjon);
  }

  componentDidUpdate(prevProps) {
    const { behandlingId, behandlingLinks, setBehandlingIdOgVersjon, behandlingVersjon } = this.props;
    if (behandlingId !== prevProps.behandlingId) {
      reduxRestApi.injectPaths(behandlingLinks);
      setBehandlingIdOgVersjon(behandlingVersjon);
    }
  }

  componentWillUnmount() {
    const { resetBehandlingContext } = this.props;
    resetBehandlingContext();
  }

  goToValgtProsessStegOgFaktaPanel = (prosessStegId, faktaPanelId) => {
    const { push: pushLocation, location } = this.props;
    let newLocation;
    if (prosessStegId === 'default') {
      newLocation = getLocationWithDefaultBehandlingspunktAndFakta(location);
    } else if (prosessStegId) {
      newLocation = getBehandlingspunktLocation(location)(formatName(prosessStegId));
    } else {
      newLocation = getBehandlingspunktLocation(location)(null);
    }

    if (faktaPanelId === 'default') {
      newLocation = getFaktaLocation(newLocation)('default');
    } else if (faktaPanelId) {
      newLocation = getFaktaLocation(newLocation)(formatName(faktaPanelId));
    } else {
      newLocation = getFaktaLocation(newLocation)(null);
    }

    pushLocation(newLocation);
  };

  goToValgtProsessSteg = prosessId => {
    const { push: pushLocation, location } = this.props;
    if (prosessId === 'default') {
      pushLocation(getLocationWithDefaultBehandlingspunktAndFakta(location));
    } else if (prosessId) {
      pushLocation(getBehandlingspunktLocation(location)(formatName(prosessId)));
    } else {
      pushLocation(getBehandlingspunktLocation(location)(null));
    }
  };

  goToSearchPage = () => {
    const { push: pushLocation } = this.props;
    pushLocation('/');
  };

  render() {
    const {
      behandlingId,
      behandlingType,
      location,
      oppdaterBehandlingVersjon,
      featureToggles,
      kodeverk,
      fagsak,
      fagsakBehandlingerInfo,
      navAnsatt,
      visFeilmelding,
    } = this.props;

    const defaultProps = {
      behandlingId,
      oppdaterBehandlingVersjon,
      behandlingEventHandler,
      kodeverk,
      fagsak,
      navAnsatt,
      valgtProsessSteg: location.query.punkt,
      opneSokeside: this.goToSearchPage,
      key: behandlingId,
    };

    if (behandlingType === BehandlingType.DOKUMENTINNSYN) {
      return (
        <Suspense fallback={<LoadingPanel />}>
          <ErrorBoundary key={behandlingId} errorMessageCallback={visFeilmelding}>
            <BehandlingInnsynIndex oppdaterProsessStegIUrl={this.goToValgtProsessSteg} {...defaultProps} />
          </ErrorBoundary>
        </Suspense>
      );
    }

    if (behandlingType === BehandlingType.KLAGE) {
      return (
        <Suspense fallback={<LoadingPanel />}>
          <ErrorBoundary key={behandlingId} errorMessageCallback={visFeilmelding}>
            <BehandlingKlageIndex
              oppdaterProsessStegIUrl={this.goToValgtProsessSteg}
              alleBehandlinger={fagsakBehandlingerInfo}
              {...defaultProps}
            />
          </ErrorBoundary>
        </Suspense>
      );
    }

    if (behandlingType === BehandlingType.ANKE) {
      return (
        <Suspense fallback={<LoadingPanel />}>
          <ErrorBoundary key={behandlingId} errorMessageCallback={visFeilmelding}>
            <BehandlingAnkeIndex
              oppdaterProsessStegIUrl={this.goToValgtProsessSteg}
              alleBehandlinger={fagsakBehandlingerInfo}
              {...defaultProps}
            />
          </ErrorBoundary>
        </Suspense>
      );
    }

    if (erTilbakekreving(behandlingType)) {
      return (
        <Suspense fallback={<LoadingPanel />}>
          <ErrorBoundary key={behandlingId} errorMessageCallback={visFeilmelding}>
            <BehandlingTilbakekrevingIndex
              oppdaterProsessStegIUrl={this.goToValgtProsessSteg}
              harApenRevurdering={fagsakBehandlingerInfo.some(
                b => b.type.kode === BehandlingType.REVURDERING && b.status.kode !== behandlingStatus.AVSLUTTET,
              )}
              {...defaultProps}
            />
          </ErrorBoundary>
        </Suspense>
      );
    }

    if (fagsak.fagsakYtelseType.kode === 'OMP') {
      return (
        <Suspense fallback={<LoadingPanel />}>
          <ErrorBoundary key={behandlingId} errorMessageCallback={visFeilmelding}>
            <BehandlingOmsorgspengerIndex
              featureToggles={featureToggles}
              oppdaterProsessStegOgFaktaPanelIUrl={this.goToValgtProsessStegOgFaktaPanel}
              valgtFaktaSteg={location.query.fakta}
              {...defaultProps}
            />
          </ErrorBoundary>
        </Suspense>
      );
    }

    if (fagsak.fagsakYtelseType.kode === 'FRISINN') {
      return (
        <Suspense fallback={<LoadingPanel />}>
          <ErrorBoundary key={behandlingId} errorMessageCallback={visFeilmelding}>
            <BehandlingFrisinnIndex
              featureToggles={featureToggles}
              oppdaterProsessStegOgFaktaPanelIUrl={this.goToValgtProsessStegOgFaktaPanel}
              valgtFaktaSteg={location.query.fakta}
              {...defaultProps}
            />
          </ErrorBoundary>
        </Suspense>
      );
    }

    return (
      <Suspense fallback={<LoadingPanel />}>
        <ErrorBoundary key={behandlingId} errorMessageCallback={visFeilmelding}>
          <BehandlingPleiepengerIndex
            featureToggles={featureToggles}
            oppdaterProsessStegOgFaktaPanelIUrl={this.goToValgtProsessStegOgFaktaPanel}
            valgtFaktaSteg={location.query.fakta}
            {...defaultProps}
          />
        </ErrorBoundary>
      </Suspense>
    );
  }
}

export const getFagsakInfo = createSelector(
  [
    getSaksnummer,
    getSelectedFagsakStatus,
    getFagsakPerson,
    getFagsakYtelseType,
    isForeldrepengerFagsak,
    getKanRevurderingOpprettes,
    getSkalBehandlesAvInfotrygd,
  ],
  (
    saksnummer,
    fagsakStatus,
    fagsakPerson,
    fagsakYtelseType,
    isForeldrepenger,
    kanRevurderingOpprettes,
    skalBehandlesAvInfotrygd,
  ) => ({
    saksnummer,
    fagsakStatus,
    fagsakPerson,
    fagsakYtelseType,
    kanRevurderingOpprettes,
    skalBehandlesAvInfotrygd,
    isForeldrepengerFagsak: isForeldrepenger,
  }),
);

const mapStateToProps = state => {
  const behandlingId = getUrlBehandlingId(state);
  const behandlingType = getBehandlingerTypesMappedById(state)[behandlingId];
  return {
    behandlingId,
    behandlingType,
    behandlingVersjon: getTempBehandlingVersjon(state),
    location: state.router.location,
    featureToggles: getFeatureToggles(state),
    kodeverk: getAlleKodeverkForBehandlingstype(behandlingType)(state),
    fagsakBehandlingerInfo: getBehandlingerInfo(state),
    behandlingLinks: getBehandlingerLinksMappedById(state)[behandlingId],
    navAnsatt: getNavAnsatt(state),
    fagsak: getFagsakInfo(state),
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      oppdaterBehandlingVersjon: oppdaterVersjon,
      resetBehandlingContext: resetBehandlingContextActionCreator,
      setBehandlingIdOgVersjon: setSelectedBehandlingIdOgVersjon,
      visFeilmelding: errorHandler.getErrorActionCreator(),
      push,
    },
    dispatch,
  );

export default trackRouteParam({
  paramName: 'behandlingId',
  parse: behandlingFromUrl => Number.parseInt(behandlingFromUrl, 10),
  paramPropType: PropTypes.number,
  storeParam: setUrlBehandlingId,
  getParamFromStore: getUrlBehandlingId,
})(connect(mapStateToProps, mapDispatchToProps)(requireProps(['behandlingId', 'behandlingType'])(BehandlingIndex)));
