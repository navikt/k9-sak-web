import BehandlingPerioderårsakMedVilkår from '@k9-sak-web/types/src/behandlingPerioderarsakMedVilkar';
import { Loader } from '@navikt/ds-react';
import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '../i18n/nb_NO.json';
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
  behandlingPerioderårsakMedVilkår?: BehandlingPerioderårsakMedVilkår;
}

const SoknadsperioderIndex: React.FC<SoknadsperioderIndexProps> = ({ behandlingPerioderårsakMedVilkår }) => (
  <RawIntlProvider value={intlConfig}>
    {behandlingPerioderårsakMedVilkår ? (
      <SoknadsperioderComponent behandlingPerioderårsakMedVilkår={behandlingPerioderårsakMedVilkår} />
    ) : (
      <Loader size="2xlarge" />
    )}
  </RawIntlProvider>
);

export default SoknadsperioderIndex;
