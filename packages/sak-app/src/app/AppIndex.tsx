import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import moment from 'moment';

import { useRestApiError, useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import EventType from '@k9-sak-web/rest-api/src/requestApi/eventType';
import { ForbiddenPage, UnauthorizedPage } from '@k9-sak-web/sak-infosider';
import { parseQueryString } from '@fpsak-frontend/utils';
import { NavAnsatt } from '@k9-sak-web/types';

import { K9sakApiKeys, restApiHooks } from '../data/k9sakApi';
import ErrorBoundary from './ErrorBoundary';
import { redirectToLogin } from './paths';
import AppConfigResolver from './AppConfigResolver';
import LanguageProvider from './LanguageProvider';
import Home from './components/Home';
import Dekorator from './components/Dekorator';

import '@fpsak-frontend/assets/styles/global.less';
import '@navikt/ds-css';

const EMPTY_ARRAY = [];

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

  return (
    <ErrorBoundary errorMessageCallback={addErrorMessageAndSetAsCrashed} doNotShowErrorPage>
      <AppConfigResolver>
        <LanguageProvider>
          <Dekorator
            hideErrorMessages={hasForbiddenOrUnauthorizedErrors}
            queryStrings={queryStrings}
            setSiteHeight={setSiteHeight}
            pathname={location.pathname}
          />
          {shouldRenderHome && <Home headerHeight={headerHeight} />}
          {forbiddenErrors.length > 0 && <ForbiddenPage />}
          {unauthorizedErrors.length > 0 && (redirectToLogin() || <UnauthorizedPage />)}
        </LanguageProvider>
      </AppConfigResolver>
    </ErrorBoundary>
  );
};

export default AppIndex;
