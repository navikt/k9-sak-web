import React from 'react';
import { InstitusjonPeriode, InstitusjonVurdering } from '@k9-sak-web/types';
import InstitusjonOversikt from './InstitusjonOversikt';

interface OwnProps {
  perioder: InstitusjonPeriode[];
  vurderinger: InstitusjonVurdering[];
  readOnly: boolean;
  løsAksjonspunkt: (payload: any) => void;
  saksbehandlere: { [key: string]: string };
}

const FaktaInstitusjonIndex = ({ perioder, vurderinger, readOnly, løsAksjonspunkt, saksbehandlere }: OwnProps) => (
  <div>
    <InstitusjonOversikt
      perioder={perioder}
      vurderinger={vurderinger}
      readOnly={readOnly}
      løsAksjonspunkt={løsAksjonspunkt}
      saksbehandlere={saksbehandlere}
    />
  </div>
);

export default FaktaInstitusjonIndex;
