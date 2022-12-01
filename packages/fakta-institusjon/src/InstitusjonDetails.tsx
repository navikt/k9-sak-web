import React from 'react';
import { InstitusjonVurderingMedPeriode, Vurderingsresultat } from '@k9-sak-web/types';
import InstitusjonFerdigVisning from './InstitusjonFerdigVisning';
import InstitusjonForm from './InstitusjonForm';

interface OwnProps {
  vurdering: InstitusjonVurderingMedPeriode;
  readOnly: boolean;
}

const InstitusjonDetails = ({ vurdering, readOnly }: OwnProps) => {
  if (vurdering.resultat !== Vurderingsresultat.IKKE_VURDERT) {
    return <InstitusjonFerdigVisning vurdering={vurdering} readOnly={readOnly} />;
  }
  return <InstitusjonForm vurdering={vurdering} readOnly={readOnly} />;
};

export default InstitusjonDetails;
