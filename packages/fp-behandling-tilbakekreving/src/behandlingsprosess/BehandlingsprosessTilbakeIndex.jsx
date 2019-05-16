import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { setSubmitFailed as dispatchSubmitFailed } from 'redux-form';

import { replaceNorwegianCharacters } from '@fpsak-frontend/utils';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import {
  trackRouteParam, requireProps, getBehandlingspunktLocation, getLocationWithDefaultBehandlingspunktAndFakta, BehandlingIdentifier,
} from '@fpsak-frontend/fp-felles';
import { BehandlingsprosessPanel } from '@fpsak-frontend/fp-behandling-felles';

import findBehandlingsprosessIcon from 'behandlingTilbakekreving/src/behandlingsprosess/statusIconHelper';
import TilbakekrevingBehandlingspunktInfoPanel from './components/TilbakekrevingBehandlingspunktInfoPanel';
import FatterTilbakekrevingVedtakStatusModal from './components/FatterTilbakekrevingVedtakStatusModal';
import {
  setSelectedBehandlingspunktNavn, resolveProsessAksjonspunkter, resetBehandlingspunkter, getSelectedBehandlingspunktNavn,
} from './duckBpTilbake';
import {
  getBehandlingVersjon, getBehandlingHenlagt,
} from '../selectors/tilbakekrevingBehandlingSelectors';
import tilbakekrevingAksjonspunktCodes from '../kodeverk/tilbakekrevingAksjonspunktCodes';
import { getBehandlingIdentifier } from '../duckTilbake';
import {
  getBehandlingspunkter, getSelectedBehandlingspunkt, getDefaultBehandlingspunkt,
  getBehandlingspunkterStatus, getBehandlingspunkterTitleCodes, getAksjonspunkterOpenStatus,
} from './behandlingsprosessTilbakeSelectors';

const formatBehandlingspunktName = (bpName = '') => replaceNorwegianCharacters(bpName.toLowerCase());

// TODO (TOR) Refaktorer: veldig mykje av dette er felles med andre behandlingstypar. Flytt ut i hooks?

/**
 * BehandlingsprosessTilbakeIndex
 *
 * Container komponent. Har ansvar for behandlingsprosess. Denne bruker valgt
 * fagsak og behandling for å generere opp korrekte behandlingspunkter og tilhørende aksjonspunkter.
 * Er også ansvarlig for alle serverkall. Dvs. henting av data og lagrefunksjonalitet.
 */
export class BehandlingsprosessTilbakeIndex extends Component {
  constructor() {
    super();

    this.state = { showFatterVedtakModal: false };

    this.setup = this.setup.bind(this);
    this.goToBehandlingspunkt = this.goToBehandlingspunkt.bind(this);
    this.goToBehandlingWithDefaultPunktAndFakta = this.goToBehandlingWithDefaultPunktAndFakta.bind(this);
    this.goToSearchPage = this.goToSearchPage.bind(this);
    this.submitVilkar = this.submitVilkar.bind(this);
  }

  componentDidMount() {
    this.setup();
  }

  componentDidUpdate(prevProps) {
    this.setup(prevProps.behandlingVersjon);
  }

  componentWillUnmount() {
    const { resetBehandlingspunkter: resetBp } = this.props;
    resetBp();
  }

  setup(prevBehandlingVersjon) {
    const { behandlingVersjon, resetBehandlingspunkter: resetBp } = this.props;
    if (behandlingVersjon !== prevBehandlingVersjon) {
      resetBp();
    }
  }

  /* NOTE: Denne er en slags toggle, selv om ikke navnet tilsier det */
  goToBehandlingspunkt(punktName) {
    const { selectedBehandlingspunkt, push: pushLocation, location } = this.props;
    if (!punktName || punktName === selectedBehandlingspunkt) {
      pushLocation(getBehandlingspunktLocation(location)(null));
    } else {
      pushLocation(getBehandlingspunktLocation(location)(formatBehandlingspunktName(punktName)));
    }
  }

  goToBehandlingWithDefaultPunktAndFakta() {
    const { push: pushLocation, location } = this.props;
    pushLocation(getLocationWithDefaultBehandlingspunktAndFakta(location));
  }

  goToSearchPage() {
    const { push: pushLocation } = this.props;
    pushLocation('/');
  }

