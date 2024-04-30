import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';

import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';

import { IS_DEV } from '../../constants';
import FagsakSearchIndex from '../../fagsakSearch/FagsakSearchIndex';
import { getPathToK9Los } from '../paths';

const isDevelopment = () => IS_DEV || process.env.NODE_ENV === 'test';

/**
 * DashboardResolver
 *
 * Komponent som redirecter til Fplos eller går til fremsiden til Fpsak. Går alltid til Fpsak på utviklingsmiljø eller når Fplos ikke kan nåes
 */
export const DashboardResolver = ({ intl }: WrappedComponentProps) => {
  const [isLoading, setLoading] = useState(true);

  const { addErrorMessage } = useRestApiErrorDispatcher();

  useEffect(() => {
    if (isDevelopment()) {
      return;
    }

    const gotoLosOrSetErrorMsg = async () => {
      try {
        const url = getPathToK9Los();
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
