import ErrorBoundary from '../errorhandling/boundary/ErrorBoundary.js';
import { Theme } from '@navikt/ds-react';
import { Outlet } from 'react-router';
import { RootSuspense } from './suspense/RootSuspense.js';
import { createQueryClient } from '../../shared/query/queryClient.js';
import { QueryClientProvider } from '@tanstack/react-query';
import { GlobalUnhandledErrorCatcher } from '../errorhandling/GlobalUnhandledErrorCatcher.js';

export const RootLayout = () => {
  return (
    <Theme theme="light">
      <ErrorBoundary>
        <GlobalUnhandledErrorCatcher>
          <QueryClientProvider client={createQueryClient()}>
            <RootSuspense>
              <Outlet />
            </RootSuspense>
          </QueryClientProvider>
        </GlobalUnhandledErrorCatcher>
      </ErrorBoundary>
    </Theme>
  );
};
