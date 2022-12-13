import React, { useEffect } from 'react';
import { GjennomgaaOpplaeringPeriode, GjennomgaaOpplaeringVurdering } from '@k9-sak-web/types';
import GjennomgaaOpplaeringOversikt from './GjennomgaaOpplaeringOversikt';

interface OwnProps {
  perioder: GjennomgaaOpplaeringPeriode[];
  vurderinger: GjennomgaaOpplaeringVurdering[];
  readOnly: boolean;
  løsAksjonspunkt: (payload: any) => void;
}

const GjennomgaaOpplaeringIndex = () => <GjennomgaaOpplaeringOversikt />;

export default GjennomgaaOpplaeringIndex;
