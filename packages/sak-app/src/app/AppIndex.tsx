import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router';

import { parseQueryString } from '@fpsak-frontend/utils';
import ForbiddenPage from '@k9-sak-web/gui/app/feilmeldinger/ForbiddenPage.js';
import UnauthorizedPage, { k9LoginResourcePath } from '@k9-sak-web/gui/app/feilmeldinger/UnauthorizedPage.js';
import { useRestApiError, useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import EventType from '@k9-sak-web/rest-api/src/requestApi/eventType';
import { NavAnsatt } from '@k9-sak-web/types';

import ErrorBoundary from '@k9-sak-web/gui/app/feilmeldinger/ErrorBoundary.js';
import { K9sakApiKeys, restApiHooks } from '../data/k9sakApi';
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

  const navAnsatt = restApiHooks.useGlobalStateRestApiData<NavAnsatt>(K9sakApiKeys.NAV_ANSATT);

  useEffect(() => {
    if (navAnsatt?.funksjonellTid) {
      // TODO (TOR) Dette endrar jo berre moment. Kva med kode som brukar Date direkte?
      const diffInMinutes = moment().diff(navAnsatt.funksjonellTid, 'minutes');
      // Hvis diffInMinutes har avvik på over 5min: override moment.now (ref. http://momentjs.com/docs/#/customization/now/)
      if (diffInMinutes >= 5 || diffInMinutes <= -5) {
        const diff = moment().diff(navAnsatt.funksjonellTid);
        moment.now = () => Date.now() - diff;
      }
    }
  }, [navAnsatt?.funksjonellTid]);

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
