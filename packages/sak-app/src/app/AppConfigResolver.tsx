import React, { Component, ReactNode } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { LoadingPanel } from '@fpsak-frontend/shared-components';

import fpsakApi from '../data/fpsakApi';
import {
  fetchAlleKodeverk as fetchAlleKodeverkAC,
  isFinishedLoadingData,
  isFinishedLoadingErrorPageData,
} from './duck';

interface OwnProps {
  finishedLoadingBlockers: boolean;
  children: ReactNode;
  fetchNavAnsatt: () => void;
  fetchLanguageFile: () => void;
  fetchAlleKodeverk: () => void;
  fetchShowDetailedErrorMessages: () => void;
  appIsInErroneousState?: boolean;
  finishedLoadingErrorPageBlockers?: boolean;
}

class AppConfigResolver extends Component<OwnProps> {
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.resolveAppConfig();
  }

  componentDidMount() {
    const { fetchAlleKodeverk } = this.props;

    fetchAlleKodeverk();
  }

  resolveAppConfig = () => {
    const { fetchNavAnsatt, fetchLanguageFile, fetchShowDetailedErrorMessages } = this.props;

    fetchNavAnsatt();
    fetchLanguageFile();
    fetchShowDetailedErrorMessages();
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
  finishedLoadingErrorPageBlockers: isFinishedLoadingErrorPageData(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchNavAnsatt: fpsakApi.NAV_ANSATT.makeRestApiRequest(),
      fetchLanguageFile: fpsakApi.LANGUAGE_FILE.makeRestApiRequest(),
      fetchShowDetailedErrorMessages: fpsakApi.SHOW_DETAILED_ERROR_MESSAGES.makeRestApiRequest(),
      fetchAlleKodeverk: fetchAlleKodeverkAC,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(AppConfigResolver);
