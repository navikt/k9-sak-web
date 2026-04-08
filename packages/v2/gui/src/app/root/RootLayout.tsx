import ErrorBoundary from '../errorhandling/feilmeldinger/ErrorBoundary.js';
import { Theme } from '@navikt/ds-react';
import { Outlet } from 'react-router';
import { RootSuspense } from './suspense/RootSuspense.js';
import { createQueryClient } from '../../shared/query/queryClient.js';
import { QueryClientProvider } from '@tanstack/react-query';

export const RootLayout = () => {
  return (
    <Theme theme="light">
      <ErrorBoundary>
        <QueryClientProvider client={createQueryClient()}>
          <RootSuspense>
            <Outlet />
          </RootSuspense>
        </QueryClientProvider>
      </ErrorBoundary>
    </Theme>
  );
};
