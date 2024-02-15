import {
  shallowWithIntl as globalShallowWithIntl
} from '@fpsak-frontend/utils-test/intl-enzyme-test-helper';

import messages from './nb_NO.json';

export const shallowWithIntl = node => globalShallowWithIntl(node, messages);
