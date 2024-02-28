import {
  shallowWithIntl as globalShallowWithIntl,
  intlWithMessages,
} from '@fpsak-frontend/utils-test/intl-test-helper';

import messages from './nb_NO.json';

const shallowWithIntl = node => globalShallowWithIntl(node, messages);

export const intlMock = intlWithMessages(messages);

export default shallowWithIntl;
