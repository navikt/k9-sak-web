import React, { useState } from 'react';
import { NoedvendighetVurderingMedPerioder, Vurderingsresultat } from '@k9-sak-web/types';
import NoedvendighetFerdigVisning from './NoedvendighetFerdigVisning';
import NoedvendighetForm from './NoedvendighetForm';

interface OwnProps {
  vurdering: NoedvendighetVurderingMedPerioder;
}

const NoedvendighetDetails = ({ vurdering }: OwnProps) => {
  const [redigering, setRedigering] = useState(false);
  if (vurdering.resultat !== Vurderingsresultat.MÅ_VURDERES && !redigering) {
    return <NoedvendighetFerdigVisning vurdering={vurdering} rediger={() => setRedigering(true)} />;
  }
  return (
    <NoedvendighetForm vurdering={vurdering} avbrytRedigering={() => setRedigering(false)} erRedigering={redigering} />
  );
};

export default NoedvendighetDetails;
