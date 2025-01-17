import { action } from '@storybook/addon-actions';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import OkAvbrytModal from './OkAvbrytModal';

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
  title: 'gui/shared/OkAvbrytModal',
  component: OkAvbrytModal,
};

export const visModal = () => (
  <RawIntlProvider value={intl}>
    <OkAvbrytModal textCode="Test.Test" showModal submit={action('button-click')} cancel={action('button-click')} />
  </RawIntlProvider>
);
