import ErrorBoundary from '../feilmeldinger/ErrorBoundary.js';
import { Theme } from '@navikt/ds-react';
import { Outlet } from 'react-router';
import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RootSuspense } from './suspense/RootSuspense.js';
import { isErrorWithAlertInfo } from '../alerts/AlertInfo.js';
import GeneralAsyncError from '../alerts/GeneralAsyncError.js';

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: error => {
      // Lager en unhandled rejection, slik at feilene som fanges av @tanstack/react-query
      // kan propageres videre opp og fanges av UnhandledRejectionCatcher, og vises i TopplinjeAlerts.tsx
      // Hvis feilen ikke skal dyttes videre opp, så må man bruke
      // const mutation = useMutation({
      //    mutationFn: ...,
      //    meta: { suppressGlobalError: true }
      // })
      if (isErrorWithAlertInfo(error)) {
        void Promise.reject(error);
      } else if (error instanceof Error) {
        void Promise.reject(new GeneralAsyncError(error.message, error));
      }
    },
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const RootLayout = () => {
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
