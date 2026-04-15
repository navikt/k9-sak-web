import { useUtenlandsoppholdApi } from './UtenlandsoppholdApiContext.js';

export const hentUtenlandsoppholdOptions = (
  api: ReturnType<typeof useUtenlandsoppholdApi>,
  behandlingUuid: string,
) => {
  return {
    queryKey: ['utenlandsopphold', behandlingUuid],
    queryFn: () => api.hentUtenlandsopphold(behandlingUuid),
  };
};

export const useUtenlandsoppholdQueryOptions = (behandlingUuid: string) => {
  const api = useUtenlandsoppholdApi();
  return hentUtenlandsoppholdOptions(api, behandlingUuid);
};
