import React, { useMemo } from 'react';
import { IntlProvider, useIntl } from 'react-intl';

const NestedIntlProvider = ({ messages, children }): React.ReactElement => {
  const intl = useIntl();

  const mergedMessages = useMemo(() => ({ ...intl.messages, ...messages }), [intl, messages]);

  return (
    <IntlProvider locale={intl.locale} messages={mergedMessages}>
      {children}
    </IntlProvider>
  );
};

export default NestedIntlProvider;
