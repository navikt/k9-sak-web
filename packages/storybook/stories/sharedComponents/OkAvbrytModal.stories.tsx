import { action } from '@storybook/addon-actions';
import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { OkAvbrytModal } from '@k9-sak-web/shared-components';

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages: {
      'OkAvbrytModal.Ok': 'Ok',
      'OkAvbrytModal.Avbryt': 'Avbryt',
      'Test.Test': 'Dette er ein test',
    },
  },
  createIntlCache(),
);

export default {
  title: 'sharedComponents/OkAvbrytModal',
  component: OkAvbrytModal,
};

export const visModal = () => (
  <RawIntlProvider value={intl}>
    <OkAvbrytModal textCode="Test.Test" showModal submit={action('button-click')} cancel={action('button-click')} />
  </RawIntlProvider>
);
