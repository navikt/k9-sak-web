import type { Decorator } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { k9_sak_kontrakt_kompletthet_KompletthetsVurderingDto as KompletthetsVurdering } from '@navikt/k9-sak-typescript-client/types';

export const withFakeInntektsmeldingApi =
  (kompletthetsdata: KompletthetsVurdering): Decorator =>
  Story => {
    const mockBehandlingUuid = 'mock-behandling-uuid';
    
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    // Set up query data for useSuspenseQuery
    // We need to set both the data and ensure the query is in a "success" state
    queryClient.setQueryData(['kompletthet-beregning', mockBehandlingUuid], kompletthetsdata);
    
    // Ensure the query is properly initialized for useSuspenseQuery
    // This creates the query in the cache with the correct state
    const queryCache = queryClient.getQueryCache();
    const query = queryCache.find({ queryKey: ['kompletthet-beregning', mockBehandlingUuid] });
    if (query) {
      // Mark query as successful so useSuspenseQuery doesn't try to fetch
      query.setState({
        data: kompletthetsdata,
        dataUpdatedAt: Date.now(),
        status: 'success',
      });
    }

    return (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    );
  };
