import React, { useEffect } from 'react';
import { NoedvendighetPeriode, NoedvendighetVurdering } from '@k9-sak-web/types';
import NoedvendighetOversikt from './NoedvendighetOversikt';

interface OwnProps {
  perioder: NoedvendighetPeriode[];
  vurderinger: NoedvendighetVurdering[];
  readOnly: boolean;
  løsAksjonspunkt: (payload: any) => void;
}

const FaktaNoedvendighetIndex = ({ perioder, vurderinger, readOnly, løsAksjonspunkt }: OwnProps) => (
  <div>
    <NoedvendighetOversikt
      perioder={perioder}
      vurderinger={vurderinger}
      readOnly={readOnly}
      løsAksjonspunkt={løsAksjonspunkt}
    />
  </div>
);

export default FaktaNoedvendighetIndex;
