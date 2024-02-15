import {
  shallowWithIntl as globalShallowWithIntl,
  mountWithIntl as globalMountWithIntl,
  intlWithMessages,
} from '@fpsak-frontend/utils-test/intl-enzyme-test-helper';

import messages from './nb_NO.json';

const shallowWithIntl = (node: any) => globalShallowWithIntl(node, messages);
export const mountWithIntl = (node: any) => globalMountWithIntl(node, messages);

export const intlMock = intlWithMessages(messages);

export default shallowWithIntl;
