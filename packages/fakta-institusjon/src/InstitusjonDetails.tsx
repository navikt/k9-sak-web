import React, { useState } from 'react';
import { InstitusjonVurderingMedPerioder, Vurderingsresultat } from '@k9-sak-web/types';
import InstitusjonFerdigVisning from './InstitusjonFerdigVisning';
import InstitusjonForm from './InstitusjonForm';

interface OwnProps {
  vurdering: InstitusjonVurderingMedPerioder;
  readOnly: boolean;
  løsAksjonspunkt: (payload: any) => void;
}

const InstitusjonDetails = ({ vurdering, readOnly, løsAksjonspunkt }: OwnProps) => {
  const [redigering, setRedigering] = useState(false);
  if (vurdering.resultat !== Vurderingsresultat.MÅ_VURDERES && !redigering) {
    return <InstitusjonFerdigVisning vurdering={vurdering} readOnly={readOnly} rediger={() => setRedigering(true)} />;
  }
  return (
    <InstitusjonForm
      vurdering={vurdering}
      readOnly={readOnly}
      løsAksjonspunkt={løsAksjonspunkt}
      avbrytRedigering={() => setRedigering(false)}
    />
  );
};

export default InstitusjonDetails;
