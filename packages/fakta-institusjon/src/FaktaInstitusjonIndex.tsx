import React, { useEffect } from 'react';
import { InstitusjonPeriode, InstitusjonVurdering } from '@k9-sak-web/types';
import InstitusjonOversikt from './InstitusjonOversikt';

interface OwnProps {
  perioder: InstitusjonPeriode[];
  vurderinger: InstitusjonVurdering[];
  readOnly: boolean;
}

const FaktaInstitusjonIndex = ({ perioder, vurderinger, readOnly }: OwnProps) => (
  <div>
    <InstitusjonOversikt perioder={perioder} vurderinger={vurderinger} readOnly={readOnly} />
  </div>
);

export default FaktaInstitusjonIndex;
