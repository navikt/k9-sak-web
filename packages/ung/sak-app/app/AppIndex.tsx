import { useLocation } from 'react-router';

import { parseQueryString } from '@fpsak-frontend/utils';
import ForbiddenPage from '@k9-sak-web/gui/app/errorhandling/pages/ForbiddenPage.js';
import UnauthorizedPage, { ungLoginResourcePath } from '@k9-sak-web/gui/app/errorhandling/pages/UnauthorizedPage.js';
import { useGlobalUnhandledErrors } from '@k9-sak-web/gui/app/errorhandling/GlobalUnhandledErrorCatcher.js';
import EventType from '@k9-sak-web/rest-api/src/requestApi/eventType';
import { AxiosError } from 'axios';

import AppConfigResolver from './AppConfigResolver';
import Dekorator from './components/Dekorator';
import Home from './components/Home';

import '@fpsak-frontend/assets/styles/global.css';
import ErrorBoundary from '@k9-sak-web/gui/app/errorhandling/boundary/ErrorBoundary.js';
import { RootSuspense } from '@k9-sak-web/gui/app/root/suspense/RootSuspense.js';
import { kodeverkOppslagQueryOptions } from '@k9-sak-web/gui/kodeverk/oppslag/useUngKodeverkoppslag.js';
import { innloggetAnsattQueryOptions } from '@k9-sak-web/gui/saksbehandler/InnloggetAnsattProvider.js';
import { UngSakInnloggetAnsattBackendClient } from '@k9-sak-web/gui/saksbehandler/UngSakInnloggetAnsattBackendClient.js';
import { isAktivitetspenger } from '@k9-sak-web/gui/utils/urlUtils.js';
import '@navikt/ft-form-hooks/dist/style.css';
import '@navikt/ft-plattform-komponenter/dist/style.css';
import '@navikt/ft-ui-komponenter/dist/style.css';
import { usePrefetchQuery } from '@tanstack/react-query';
import { resolveAxiosErrorÅrsakIkkeTilgang } from '@k9-sak-web/gui/app/errorhandling/ui/resolveAxiosErrorView.js';

const isForbidden = (e: Error) =>
  (e instanceof AxiosError && e.response?.status === 403) || ('type' in e && e.type === EventType.REQUEST_FORBIDDEN);

const isUnauthorized = (e: Error) =>
  (e instanceof AxiosError && e.response?.status === 401) || ('type' in e && e.type === EventType.REQUEST_UNAUTHORIZED);

/**
 * AppIndex
 *
 * Container komponent. Dette er toppkomponenten i den ytelsesspesifikke applikasjonen (felles RootLayout er over her).
 * Denne vil rendre header og home-komponentene. Home-komponenten vil rendre barn-komponenter via ruter.
 */
const AppIndex = () => {
  const location = useLocation();

  const { globalErrors } = useGlobalUnhandledErrors();
  const queryStrings = parseQueryString(location.search);
  const forbiddenErrors = globalErrors.filter(isForbidden);
  const unauthorizedErrors = globalErrors.filter(isUnauthorized);
  const hasForbiddenOrUnauthorizedErrors = forbiddenErrors.length > 0 || unauthorizedErrors.length > 0;
  const shouldRenderHome = !hasForbiddenOrUnauthorizedErrors;

  // Start forhåndslasting av kodeverk oppslag data
  usePrefetchQuery(kodeverkOppslagQueryOptions.ungSak);
  usePrefetchQuery(kodeverkOppslagQueryOptions.ungTilbake(true));
  // Start forhåndslasting av nav ansatt data
  usePrefetchQuery(innloggetAnsattQueryOptions(new UngSakInnloggetAnsattBackendClient()));

  // Sjå bootstrapUng for å sjå kva som er lenger oppe i hierarkiet.
  return (
    <RootSuspense heading="Laster grunnleggende systemdata">
      <AppConfigResolver>
        <ErrorBoundary>
          {isAktivitetspenger() && <title>Aktivitetspenger</title>}
          <Dekorator queryStrings={queryStrings} pathname={location.pathname} />
          {shouldRenderHome && <Home />}
          {forbiddenErrors.length > 0 && (
            <ForbiddenPage
              ikkeTilgangÅrsaker={forbiddenErrors.flatMap(e =>
                e instanceof AxiosError ? resolveAxiosErrorÅrsakIkkeTilgang(e) : [],
              )}
            />
          )}
          {unauthorizedErrors.length > 0 && <UnauthorizedPage loginUrl={ungLoginResourcePath} />}
        </ErrorBoundary>
      </AppConfigResolver>
    </RootSuspense>
  );
};

export default AppIndex;
