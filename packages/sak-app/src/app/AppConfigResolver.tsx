import React, { Component, ReactNode } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { LoadingPanel } from '@fpsak-frontend/shared-components';

import fpsakApi from '../data/fpsakApi';
import {
  fetchAlleKodeverk as fetchAlleKodeverkAC,
  getFeatureToggles,
  isFinishedLoadingData,
  fetchAllFeatureToggles,
  isFinishedLoadingErrorPageData,
} from './duck';

interface OwnProps {
  finishedLoadingBlockers: boolean;
  children: ReactNode;
  fetchNavAnsatt: () => void;
  fetchLanguageFile: () => void;
  fetchAlleKodeverk: (featureToggles: {}) => void;
  fetchShowDetailedErrorMessages: () => void;
  fetchFeatureToggles: () => void;
  featureToggles: {};
  appIsInErroneousState?: boolean;
  finishedLoadingErrorPageBlockers?: boolean;
}

class AppConfigResolver extends Component<OwnProps> {
  static defaultProps = {
    featureToggles: undefined,
  };

  constructor(props) {
    super(props);
    this.resolveAppConfig();
  }

  componentDidUpdate(prevProps) {
    const { fetchAlleKodeverk, featureToggles } = this.props;

    if (featureToggles !== prevProps.featureToggles) {
      fetchAlleKodeverk(featureToggles);
    }
  }

  resolveAppConfig = () => {
    const { fetchNavAnsatt, fetchLanguageFile, fetchShowDetailedErrorMessages, fetchFeatureToggles } = this.props;

    fetchNavAnsatt();
    fetchLanguageFile();
    fetchShowDetailedErrorMessages();
    fetchFeatureToggles();
  };

  render = () => {
    const { finishedLoadingBlockers, children, appIsInErroneousState, finishedLoadingErrorPageBlockers } = this.props;
    if (appIsInErroneousState && finishedLoadingErrorPageBlockers) {
      return children;
    }
    if (!finishedLoadingBlockers) {
      return <LoadingPanel />;
    }
    return children;
  };
}

const mapStateToProps = state => ({
  finishedLoadingBlockers: isFinishedLoadingData(state),
  featureToggles: getFeatureToggles(state),
  finishedLoadingErrorPageBlockers: isFinishedLoadingErrorPageData(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchNavAnsatt: fpsakApi.NAV_ANSATT.makeRestApiRequest(),
      fetchLanguageFile: fpsakApi.LANGUAGE_FILE.makeRestApiRequest(),
      fetchShowDetailedErrorMessages: fpsakApi.SHOW_DETAILED_ERROR_MESSAGES.makeRestApiRequest(),
      fetchAlleKodeverk: fetchAlleKodeverkAC,
      fetchFeatureToggles: fetchAllFeatureToggles,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(AppConfigResolver);
