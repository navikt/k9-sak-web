/**
 * https://github.com/yahoo/react-intl/wiki/Testing-with-React-Intl
 *
 * Components using the react-intl module require access to the intl context.
 * This is not available when mounting single components in Enzyme.
 * These helper functions aim to address that.
 */

// You can pass your messages to the IntlProvider. Optional: remove if unneeded.
import defaultMessages from '../../../public/sprak/nb_NO.json';
export { default as messages } from '../../../public/sprak/nb_NO.json';

// Create the IntlProvider to retrieve context for wrapping around.
const getIntlObject = (messages?: any) => {
  const selectedMessages = messages || defaultMessages;

  return createIntl(
    {
      locale: 'nb-NO',
      defaultLocale: 'nb-NO',
      messages: selectedMessages,
      onError: error => {
        if (error.code === 'MISSING_TRANSLATION') {
          return;
        }
        console.warn(error);
      },
    },
    cache,
  );
};

export const intlWithMessages = (customMessages?: any) => getIntlObject(customMessages);

export const intlMock = getIntlObject(defaultMessages);
