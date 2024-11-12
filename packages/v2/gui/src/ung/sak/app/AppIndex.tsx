import moment from 'moment';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';

// import { K9sakApiKeys, restApiHooks } from '../data/k9sakApi';
// import AppConfigResolver from './AppConfigResolver';
// import ErrorBoundary from './ErrorBoundary';
// import LanguageProvider from './LanguageProvider';
// import Dekorator from './components/Dekorator';
// import Home from './components/Home';

import '@fpsak-frontend/assets/styles/global.css';
import type { InnloggetAnsattDto } from '@k9-sak-web/backend/k9sak/generated';
import '@navikt/ft-fakta-beregning/dist/style.css';
import '@navikt/ft-form-hooks/dist/style.css';
import '@navikt/ft-plattform-komponenter/dist/style.css';
import '@navikt/ft-prosess-beregningsgrunnlag/dist/style.css';
import '@navikt/ft-ui-komponenter/dist/style.css';
import { parseQueryString } from '@navikt/ft-utils';
import { useQuery } from '@tanstack/react-query';
import Dekorator from './Dekorator';
import ErrorBoundary from './ErrorBoundary';
import Home from './Home';
import UngSakBackendClient from './UngSakBackendClient';
import { UngSakClientContext } from './UngSakClientContext';

/**
 * AppIndex
 *
 * Container komponent. Dette er toppkomponenten i applikasjonen. Denne vil rendre header
 * og home-komponentene. Home-komponenten vil rendre barn-komponenter via ruter.
 */
const AppIndex = () => {
  const ungSakClient = useContext(UngSakClientContext);
  const ungSakBackendClient = new UngSakBackendClient(ungSakClient);
  const location = useLocation();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [hasCrashed, setCrashed] = useState(false);

  const { data: navAnsatt, error: navAnsattError } = useQuery<InnloggetAnsattDto>({
    queryKey: ['navAnsatt'],
    queryFn: () => ungSakBackendClient.getNavAnsatt(),
  });

  console.log('navAnsattErrors', navAnsattError);

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
  const addErrorMessageAndSetAsCrashed = (error: string[]) => {
    addErrorMessage(error);
    setCrashed(true);
  };

  //   const errorMessages = useRestApiError() || [];
  const queryStrings = parseQueryString(location.search);
  //   const forbiddenErrors = errorMessages.filter(o => o.type === EventType.REQUEST_FORBIDDEN);
  const navAnsattErrorKeys = navAnsattError ? Object.keys(navAnsattError) : [];
  const forbiddenErrors = navAnsattErrorKeys.some(key => navAnsattError && (navAnsattError as any)[key].status === 403);
  const unauthorizedErrors = navAnsattErrorKeys.some(
    key => navAnsattError && (navAnsattError as any)[key].status === 401,
  );
  //   const unauthorizedErrors = errorMessages.filter(o => o.type === EventType.REQUEST_UNAUTHORIZED);
  const hasForbiddenOrUnauthorizedErrors = forbiddenErrors || unauthorizedErrors;
  const shouldRenderHome = !hasCrashed && !hasForbiddenOrUnauthorizedErrors;

  return (
    <ErrorBoundary errorMessageCallback={addErrorMessageAndSetAsCrashed} doNotShowErrorPage>
      {/* <AppConfigResolver> */}
      <Dekorator
        hideErrorMessages={hasForbiddenOrUnauthorizedErrors}
        queryStrings={queryStrings}
        setSiteHeight={setSiteHeight}
        pathname={location.pathname}
      />
      {shouldRenderHome && <Home headerHeight={headerHeight} ungSakBackendClient={ungSakBackendClient} />}
      {/* {forbiddenErrors.length > 0 && <ForbiddenPage />}
        {unauthorizedErrors.length > 0 && <UnauthorizedPage />} */}
      {/* </AppConfigResolver> */}
    </ErrorBoundary>
  );
};

export default AppIndex;
