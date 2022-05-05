import HeaderWithErrorPanel, { Feilmelding } from '@fpsak-frontend/sak-dekorator';
import { useRestApiError, useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import { NavAnsatt } from '@k9-sak-web/types';
import React, { useMemo } from 'react';
import { injectIntl, IntlShape, WrappedComponentProps } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { K9sakApiKeys, restApiHooks } from '../../data/k9sakApi';
import ErrorFormatter from '../feilhandtering/ErrorFormatter';
import ErrorMessage from '../feilhandtering/ErrorMessage';
import { InitLinks } from '../initLinks';
import { getPathToFplos, getPathToK9Punsj } from '../paths';

type QueryStrings = {
  errorcode?: string;
  errormessage?: string;
};

const lagFeilmeldinger = (
  intl: IntlShape,
  errorMessages: ErrorMessage[],
  queryStrings: QueryStrings,
): Feilmelding[] => {
  const resolvedErrorMessages: Feilmelding[] = [];
  if (queryStrings.errorcode) {
    resolvedErrorMessages.push({ message: intl.formatMessage({ id: queryStrings.errorcode }) });
  }
  if (queryStrings.errormessage) {
    resolvedErrorMessages.push({ message: queryStrings.errormessage });
  }
  errorMessages.forEach(message => {
    let msg = {
      message: message.code ? intl.formatMessage({ id: message.code }, message.params) : message.text,
      additionalInfo: undefined,
    };
    if (message.params && message.params.errorDetails) {
      msg = {
        ...msg,
        additionalInfo: JSON.parse(message.params.errorDetails),
      };
    }
    resolvedErrorMessages.push(msg);
  });
  return resolvedErrorMessages;
};

const EMPTY_ARRAY = [];

interface OwnProps {
  queryStrings: QueryStrings;
  hideErrorMessages?: boolean;
  setSiteHeight: (headerHeight: number) => void;
  initFetch: InitLinks;
}

const Dekorator = ({
  intl,
  queryStrings,
  setSiteHeight,
  initFetch,
  hideErrorMessages = false,
}: OwnProps & WrappedComponentProps) => {
  const navAnsatt = restApiHooks.useGlobalStateRestApiData<NavAnsatt>(K9sakApiKeys.NAV_ANSATT);
  const location = useLocation();
  const fagsakFraUrl = location.pathname.split('/fagsak/')[1].split('/')[0];

  const getAinntektPath = () => {
    const ainntektPath = initFetch.sakLinks.find(saklink => saklink.rel === 'ainntekt-redirect')?.href;
    return `${ainntektPath}?=${fagsakFraUrl}`;
  };

  const getAaregPath = () => {
    const aaregPath = initFetch.sakLinks.find(saklink => saklink.rel === 'arbeidstaker-redirect')?.href;
    return `${aaregPath}?=${fagsakFraUrl}`;
  };

  const errorMessages = useRestApiError() || EMPTY_ARRAY;
  const formaterteFeilmeldinger = useMemo(() => new ErrorFormatter().format(errorMessages), [errorMessages]);

  const resolvedErrorMessages = useMemo(
    () => lagFeilmeldinger(intl, formaterteFeilmeldinger, queryStrings),
    [formaterteFeilmeldinger, queryStrings],
  );

  const { removeErrorMessages } = useRestApiErrorDispatcher();

  return (
    <HeaderWithErrorPanel
      navAnsattName={navAnsatt?.navn}
      navBrukernavn={navAnsatt?.brukernavn}
      removeErrorMessage={removeErrorMessages}
      errorMessages={hideErrorMessages ? EMPTY_ARRAY : resolvedErrorMessages}
      setSiteHeight={setSiteHeight}
      getPathToFplos={getPathToFplos}
      getPathToK9Punsj={getPathToK9Punsj}
      ainntektPath={getAinntektPath()}
      aaregPath={getAaregPath()}
    />
  );
};

export default injectIntl(Dekorator);
