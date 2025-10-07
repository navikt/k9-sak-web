import { useCallback, useState } from 'react';
import { useLocation } from 'react-router';

import { parseQueryString } from '@fpsak-frontend/utils';
import ForbiddenPage from '@k9-sak-web/gui/app/feilmeldinger/ForbiddenPage.js';
import UnauthorizedPage from '@k9-sak-web/gui/app/feilmeldinger/UnauthorizedPage.js';
import { useRestApiError, useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import EventType from '@k9-sak-web/rest-api/src/requestApi/eventType';

import AppConfigResolver from './AppConfigResolver';
import LanguageProvider from './LanguageProvider';
import Dekorator from './components/Dekorator';
import Home from './components/Home';

import '@fpsak-frontend/assets/styles/global.css';
import ErrorBoundary from '@k9-sak-web/gui/app/feilmeldinger/ErrorBoundary.js';
import '@navikt/ds-css/darkside';
import { Theme } from '@navikt/ds-react/Theme';
import '@navikt/ft-form-hooks/dist/style.css';
import '@navikt/ft-plattform-komponenter/dist/style.css';
import '@navikt/ft-ui-komponenter/dist/style.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RootSuspense } from '@k9-sak-web/gui/app/suspense/RootSuspense.js';

const EMPTY_ARRAY = [];
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * AppIndex
 *
 * Container komponent. Dette er toppkomponenten i applikasjonen. Denne vil rendre header
 * og home-komponentene. Home-komponenten vil rendre barn-komponenter via ruter.
 */
const AppIndex = () => {
  const location = useLocation();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [hasCrashed, setCrashed] = useState(false);

  const setSiteHeight = useCallback((newHeaderHeight): void => {
    document.documentElement.setAttribute('style', `height: calc(100% - ${newHeaderHeight}px)`);
    setHeaderHeight(newHeaderHeight);
  }, []);

  const { addErrorMessage } = useRestApiErrorDispatcher();
  const addErrorMessageAndSetAsCrashed = error => {
    addErrorMessage(error);
    setCrashed(true);
  };

  const errorMessages = useRestApiError() || EMPTY_ARRAY;
  const queryStrings = parseQueryString(location.search);
  const forbiddenErrors = errorMessages.filter(o => o.type === EventType.REQUEST_FORBIDDEN);
  const unauthorizedErrors = errorMessages.filter(o => o.type === EventType.REQUEST_UNAUTHORIZED);
  const hasForbiddenOrUnauthorizedErrors = forbiddenErrors.length > 0 || unauthorizedErrors.length > 0;
  const shouldRenderHome = !hasCrashed && !hasForbiddenOrUnauthorizedErrors;

  return (
    // Ytterste feilgrense viser alltid separat feil-side, fordi viss feil har skjedd i AppConfigResolver eller lenger ute
    // er det sannsynlegvis så grunnleggande at ingenting vil fungere.
    <ErrorBoundary>
      <Theme theme="light">
        <QueryClientProvider client={queryClient}>
          <RootSuspense>
            <AppConfigResolver>
              <ErrorBoundary errorMessageCallback={addErrorMessageAndSetAsCrashed} doNotShowErrorPage>
                <LanguageProvider>
                  <Dekorator
                    hideErrorMessages={hasForbiddenOrUnauthorizedErrors}
                    queryStrings={queryStrings}
                    setSiteHeight={setSiteHeight}
                    pathname={location.pathname}
                  />
                  {shouldRenderHome && <Home headerHeight={headerHeight} />}
                  {forbiddenErrors.length > 0 && <ForbiddenPage />}
                  {unauthorizedErrors.length > 0 && <UnauthorizedPage />}
                </LanguageProvider>
              </ErrorBoundary>
            </AppConfigResolver>
          </RootSuspense>
        </QueryClientProvider>
      </Theme>
    </ErrorBoundary>
  );
};

export default AppIndex;
