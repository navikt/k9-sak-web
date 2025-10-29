import React, { ReactNode } from 'react';

import { K9sakApiKeys, restApiHooks } from '../data/k9sakApi';

interface OwnProps {
  children: ReactNode;
}

/**
 * LanguageProvider
 *
 * Container komponent. Har ansvar for å hente språkfilen.
 */
const LanguageProvider = ({ children }: OwnProps) => {
  const nbMessages = restApiHooks.useGlobalStateRestApiData<any>(K9sakApiKeys.LANGUAGE_FILE);

  return (
    <IntlProvider locale="nb-NO" messages={nbMessages}>
      {children}
    </IntlProvider>
  );
};

export default LanguageProvider;
