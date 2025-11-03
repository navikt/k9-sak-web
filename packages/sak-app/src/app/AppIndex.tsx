import { useCallback, useState } from 'react';
import { useLocation } from 'react-router';

import { parseQueryString } from '@fpsak-frontend/utils';
import ForbiddenPage from '@k9-sak-web/gui/app/feilmeldinger/ForbiddenPage.js';
import UnauthorizedPage, { k9LoginResourcePath } from '@k9-sak-web/gui/app/feilmeldinger/UnauthorizedPage.js';
import { useRestApiError, useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import EventType from '@k9-sak-web/rest-api/src/requestApi/eventType';

import ErrorBoundary from '@k9-sak-web/gui/app/feilmeldinger/ErrorBoundary.js';
import AppConfigResolver from './AppConfigResolver';
import LanguageProvider from './LanguageProvider';
import Dekorator from './components/Dekorator';
import Home from './components/Home';

import '@fpsak-frontend/assets/styles/global.css';
import '@navikt/ds-css/darkside';
import '@navikt/ft-fakta-beregning/dist/style.css';
import '@navikt/ft-form-hooks/dist/style.css';
import '@navikt/ft-plattform-komponenter/dist/style.css';
import '@navikt/ft-prosess-beregningsgrunnlag/dist/style.css';
import '@navikt/ft-ui-komponenter/dist/style.css';
import { RootSuspense } from '@k9-sak-web/gui/app/root/suspense/RootSuspense.js';
import { usePrefetchQuery } from '@tanstack/react-query';
import { kodeverkOppslagQueryOptions } from '@k9-sak-web/gui/kodeverk/oppslag/useK9Kodeverkoppslag.js';
import { innloggetAnsattQueryOptions } from '@k9-sak-web/gui/saksbehandler/InnloggetAnsattProvider.js';
import { K9SakInnloggetAnsattBackendClient } from '@k9-sak-web/gui/saksbehandler/K9SakInnloggetAnsattBackendClient.js';

const EMPTY_ARRAY = [];

/**
 * AppIndex
 *
 * Container komponent. Dette er toppkomponenten i den ytelsespesifikke applikasjonen (felles RootLayout er over her).
 * Denne vil rendre header og home-komponentene. Home-komponenten vil rendre barn-komponenter via ruter.
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

  // Start forhåndslasting av kodeverk oppslag data
  usePrefetchQuery(kodeverkOppslagQueryOptions.k9sak);
  usePrefetchQuery(kodeverkOppslagQueryOptions.k9tilbake(true));
  usePrefetchQuery(kodeverkOppslagQueryOptions.k9klage(true));
  // Start forhåndslasting av nav ansatt data
  usePrefetchQuery(innloggetAnsattQueryOptions(new K9SakInnloggetAnsattBackendClient()));

  // Sjå bootstrap for å sjå kva som er lenger oppe i hierarkiet.
  return (
    <RootSuspense heading="Laster grunnleggende systemdata">
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
            {unauthorizedErrors.length > 0 && <UnauthorizedPage loginUrl={k9LoginResourcePath} />}
          </LanguageProvider>
        </ErrorBoundary>
      </AppConfigResolver>
    </RootSuspense>
  );
};

export default AppIndex;
