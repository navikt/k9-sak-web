import type { Decorator } from '@storybook/react';
import { type DefaultOptions, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useState } from 'react';
import { createQueryClient } from '../../shared/query/queryClient.js';

type DefaultOptionsOverride = Pick<DefaultOptions, 'queries' | 'mutations'>;

const QueryClientForStory = ({
  defaultOptionsOverride,
  children,
}: {
  defaultOptionsOverride?: DefaultOptionsOverride;
  children: ReactNode;
}) => {
  // Denne ligger i useState sånn at createQueryClient kun kjøres ved mount av komponenten, og ikke ved hver render.
  const [queryClient] = useState(() =>
    createQueryClient({
      ...defaultOptionsOverride,
      queries: {
        retry: false,
        ...defaultOptionsOverride?.queries,
      },
    }),
  );
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export const withQueryClientProvider = (defaultOptionsOverride?: DefaultOptionsOverride): Decorator => {
  // Når man bruker key prop vil React remounte komponenten hver gang key endrer seg, og dermed opprettes en ny QueryClient.
  return (Story, context) => (
    <QueryClientForStory key={context.id} defaultOptionsOverride={defaultOptionsOverride}>
      <Story />
    </QueryClientForStory>
  );
};
