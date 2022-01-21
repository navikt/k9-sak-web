import { QueryClient } from 'react-query';

const queryClient = new QueryClient();
queryClient.setQueryDefaults('diagnosekodeResponse', {
    placeholderData: { diagnosekoder: [], links: [], behandlingUuid: '', versjon: null },
    staleTime: 10000,
});

export default queryClient