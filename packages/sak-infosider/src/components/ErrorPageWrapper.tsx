import React, { ReactNode } from 'react';
import { createIntl, createIntlCache, FormattedMessage, RawIntlProvider } from 'react-intl';

import { Heading } from '@navikt/ds-react';
import messages from '../../i18n/nb_NO.json';
import styles from './errorPageWrapper.module.css';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface OwnProps {
  children: ReactNode | ReactNode[];
  titleCode?: string;
}

/**
 * FeilsideContainer
 *
 * Presentasjonskomponent. Denne komponenten vises når den NAV-ansatte prøver å aksessere en url som ikke finnes.
 * Det blir presentert en generell feilmelding og en lenke som tar NAV-ansatt tilbake til hovedsiden.
 */
const ErrorPageWrapper = ({ children, titleCode }: OwnProps) => (
  <RawIntlProvider value={intl}>
    <div className={styles.pageContainer}>
      <Heading size="large">
        <FormattedMessage id={titleCode} values={{ br: <br /> }} />
      </Heading>
      <br />
      {children}
    </div>
  </RawIntlProvider>
);

ErrorPageWrapper.defaultProps = {
  titleCode: 'GenericErrorPage.Header',
};

export default ErrorPageWrapper;
