import { Period, getHumanReadablePeriodString } from '@k9-sak-web/utils';
import { Alert } from '@navikt/ds-react';
import React from 'react';

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
