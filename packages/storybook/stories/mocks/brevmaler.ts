import { Brevmaler } from '@k9-sak-web/types';
import { templates } from '@k9-sak-web/gui/storybook/mocks/brevmaler.js';

// Dette er den gamle typen brukt i gamle stories.
const brevmaler: Brevmaler = {};
for (const mal of templates) {
  brevmaler[mal.kode] = mal;
}

export default brevmaler;
