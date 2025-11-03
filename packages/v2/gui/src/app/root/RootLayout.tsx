import ErrorBoundary from '../feilmeldinger/ErrorBoundary.js';
import { Theme } from '@navikt/ds-react';
import { Outlet } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RootSuspense } from './suspense/RootSuspense.js';

export const RootLayout = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <Theme theme="light">
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <RootSuspense>
            <Outlet />
          </RootSuspense>
        </QueryClientProvider>
      </ErrorBoundary>
    </Theme>
  );
};
