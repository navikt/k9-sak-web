import React from 'react';
import { InstitusjonPeriode, InstitusjonVurdering } from '@k9-sak-web/types';
import InstitusjonOversikt from './InstitusjonOversikt';

interface OwnProps {
  perioder: InstitusjonPeriode[];
  vurderinger: InstitusjonVurdering[];
  readOnly: boolean;
  løsAksjonspunkt: (payload: any) => void;
}

const FaktaInstitusjonIndex = ({ perioder, vurderinger, readOnly, løsAksjonspunkt }: OwnProps) => (
  <div>
    <InstitusjonOversikt
      perioder={perioder}
      vurderinger={vurderinger}
      readOnly={readOnly}
      løsAksjonspunkt={løsAksjonspunkt}
    />
  </div>
);

export default FaktaInstitusjonIndex;
