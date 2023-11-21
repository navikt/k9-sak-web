import React from 'react';
import { Period, getHumanReadablePeriodString } from '@navikt/k9-fe-period-utils';
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
