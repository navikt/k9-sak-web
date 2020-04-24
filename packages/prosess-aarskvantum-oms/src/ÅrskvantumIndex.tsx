import React, { FunctionComponent } from 'react';
import { createIntlCache, createIntl, RawIntlProvider } from 'react-intl';
import { VerticalSpacer } from '@fpsak-frontend/shared-components/index';
import messages from '../i18n/nb_NO.json';
import ÅrskvantumForbrukteDager from './dto/ÅrskvantumForbrukteDager';
import Årskvantum from './components/Årskvantum';
import Uttaksplan from './components/Uttaksplan';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface ÅrsakvantumIndexProps {
  årskvantum: ÅrskvantumForbrukteDager;
}

const ÅrskvantumIndex: FunctionComponent<ÅrsakvantumIndexProps> = ({ årskvantum }) => (
  <RawIntlProvider value={intl}>
    <Årskvantum årskvantum={årskvantum} />
    <VerticalSpacer sixteenPx />
    <Uttaksplan aktiviteter={årskvantum.sisteUttaksplan.aktiviteter} />
  </RawIntlProvider>
);

export default ÅrskvantumIndex;
