import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { injectIntl } from 'react-intl';
import { parseQueryString } from '@fpsak-frontend/utils';
import errorHandler from '@fpsak-frontend/error-api-redux';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { getPathToFplos } from '@fpsak-frontend/fp-felles';

import Dashboard from './Dashboard';

const isRunningOnLocalhost = () => window.location.hostname === 'localhost';
const isComingFromK9Los = () => {
  const searchString = window.location.search;
  const queryParams = parseQueryString(searchString);
  return queryParams.kilde === 'k9-los' || queryParams.goto === 'k9-los';
};

/**
 * DashboardResolver
 *
 * Komponent som redirecter til Fplos eller går til fremsiden til Fpsak. Går alltid til Fpsak på utviklingsmiljø eller når Fplos ikke kan nåes
 */
export class DashboardResolver extends Component {
  state = { isLoading: true };

  componentDidMount = async () => {
    if (!isComingFromK9Los() || isRunningOnLocalhost()) {
      this.setState({ isLoading: false });
      return;
    }
    try {
      const url = getPathToFplos(window.location.href);
      await axios.get(url); // Sjekk om LOS er oppe
      window.location.assign(url);
    } catch (e) {
      const { addErrorMessage, intl } = this.props;
      this.setState(prevState => ({ ...prevState, isLoading: false }));
      addErrorMessage(intl.formatMessage({ id: 'DashboardResolver.FpLosErNede' }));
    }
  };

  render() {
    const { isLoading } = this.state;
    return !isRunningOnLocalhost() && isLoading ? <LoadingPanel /> : <Dashboard />;
  }
}

DashboardResolver.propTypes = {
  intl: PropTypes.shape().isRequired,
  addErrorMessage: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addErrorMessage: errorHandler.getErrorActionCreator(),
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(DashboardResolver));
