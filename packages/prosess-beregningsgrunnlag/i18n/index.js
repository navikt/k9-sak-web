import {
  shallowWithIntl as globalShallowWithIntl,
  mountWithIntl as globalMountWithIntl,
} from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import messages from './nb_NO.json';

const shallowWithIntl = node => globalShallowWithIntl(node, messages);

export const mountWithIntl = node => globalMountWithIntl(node, messages);

export default shallowWithIntl;
