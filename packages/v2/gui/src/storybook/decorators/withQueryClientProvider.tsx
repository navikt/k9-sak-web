import type { Decorator } from '@storybook/react';
import { type DefaultOptions, QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from '../../shared/query/queryClient.js';

type DefaultOptionsOverride = Pick<DefaultOptions, 'queries' | 'mutations'>;

export const withQueryClientProvider = (defaultOptionsOverride?: DefaultOptionsOverride): Decorator => {
  const queryClient = createQueryClient({
    ...defaultOptionsOverride,
    queries: {
      retry: false,
      ...defaultOptionsOverride?.queries,
    },
  });

  return Story => (
    <QueryClientProvider client={queryClient}>
      <Story />
    </QueryClientProvider>
  );
};
