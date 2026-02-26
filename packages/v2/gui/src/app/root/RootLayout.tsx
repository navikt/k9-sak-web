import ErrorBoundary from '../feilmeldinger/ErrorBoundary.js';
import { Theme } from '@navikt/ds-react';
import { Outlet } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RootSuspense } from './suspense/RootSuspense.js';
import { PendingModalProvider } from '../../shared/pendingModal/PendingModalContext.js';

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
          <PendingModalProvider>
            <RootSuspense>
              <Outlet />
            </RootSuspense>
          </PendingModalProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </Theme>
  );
};
