import Årskvantum from '@k9-sak-web/prosess-aarskvantum-oms/src/components/Årskvantum';
import React from 'react';
import { RawIntlProvider } from 'react-intl';
import { årskvantumIntl } from '@k9-sak-web/prosess-aarskvantum-oms/src/ÅrskvantumIndex';

const withIntlProvider = story => <RawIntlProvider value={årskvantumIntl}>{story()}</RawIntlProvider>;

export default {
  title: 'omsorgspenger/prosess/Årskvantum',
  component: Årskvantum,
  decorators: [withIntlProvider],
};

export const årskvantum = () => (
  <Årskvantum
    totaltAntallDager={10}
    antallDagerArbeidsgiverDekker={3}
    antallKoronadager={10}
    forbruktTid="PT13H30M"
    antallDagerInfotrygd={4.7}
    restTid="PT79H"
    uttaksperioder={[]}
    benyttetRammemelding={false}
  />
);
