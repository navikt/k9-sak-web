import { ReactNode } from 'react';
import { IntlProvider } from 'react-intl';
import { restApiHooks, UngSakApiKeys } from '../data/ungsakApi';

interface OwnProps {
  children: ReactNode;
}

/**
 * LanguageProvider
 *
 * Container komponent. Har ansvar for å hente språkfilen.
 */
const LanguageProvider = ({ children }: OwnProps) => {
  const nbMessages = restApiHooks.useGlobalStateRestApiData<any>(UngSakApiKeys.LANGUAGE_FILE);

  return (
    <IntlProvider locale="nb-NO" messages={nbMessages}>
      {children}
    </IntlProvider>
  );
};

export default LanguageProvider;
