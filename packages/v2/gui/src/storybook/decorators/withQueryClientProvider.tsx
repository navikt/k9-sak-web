import type { Decorator } from '@storybook/react';
import { type DefaultOptions, type QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from '../../shared/query/queryClient.js';

type DefaultOptionsOverride = Pick<DefaultOptions, 'queries' | 'mutations'>;

export const withQueryClientProvider = (defaultOptionsOverride?: DefaultOptionsOverride): Decorator => {
  let storyQueryClient: { storyId: string; client: QueryClient } | undefined;

  return (Story, context) => {
    if (storyQueryClient?.storyId !== context.id) {
      // Klienten må overleve en første render som forkastes når en story suspenderer.
      storyQueryClient = {
        storyId: context.id,
        client: createQueryClient({
          ...defaultOptionsOverride,
          queries: {
            retry: false,
            ...defaultOptionsOverride?.queries,
          },
        }),
      };
    }

    return (
      <QueryClientProvider client={storyQueryClient.client}>
        <Story />
      </QueryClientProvider>
    );
  };
};
