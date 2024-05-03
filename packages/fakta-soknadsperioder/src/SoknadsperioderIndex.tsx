import kodeverkTyper from '@k9-sak-web/kodeverk/src/kodeverkTyper';
import { KodeverkMedNavn } from '@k9-sak-web/types';
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
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
}

const SoknadsperioderIndex: React.FC<SoknadsperioderIndexProps> = ({
  behandlingPerioderårsakMedVilkår,
  alleKodeverk,
}) => (
  <RawIntlProvider value={intlConfig}>
    {behandlingPerioderårsakMedVilkår ? (
      <SoknadsperioderComponent
        behandlingPerioderårsakMedVilkår={behandlingPerioderårsakMedVilkår}
        kodeverk={alleKodeverk[kodeverkTyper.ÅRSAK_TIL_VURDERING]}
      />
    ) : (
      <Loader size="2xlarge" />
    )}
  </RawIntlProvider>
);

export default SoknadsperioderIndex;
