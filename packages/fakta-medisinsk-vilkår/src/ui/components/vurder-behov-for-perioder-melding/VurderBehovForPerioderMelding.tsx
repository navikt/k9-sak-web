import React, { type JSX } from 'react';
import { Period, getHumanReadablePeriodString } from '@fpsak-frontend/utils';
import { Alert } from '@navikt/ds-react';

interface VurderBehovForPerioderMeldingProps {
  vurderingsnavn: string;
  perioder: Period[];
}

const VurderBehovForPerioderMelding = ({
  vurderingsnavn,
  perioder,
}: VurderBehovForPerioderMeldingProps): JSX.Element => (
  <Alert size="small" variant="warning">
    Vurder behov for
    {vurderingsnavn}
    for ${getHumanReadablePeriodString(perioder)}
  </Alert>
);

export default VurderBehovForPerioderMelding;
