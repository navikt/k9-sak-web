import {
  shallowWithIntl as globalShallowWithIntl,
  mountWithIntl as globalmountWithIntl,
  intlWithMessages,
} from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import messages from './nb_NO.json';

const shallowWithIntl = node => globalShallowWithIntl(node, messages);
export const mountWithIntl = node => globalmountWithIntl(node, messages);

export const intlMock = intlWithMessages(messages);

export default shallowWithIntl;

