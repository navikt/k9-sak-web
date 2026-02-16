import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import type { KodeverkMedNavn } from '@k9-sak-web/types';
import type { JSX } from 'react';
import BostedSokerView from './components/BostedSokerView';
import type { BostedSokerPersonopplysninger } from './types';

interface OwnProps {
  personopplysninger: BostedSokerPersonopplysninger;
  sokerTypeText?: string;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
}

const BostedSokerFaktaIndex = ({
  personopplysninger,
  sokerTypeText = 'Søker',
  alleKodeverk,
}: OwnProps): JSX.Element => (
  <BostedSokerView
    personopplysninger={personopplysninger}
    sokerTypeText={sokerTypeText}
    regionTypes={alleKodeverk[kodeverkTyper.REGION]}
    sivilstandTypes={alleKodeverk[kodeverkTyper.SIVILSTAND_TYPE]}
    personstatusTypes={alleKodeverk[kodeverkTyper.PERSONSTATUS_TYPE]}
  />
);

export default BostedSokerFaktaIndex;
