import {
  mountWithIntl as globalMountWithIntl,
  intlWithMessages
} from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import messages from './nb_NO.json';


export const mountWithIntl = node => globalMountWithIntl(node, messages);

export const intlMock = intlWithMessages(messages);

