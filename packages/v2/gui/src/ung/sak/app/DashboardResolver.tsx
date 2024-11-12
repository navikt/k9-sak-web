import axios from 'axios';
import { useEffect, useState } from 'react';

import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';

import LoadingPanel from '../../../shared/LoadingPanel/LoadingPanel';
import { IS_DEV } from '../../../utils/constants';
import FagsakSearchIndex from './FagsakSearchIndex';
import { getPathToK9Los } from './paths';
import type UngSakBackendClient from './UngSakBackendClient';

const isDevelopment = () => IS_DEV || process.env['NODE_ENV'] === 'test';

interface DashboardResolverProps {
  ungSakBackendClient: UngSakBackendClient;
}

/**
 * DashboardResolver
 *
 * Komponent som redirecter til Fplos eller går til fremsiden til Fpsak. Går alltid til Fpsak på utviklingsmiljø eller når Fplos ikke kan nåes
 */
export const DashboardResolver = ({ ungSakBackendClient }: DashboardResolverProps) => {
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
        addErrorMessage('Forsiden har nedetid');
      }
    };
    gotoLosOrSetErrorMsg();
  }, []);

  return !isDevelopment() && isLoading ? (
    <LoadingPanel />
  ) : (
    <FagsakSearchIndex ungSakBackendClient={ungSakBackendClient} />
  );
};

export default DashboardResolver;
