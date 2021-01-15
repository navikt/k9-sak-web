import React, { FunctionComponent, useState, useEffect } from 'react';
import axios from 'axios';
import { injectIntl, WrappedComponentProps } from 'react-intl';

import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import { LoadingPanel } from '@fpsak-frontend/shared-components';

import { getPathToFplos } from '../paths';
import FagsakSearchIndex from '../../fagsakSearch/FagsakSearchIndex';

const isDevelopment = () => process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

/**
 * DashboardResolver
 *
 * Komponent som redirecter til Fplos eller går til fremsiden til Fpsak. Går alltid til Fpsak på utviklingsmiljø eller når Fplos ikke kan nåes
 */
export const DashboardResolver: FunctionComponent<WrappedComponentProps> = ({ intl }) => {
  const [isLoading, setLoading] = useState(true);

  const { addErrorMessage } = useRestApiErrorDispatcher();

  useEffect(() => {
    if (isDevelopment()) {
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

  return !isDevelopment() && isLoading ? <LoadingPanel /> : <FagsakSearchIndex />;
};

export default injectIntl(DashboardResolver);
