/**
 * https://github.com/yahoo/react-intl/wiki/Testing-with-React-Intl
 *
 * Components using the react-intl module require access to the intl context.
 * This is not available when mounting single components in Enzyme.
 * These helper functions aim to address that.
 */

import { ReactElement } from 'react';
import { IntlProvider, createIntl, createIntlCache } from 'react-intl';
import { mount, shallow } from 'enzyme';
// You can pass your messages to the IntlProvider. Optional: remove if unneeded.
// eslint-disable-next-line import/no-relative-packages
import defaultMessages from '../../../public/sprak/nb_NO.json';
// eslint-disable-next-line import/no-relative-packages
export { default as messages } from '../../../public/sprak/nb_NO.json';

export function shallowWithIntl(node: ReactElement, messages: any = defaultMessages) {
  return shallow(node, {
    wrappingComponent: IntlProvider,
    wrappingComponentProps: {
      locale: 'nb-NO',
      defaultLocale: 'nb-NO',
      messages,
    },
  });
}

export function mountWithIntl(node: ReactElement, messages: any = defaultMessages) {
  return mount(node, {
    wrappingComponent: IntlProvider,
    wrappingComponentProps: {
      locale: 'nb-NO',
      defaultLocale: 'nb-NO',
      messages,
    },
  });
}

// Create the IntlProvider to retrieve context for wrapping around.
const cache = createIntlCache();

const getIntlObject = (messages?: any) => {
  const selectedMessages = messages || defaultMessages;

  return createIntl(
    {
      locale: 'nb-NO',
      defaultLocale: 'nb-NO',
      messages: selectedMessages,
    },
    cache,
  );
};

export const intlWithMessages = (customMessages?: any) => getIntlObject(customMessages);

export const intlMock = getIntlObject(defaultMessages);
