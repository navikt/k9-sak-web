import useGlobalStateRestApiData from '@k9-sak-web/rest-api-hooks/src/global-data/useGlobalStateRestApiData';
import { K9sakApiKeys } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import { SaksbehandlereInfo } from '@k9-sak-web/types';

export const useSaksbehandlerOppslag = () => {
  const data = useGlobalStateRestApiData<SaksbehandlereInfo>(K9sakApiKeys.HENT_SAKSBEHANDLERE);
  const saksbehandlere = data?.saksbehandlere;

  const hentSaksbehandlerNavn = (saksbehandler: string): string => {
    if (saksbehandlere && saksbehandlere[saksbehandler]) {
      return saksbehandlere[saksbehandler];
    }
    return saksbehandler;
  };

  return { saksbehandlere, hentSaksbehandlerNavn };
};

export default useSaksbehandlerOppslag;
