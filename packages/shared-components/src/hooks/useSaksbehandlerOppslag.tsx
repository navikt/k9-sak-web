import useGlobalStateRestApiData from '@k9-sak-web/rest-api-hooks/src/global-data/useGlobalStateRestApiData';
import { K9sakApiKeys } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import { SaksbehandlereInfo } from '@k9-sak-web/types';

export const useSaksbehandlerOppslag = () => {
  const { saksbehandlere } = useGlobalStateRestApiData<SaksbehandlereInfo>(K9sakApiKeys.HENT_SAKSBEHANDLERE);

  const hentSaksbehandlerNavn = (saksbehandler: string): string => saksbehandlere[saksbehandler] || saksbehandler;

  return { saksbehandlere, hentSaksbehandlerNavn };
};

export default useSaksbehandlerOppslag;
