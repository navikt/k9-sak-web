import { SaksbehandlernavnContext } from '@navikt/ft-plattform-komponenter';
import { useContext } from 'react';

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
