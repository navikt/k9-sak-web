import type { Decorator } from '@storybook/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from "../../shared/query/queryClient.js";

const queryClient = createQueryClient({
  queries: {
    retry: false,
  },
})

export const withQueryClientProvider: Decorator = Story => (
  <QueryClientProvider client={queryClient}>
    <Story />
  </QueryClientProvider>
);
