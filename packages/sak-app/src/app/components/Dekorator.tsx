import React, { FunctionComponent, useMemo } from 'react';
import { injectIntl, IntlShape, WrappedComponentProps } from 'react-intl';

import HeaderWithErrorPanel, { Feilmelding } from '@fpsak-frontend/sak-dekorator';
import { useRestApiError, useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import { decodeHtmlEntity } from '@fpsak-frontend/utils';
import { NavAnsatt } from '@k9-sak-web/types';

import { K9sakApiKeys, restApiHooks } from '../../data/k9sakApi';
import ErrorFormatter from '../feilhandtering/ErrorFormatter';
import ErrorMessage from '../feilhandtering/ErrorMessage';
import { getPathToFplos } from '../paths';

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
        additionalInfo: JSON.parse(decodeHtmlEntity(message.params.errorDetails)),
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
}

const Dekorator: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  queryStrings,
  setSiteHeight,
  hideErrorMessages = false,
}) => {
  const navAnsatt = restApiHooks.useGlobalStateRestApiData<NavAnsatt>(K9sakApiKeys.NAV_ANSATT);

  const errorMessages = useRestApiError() || EMPTY_ARRAY;
  const formaterteFeilmeldinger = useMemo(() => new ErrorFormatter().format(errorMessages, undefined), [errorMessages]);

  const resolvedErrorMessages = useMemo(() => lagFeilmeldinger(intl, formaterteFeilmeldinger, queryStrings), [
    formaterteFeilmeldinger,
    queryStrings,
  ]);

  const { removeErrorMessages } = useRestApiErrorDispatcher();

  return (
    <HeaderWithErrorPanel
      navAnsattName={navAnsatt?.navn}
      removeErrorMessage={removeErrorMessages}
      errorMessages={hideErrorMessages ? EMPTY_ARRAY : resolvedErrorMessages}
      setSiteHeight={setSiteHeight}
      getPathToFplos={getPathToFplos}
    />
  );
};

export default injectIntl(Dekorator);
