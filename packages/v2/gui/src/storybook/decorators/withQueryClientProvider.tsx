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
  // key sørger for ny QueryClient per story, slik at cachet data ikke deles mellom stories
  return (Story, context) => (
    <QueryClientForStory key={context.id} defaultOptionsOverride={defaultOptionsOverride}>
      <Story />
    </QueryClientForStory>
  );
};
