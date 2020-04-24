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

const ÅrskvantumIndex: FunctionComponent<ÅrsakvantumIndexProps> = ({ årskvantum }) => {
  const { totaltAntallDager, restdager, forbrukteDager, antallDagerArbeidsgiverDekker, sisteUttaksplan } = årskvantum;
  return (
    <RawIntlProvider value={intl}>
      <Årskvantum
        totaltAntallDager={totaltAntallDager}
        restdager={restdager}
        forbrukteDager={forbrukteDager}
        antallDagerArbeidsgiverDekker={antallDagerArbeidsgiverDekker}
      />
      <VerticalSpacer sixteenPx />
      <Uttaksplan aktiviteter={sisteUttaksplan.aktiviteter} />
    </RawIntlProvider>
  );
};

export default ÅrskvantumIndex;
