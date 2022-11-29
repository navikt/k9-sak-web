import React, { useEffect } from 'react';
import { InstitusjonPeriode, InstitusjonVurdering } from '@k9-sak-web/types';
import InstitusjonOversikt from './InstitusjonOversikt';

interface OwnProps {
  perioder: InstitusjonPeriode[];
  vurderinger: InstitusjonVurdering[];
}

const FaktaInstitusjonIndex = ({ perioder, vurderinger }: OwnProps) => (
  <div>
    <InstitusjonOversikt perioder={perioder} vurderinger={vurderinger} />
  </div>
);

export default FaktaInstitusjonIndex;
