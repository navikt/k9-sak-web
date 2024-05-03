import { AAREG_URL, AINNTEKT_URL } from '@k9-sak-web/konstanter';
import { useRestApiError, useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import HeaderWithErrorPanel, { Feilmelding } from '@k9-sak-web/sak-dekorator';
import { NavAnsatt } from '@k9-sak-web/types';
import React, { useMemo } from 'react';
import { IntlShape, WrappedComponentProps, injectIntl } from 'react-intl';
import { K9sakApiKeys, restApiHooks } from '../../data/k9sakApi';
import ErrorFormatter from '../feilhandtering/ErrorFormatter';
import ErrorMessage from '../feilhandtering/ErrorMessage';
import { getPathToK9Los, getPathToK9Punsj } from '../paths';

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
  pathname: string;
}

const Dekorator = ({
  intl,
  queryStrings,
  setSiteHeight,
  pathname,
  hideErrorMessages = false,
}: OwnProps & WrappedComponentProps) => {
  const navAnsatt = restApiHooks.useGlobalStateRestApiData<NavAnsatt>(K9sakApiKeys.NAV_ANSATT);
  const fagsakFraUrl = pathname.split('/fagsak/')[1]?.split('/')[0];
  const isFagsakFraUrlValid = fagsakFraUrl?.match(/^[a-zA-Z0-9]{1,19}$/);

  const getAinntektPath = () => {
    const ainntektPath = '/k9/sak/api/register/redirect-to/a-inntekt';
    if (!isFagsakFraUrlValid) {
      return AINNTEKT_URL;
    }
    return `${ainntektPath}?saksnummer=${fagsakFraUrl}`;
  };

  const getAaregPath = () => {
    const aaregPath = '/k9/sak/api/register/redirect-to/aa-reg';
    if (!isFagsakFraUrlValid) {
      return AAREG_URL;
    }
    return `${aaregPath}?saksnummer=${fagsakFraUrl}`;
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
      getPathToFplos={getPathToK9Los}
      getPathToK9Punsj={getPathToK9Punsj}
      ainntektPath={getAinntektPath()}
      aaregPath={getAaregPath()}
    />
  );
};

export default injectIntl(Dekorator);
