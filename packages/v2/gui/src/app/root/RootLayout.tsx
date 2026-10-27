import ErrorBoundary from '../errorhandling/boundary/ErrorBoundary.js';
import { Theme } from '@navikt/ds-react';
import { Outlet } from 'react-router';
import { RootSuspense } from './suspense/RootSuspense.js';
import { createQueryClient } from '../../shared/query/queryClient.js';
import { QueryClientProvider } from '@tanstack/react-query';
import { GlobalUnhandledErrorCatcher } from '../errorhandling/GlobalUnhandledErrorCatcher.js';
import { useState } from 'react';

export const RootLayout = () => {
  // Opprett QueryClient berre éin gong per komponentlivssyklus. Ein inline createQueryClient()
  // i render ville laga ein ny instans ved kvar re-render og dermed nullstilt heile query-cachen.
  const [queryClient] = useState(createQueryClient);
  return (
    <Theme theme="light">
      <ErrorBoundary>
        <GlobalUnhandledErrorCatcher>
          <QueryClientProvider client={queryClient}>
            <RootSuspense>
              <Outlet />
            </RootSuspense>
          </QueryClientProvider>
        </GlobalUnhandledErrorCatcher>
      </ErrorBoundary>
    </Theme>
  );
};