  submitVilkar(aksjonspunktModels) {
    const {
      resolveProsessAksjonspunkter: resolveAksjonspunkter, behandlingIdentifier, behandlingVersjon,
    } = this.props;

    const models = aksjonspunktModels.map(ap => ({
      '@type': ap.kode,
      ...ap,
    }));
    const params = {
      ...behandlingIdentifier.toJson(),
      behandlingVersjon,
      bekreftedeAksjonspunktDtoer: models,
    };

    return resolveAksjonspunkter(behandlingIdentifier, params, true)
      .then(() => {
        const isFatterVedtakAp = aksjonspunktModels.some(ap => ap.kode === tilbakekrevingAksjonspunktCodes.FORESLA_VEDTAK);
        if (isFatterVedtakAp) {
          this.setState(prevState => ({ ...prevState, showFatterVedtakModal: true }));
        } else {
          this.goToBehandlingWithDefaultPunktAndFakta();
        }
      });
  }

  render() {
    const {
      behandlingspunkter, selectedBehandlingspunkt, dispatchSubmitFailed: submitFailedDispatch, isSelectedBehandlingHenlagt,
    } = this.props;
    const { showFatterVedtakModal } = this.state;
    return (
      <React.Fragment>
        <BehandlingsprosessPanel
          behandlingspunkter={behandlingspunkter}
          selectedBehandlingspunkt={selectedBehandlingspunkt}
          selectBehandlingspunktCallback={this.goToBehandlingspunkt}
          isSelectedBehandlingHenlagt={isSelectedBehandlingHenlagt}
          findBehandlingsprosessIcon={findBehandlingsprosessIcon}
          getBehandlingspunkterStatus={getBehandlingspunkterStatus}
          getBehandlingspunkterTitleCodes={getBehandlingspunkterTitleCodes}
          getAksjonspunkterOpenStatus={getAksjonspunkterOpenStatus}
        >
          <TilbakekrevingBehandlingspunktInfoPanel
            submitCallback={this.submitVilkar}
            dispatchSubmitFailed={submitFailedDispatch}
            selectedBehandlingspunkt={selectedBehandlingspunkt}
          />
        </BehandlingsprosessPanel>
        <FatterTilbakekrevingVedtakStatusModal closeEvent={this.goToSearchPage} showModal={showFatterVedtakModal} />
      </React.Fragment>
    );
  }
}

BehandlingsprosessTilbakeIndex.propTypes = {
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  behandlingspunkter: PropTypes.arrayOf(PropTypes.string),
  selectedBehandlingspunkt: PropTypes.string,
  resetBehandlingspunkter: PropTypes.func.isRequired,
  isSelectedBehandlingHenlagt: PropTypes.bool.isRequired,
  location: PropTypes.shape().isRequired,
  push: PropTypes.func.isRequired,
  resolveProsessAksjonspunkter: PropTypes.func.isRequired,
  dispatchSubmitFailed: PropTypes.func.isRequired,
};

BehandlingsprosessTilbakeIndex.defaultProps = {
  behandlingspunkter: undefined,
  selectedBehandlingspunkt: undefined,
};

const mapStateToProps = state => ({
  behandlingIdentifier: getBehandlingIdentifier(state),
  isSelectedBehandlingHenlagt: getBehandlingHenlagt(state),
  behandlingVersjon: getBehandlingVersjon(state),
  behandlingspunkter: getBehandlingspunkter(state),
  defaultBehandlingspunkt: getDefaultBehandlingspunkt(state),
  selectedBehandlingspunkt: getSelectedBehandlingspunkt(state),
  location: state.router.location,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    push,
    resolveProsessAksjonspunkter,
    resetBehandlingspunkter,
    dispatchSubmitFailed,
  }, dispatch),
});

const withPropsCheck = requireProps(['behandlingIdentifier', 'behandlingspunkter'], <LoadingPanel />)(BehandlingsprosessTilbakeIndex);
export default trackRouteParam({
  paramName: 'punkt',
  paramPropType: PropTypes.string,
  storeParam: setSelectedBehandlingspunktNavn,
  getParamFromStore: getSelectedBehandlingspunktNavn,
  isQueryParam: true,
})(connect(mapStateToProps, mapDispatchToProps)(withPropsCheck));
