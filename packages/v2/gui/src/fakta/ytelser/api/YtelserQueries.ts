import { useYtelserApi } from './YtelserApiContext.js';

export const useYtelserOptions = (behandlingUuid: string) => {
  const api = useYtelserApi();
  return {
    queryKey: ['ytelser', behandlingUuid],
    queryFn: () => api.hentYtelser(behandlingUuid),
  };
};
