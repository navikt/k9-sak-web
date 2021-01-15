/**
 * https://github.com/yahoo/react-intl/wiki/Testing-with-React-Intl
 *
 * Components using the react-intl module require access to the intl context.
 * This is not available when mounting single components in Enzyme.
 * These helper functions aim to address that.
 */

import React, { ReactElement } from 'react';
import { createIntl, createIntlCache, IntlProvider } from 'react-intl';
import { mount, shallow, ShallowRendererProps } from 'enzyme';
// You can pass your messages to the IntlProvider. Optional: remove if unneeded.
import messages from '../../../public/sprak/nb_NO.json';

export { default as messages } from '../../../public/sprak/nb_NO.json';

// Create the IntlProvider to retrieve context for wrapping around.
const cache = createIntlCache();

const getIntlObject = (moduleMessages?: any) => {
  const selectedMessages = moduleMessages || messages;

  return createIntl(
    {
      locale: 'nb-NO',
      defaultLocale: 'nb-NO',
      messages: selectedMessages,
    },
    cache,
  );
};

/**
 * When using React-Intl `injectIntl` on components, props.intl is required.
 */
function nodeWithIntlProp(node: ReactElement, moduleMessages?: any): ReactElement {
  return React.cloneElement(node, { intl: getIntlObject(moduleMessages) });
}

const getOptions = (moduleMessages?: any): ShallowRendererProps => {
  const selectedMessages = moduleMessages || messages;

  return {
    wrappingComponent: IntlProvider,
    wrappingComponentProps: {
      locale: 'nb-NO',
      defaultLocale: 'nb-NO',
      messages: selectedMessages,
    },
  };
};

export function shallowWithIntl(node: ReactElement, options?: ShallowRendererProps, moduleMessages = undefined) {
  return shallow(nodeWithIntlProp(node, moduleMessages), { ...getOptions(moduleMessages), ...options });
}

export function mountWithIntl(node: ReactElement, options?: ShallowRendererProps, moduleMessages = undefined) {
  return mount(nodeWithIntlProp(node), { ...getOptions(moduleMessages), ...options });
}

export const intlWithMessages = (customMessages?: any) => getIntlObject(customMessages);

// TODO Denne burde ein vel kunne fjerna? Blir injecta i shallowWithInlt og mountWithIntl
export const intlMock = getIntlObject(messages);
