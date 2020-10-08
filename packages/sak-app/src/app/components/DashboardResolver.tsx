import React, { FunctionComponent, useState, useEffect } from 'react';
import axios from 'axios';
import { injectIntl, WrappedComponentProps } from 'react-intl';

import { parseQueryString } from '@fpsak-frontend/utils';
import { useRestApiErrorDispatcher } from '@fpsak-frontend/rest-api-hooks';
import { LoadingPanel } from '@fpsak-frontend/shared-components';

import { getPathToFplos } from '../paths';
import Dashboard from './Dashboard';

const isDevelopment = () => process.env.NODE_ENV === 'development';
const isRunningOnLocalhost = () => window.location.hostname === 'localhost';
const isComingFromK9Los = () => {
  const searchString = window.location.search;
  const queryParams = parseQueryString(searchString);
  return queryParams.kilde === 'k9-los';
};

/**
 * DashboardResolver
 *
 * Komponent som redirecter til Fplos eller går til fremsiden til Fpsak. Går alltid til Fpsak på utviklingsmiljø eller når Fplos ikke kan nåes
 */
export const DashboardResolver: FunctionComponent<WrappedComponentProps> = ({ intl }) => {
  const [isLoading, setLoading] = useState(true);

  const { addErrorMessage } = useRestApiErrorDispatcher();

  useEffect(() => {
    if (!isComingFromK9Los() || isRunningOnLocalhost()) {
      return;
    }

    const gotoLosOrSetErrorMsg = async () => {
      try {
        const url = getPathToFplos();
        await axios.get(url); // Sjekk om LOS er oppe
        window.location.assign(url);
      } catch (e) {
        setLoading(false);
        addErrorMessage(intl.formatMessage({ id: 'DashboardResolver.FpLosErNede' }));
      }
    };
    gotoLosOrSetErrorMsg();
  }, []);

  return !isDevelopment() && isLoading ? <LoadingPanel /> : <Dashboard />;
};

export default injectIntl(DashboardResolver);
