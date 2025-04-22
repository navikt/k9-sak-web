import { useContext } from 'react';

import { SaksbehandlernavnContext } from '../SaksbehandlernavnContext/SaksbehandlernavnContext';

export const useSaksbehandlerOppslag = () => {
  const navnPaaSaksbehandlereIBehandlingen = useContext(SaksbehandlernavnContext);

  const hentSaksbehandlerNavn = (saksbehandler: string): string => {
    if (navnPaaSaksbehandlereIBehandlingen?.[saksbehandler]) {
      return navnPaaSaksbehandlereIBehandlingen[saksbehandler];
    }
    return saksbehandler;
  };

  return { saksbehandlere: navnPaaSaksbehandlereIBehandlingen, hentSaksbehandlerNavn };
};
