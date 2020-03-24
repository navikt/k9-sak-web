import { mountWithIntl as globalMountWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import messages from './nb_NO.json';

const mountWithIntl = node => globalMountWithIntl(node, null, messages);

export default mountWithIntl;
