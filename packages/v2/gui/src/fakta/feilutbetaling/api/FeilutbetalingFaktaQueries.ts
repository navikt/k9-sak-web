import { useFeilutbetalingFaktaApi } from './FeilutbetalingFaktaApiContext.js';

export const useFeilutbetalingFaktaOptions = (behandlingUuid: string) => {
  const api = useFeilutbetalingFaktaApi();
  return {
    queryKey: ['feilutbetaling-fakta', behandlingUuid],
    queryFn: () => api.hentFeilutbetalingFakta(behandlingUuid),
  };
};

export const useFeilutbetalingÅrsakerOptions = () => {
  const api = useFeilutbetalingFaktaApi();
  return {
    queryKey: ['feilutbetaling-aarsaker'],
    queryFn: () => api.hentFeilutbetalingÅrsaker(),
  };
};
