import type { Decorator } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export const withQueryClientProvider: Decorator = Story => (
  <QueryClientProvider client={queryClient}>
    <Story />
  </QueryClientProvider>
);
