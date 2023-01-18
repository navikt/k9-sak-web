import React, { useState } from 'react';
import { InstitusjonVurderingMedPerioder, Vurderingsresultat } from '@k9-sak-web/types';
import InstitusjonFerdigVisning from './InstitusjonFerdigVisning';
import InstitusjonForm from './InstitusjonForm';

interface OwnProps {
  vurdering: InstitusjonVurderingMedPerioder;
  readOnly: boolean;
  løsAksjonspunkt: (payload: any) => void;
  saksbehandlere: { [key: string]: string };
}

const InstitusjonDetails = ({ vurdering, readOnly, løsAksjonspunkt, saksbehandlere }: OwnProps) => {
  const [redigering, setRedigering] = useState(false);
  if (vurdering.resultat !== Vurderingsresultat.MÅ_VURDERES && !redigering) {
    return (
      <InstitusjonFerdigVisning
        vurdering={vurdering}
        readOnly={readOnly}
        rediger={() => setRedigering(true)}
        saksbehandlere={saksbehandlere}
      />
    );
  }
  return (
    <InstitusjonForm
      vurdering={vurdering}
      readOnly={readOnly}
      løsAksjonspunkt={løsAksjonspunkt}
      avbrytRedigering={() => setRedigering(false)}
      erRedigering={redigering}
    />
  );
};

export default InstitusjonDetails;
