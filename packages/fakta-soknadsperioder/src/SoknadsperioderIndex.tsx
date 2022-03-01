import React from 'react';
import { createIntlCache, createIntl, RawIntlProvider } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import BehandlingPerioderårsakMedVilkår from './types/BehandlingPerioderårsakMedVilkår';
import SoknadsperioderComponent from './SoknadsperioderComponent';

const cache = createIntlCache();

const intlConfig = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface SoknadsperioderIndexProps {
  behandlingPerioderårsakMedVilkår: BehandlingPerioderårsakMedVilkår;
}

const SoknadsperioderIndex: React.FC<SoknadsperioderIndexProps> = ({ behandlingPerioderårsakMedVilkår }) => (
  <RawIntlProvider value={intlConfig}>
    <SoknadsperioderComponent behandlingPerioderårsakMedVilkår={behandlingPerioderårsakMedVilkår} />
  </RawIntlProvider>
);

export default SoknadsperioderIndex;
