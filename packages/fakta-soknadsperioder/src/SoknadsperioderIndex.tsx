import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { KodeverkMedNavn } from '@k9-sak-web/types';
import BehandlingPerioderårsakMedVilkår from '@k9-sak-web/types/src/behandlingPerioderarsakMedVilkar';
import { Loader } from '@navikt/ds-react';
import React from 'react';
import messages from '../i18n/nb_NO.json';
import SoknadsperioderComponent from './SoknadsperioderComponent';

interface SoknadsperioderIndexProps {
  behandlingPerioderårsakMedVilkår?: BehandlingPerioderårsakMedVilkår;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
}

const SoknadsperioderIndex: React.FC<SoknadsperioderIndexProps> = ({
  behandlingPerioderårsakMedVilkår,
  alleKodeverk,
}) => (
      {behandlingPerioderårsakMedVilkår ? (
      <SoknadsperioderComponent
        behandlingPerioderårsakMedVilkår={behandlingPerioderårsakMedVilkår}
        kodeverk={alleKodeverk[kodeverkTyper.ÅRSAK_TIL_VURDERING]}
      />
    ) : (
      <Loader size="2xlarge" />
    )});

export default SoknadsperioderIndex;
