import React from 'react';
import BehandlingPerioderårsakMedVilkår from '@k9-sak-web/types/src/behandlingPerioderarsakMedVilkar';
import { RawIntlProvider, createIntlCache, createIntl } from 'react-intl';
import Soknadsperiodestripe from './Soknadsperiodestripe';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intlConfig = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface SoknadsperiodestripeIndexProps {
  behandlingPerioderMedVilkår: BehandlingPerioderårsakMedVilkår;
}

const SoknadsperiodestripeIndex: React.FC<SoknadsperiodestripeIndexProps> = ({ behandlingPerioderMedVilkår }) => (
  <RawIntlProvider value={intlConfig}>
    <Soknadsperiodestripe behandlingPerioderMedVilkår={behandlingPerioderMedVilkår} />
  </RawIntlProvider>
);

export default SoknadsperiodestripeIndex;
