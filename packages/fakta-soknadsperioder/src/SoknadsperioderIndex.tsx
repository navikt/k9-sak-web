import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { KodeverkMedNavn } from '@k9-sak-web/types';
import BehandlingPerioderårsakMedVilkår from '@k9-sak-web/types/src/behandlingPerioderarsakMedVilkar';
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
  behandlingPerioderårsakMedVilkår: BehandlingPerioderårsakMedVilkår;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
}

const SoknadsperioderIndex: React.FC<SoknadsperioderIndexProps> = ({
  behandlingPerioderårsakMedVilkår,
  alleKodeverk,
}) => (
  <RawIntlProvider value={intlConfig}>
    <SoknadsperioderComponent
      behandlingPerioderårsakMedVilkår={behandlingPerioderårsakMedVilkår}
      kodeverk={alleKodeverk[kodeverkTyper.ÅRSAK_TIL_VURDERING]}
    />
  </RawIntlProvider>
);

export default SoknadsperioderIndex;
