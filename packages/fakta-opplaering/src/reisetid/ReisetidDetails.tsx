import React, { useState } from 'react';
import { Vurderingsresultat } from '@k9-sak-web/types';
import { ReisetidVurdering } from './ReisetidTypes';
import ReisetidFerdigVisning from './ReisetidFerdigVisning';
import ReisetidForm from './ReisetidForm';

interface OwnProps {
  vurdering: ReisetidVurdering;
}

const ReisetidDetails = ({ vurdering }: OwnProps) => {
  const [redigering, setRedigering] = useState(false);

  if (vurdering.resultat !== Vurderingsresultat.MÅ_VURDERES && !redigering) {
    return <ReisetidFerdigVisning vurdering={vurdering} rediger={() => setRedigering(true)} />;
  }
  return <ReisetidForm vurdering={vurdering} avbrytRedigering={() => setRedigering(false)} erRedigering={redigering} />;
};

export default ReisetidDetails;
