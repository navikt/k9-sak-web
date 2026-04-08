import { createQueryClient } from '@k9-sak-web/gui/shared/queryClient.js';

const queryClient = createQueryClient();
queryClient.setQueryDefaults(['diagnosekodeResponse'], {
  placeholderData: { diagnosekoder: [], links: [], behandlingUuid: '', versjon: null },
  staleTime: 10000,
});

export default queryClient;
