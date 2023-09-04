import React, { useState } from 'react';
import { GjennomgaaOpplaeringVurdering, Vurderingsresultat } from '@k9-sak-web/types';
import GjennomgaaOpplaeringFerdigVisning from './GjennomgaaOpplaeringFerdigVisning';
import GjennomgaaOpplaeringForm from './GjennomgaaOpplaeringForm';

interface OwnProps {
  vurdering: GjennomgaaOpplaeringVurdering;
}

const GjennomgaaOpplaeringDetails = ({ vurdering }: OwnProps) => {
  const [redigering, setRedigering] = useState(false);

  if (vurdering.resultat !== Vurderingsresultat.MÅ_VURDERES && !redigering) {
    return <GjennomgaaOpplaeringFerdigVisning vurdering={vurdering} rediger={() => setRedigering(true)} />;
  }
  return (
    <GjennomgaaOpplaeringForm
      vurdering={vurdering}
      avbrytRedigering={() => setRedigering(false)}
      erRedigering={redigering}
    />
  );
};

export default GjennomgaaOpplaeringDetails;
