import { useUtenlandsoppholdApi } from './UtenlandsoppholdApiContext';

export const hentUtenlandsoppholdOptions = (behandlingUuid: string) => {
  const api = useUtenlandsoppholdApi();
  return {
    queryKey: ['utenlandsopphold', behandlingUuid],
    queryFn: () => api.hentUtenlandsopphold(behandlingUuid),
  };
};
