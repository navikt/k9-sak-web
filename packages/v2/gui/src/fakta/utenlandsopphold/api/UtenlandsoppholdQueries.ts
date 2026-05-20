import { useUtenlandsoppholdApi } from './UtenlandsoppholdApiContext.js';

export const useUtenlandsoppholdOptions = (behandlingUuid: string) => {
  const api = useUtenlandsoppholdApi();
  return {
    queryKey: ['utenlandsopphold', behandlingUuid],
    queryFn: () => api.hentUtenlandsopphold(behandlingUuid),
  };
};
