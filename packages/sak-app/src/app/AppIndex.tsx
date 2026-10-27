import { useEffect } from 'react';
import { useLocation } from 'react-router';

import { parseQueryString } from '@fpsak-frontend/utils';
import ForbiddenPage from '@k9-sak-web/gui/app/errorhandling/pages/ForbiddenPage.js';
import UnauthorizedPage, { k9LoginResourcePath } from '@k9-sak-web/gui/app/errorhandling/pages/UnauthorizedPage.js';
import { useGlobalUnhandledErrors } from '@k9-sak-web/gui/app/errorhandling/GlobalUnhandledErrorCatcher.js';
import EventType from '@k9-sak-web/rest-api/src/requestApi/eventType';
import { AxiosError } from 'axios';

import ErrorBoundary from '@k9-sak-web/gui/app/errorhandling/boundary/ErrorBoundary.js';
import AppConfigResolver from './AppConfigResolver';
import Dekorator from './components/Dekorator';
import Home from './components/Home';

import '@fpsak-frontend/assets/styles/global.css';
import { RootSuspense } from '@k9-sak-web/gui/app/root/suspense/RootSuspense.js';
import { kodeverkOppslagQueryOptions } from '@k9-sak-web/gui/kodeverk/oppslag/useK9Kodeverkoppslag.js';
import { innloggetAnsattQueryOptions } from '@k9-sak-web/gui/saksbehandler/InnloggetAnsattProvider.js';
import { K9SakInnloggetAnsattBackendClient } from '@k9-sak-web/gui/saksbehandler/K9SakInnloggetAnsattBackendClient.js';
import '@navikt/ft-fakta-beregning/dist/style.css';
import '@navikt/ft-form-hooks/dist/style.css';
import '@navikt/ft-plattform-komponenter/dist/style.css';
import '@navikt/ft-prosess-beregningsgrunnlag/dist/style.css';
import '@navikt/ft-ui-komponenter/dist/style.css';
import { usePrefetchQuery } from '@tanstack/react-query';
import { isQ } from '@k9-sak-web/lib/paths/paths.js';
import { resolveAxiosErrorÅrsakIkkeTilgang } from '@k9-sak-web/gui/app/errorhandling/ui/resolveAxiosErrorView.js';

const isForbidden = (e: Error) =>
  (e instanceof AxiosError && e.response?.status === 403) || ('type' in e && e.type === EventType.REQUEST_FORBIDDEN);

const isUnauthorized = (e: Error) =>
  (e instanceof AxiosError && e.response?.status === 401) || ('type' in e && e.type === EventType.REQUEST_UNAUTHORIZED);

/**
 * AppIndex
 *
 * Container komponent. Dette er toppkomponenten i den ytelsespesifikke applikasjonen (felles RootLayout er over her).
 * Denne vil rendre header og home-komponentene. Home-komponenten vil rendre barn-komponenter via ruter.
 */
const AppIndex = () => {
  const location = useLocation();

  useEffect(() => {
    if (isQ()) {
      // Umami script for å se brukerinnsikt https://innblikk.ansatt.nav.no
      const script = document.createElement('script');
      script.setAttribute('src', 'https://cdn.nav.no/team-researchops/sporing/sporing-dev.js');
      script.setAttribute('data-website-id', '63ae9445-82e4-47de-9fbe-89f0c252b154');
      document.head.appendChild(script);
    }
  }, []);

  const { globalErrors } = useGlobalUnhandledErrors();
  const queryStrings = parseQueryString(location.search);
  const forbiddenErrors = globalErrors.filter(isForbidden);
  const unauthorizedErrors = globalErrors.filter(isUnauthorized);
  const hasForbiddenOrUnauthorizedErrors = forbiddenErrors.length > 0 || unauthorizedErrors.length > 0;
  const shouldRenderHome = !hasForbiddenOrUnauthorizedErrors;

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
        <ErrorBoundary>
          <Dekorator queryStrings={queryStrings} pathname={location.pathname} />
          {shouldRenderHome && <Home />}
          {forbiddenErrors.length > 0 && (
            <ForbiddenPage
              ikkeTilgangÅrsaker={forbiddenErrors.flatMap(e =>
                e instanceof AxiosError ? resolveAxiosErrorÅrsakIkkeTilgang(e) : [],
              )}
            />
          )}
          {unauthorizedErrors.length > 0 && <UnauthorizedPage loginUrl={k9LoginResourcePath} />}
        </ErrorBoundary>
      </AppConfigResolver>
    </RootSuspense>
  );
};

export default AppIndex;
