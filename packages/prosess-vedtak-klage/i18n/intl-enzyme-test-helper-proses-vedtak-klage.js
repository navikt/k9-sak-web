import {
  shallowWithIntl as globalShallowWithIntl,
  mountWithIntl as globalMountWithIntl,
} from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import messages from './nb_NO.json';

export const shallowWithIntl = node => globalShallowWithIntl(node, null, messages);

export const mountWithIntl = node => globalMountWithIntl(node, null, messages);
