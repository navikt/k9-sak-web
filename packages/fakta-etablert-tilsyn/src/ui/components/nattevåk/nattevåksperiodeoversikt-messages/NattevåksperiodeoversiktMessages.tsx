import { Alert } from '@navikt/ds-react';
import { Box, Margin } from '@navikt/ft-plattform-komponenter';
import React from 'react';
import NattevåkType from '../../../../types/NattevåkType';
import { getStringMedPerioder } from '../../../../util/periodUtils';

interface NattevåksperiodeoversiktMessagesProps {
  nattevåkData: NattevåkType;
}

const NattevåksperiodeoversiktMessages = ({ nattevåkData }: NattevåksperiodeoversiktMessagesProps) => {
  if (!nattevåkData.harPerioder()) {
    return <p>Søker har ikke oppgitt at det er behov for nattevåk.</p>;
  }
  if (nattevåkData.harPerioderTilVurdering()) {
    const perioderTilVurdering = nattevåkData.finnPerioderTilVurdering().map(({ periode }) => periode);
    return (
      <Box marginBottom={Margin.large}>
        <Alert size="small" variant="warning">
          {`Vurder behov for nattevåk i ${getStringMedPerioder(perioderTilVurdering)}.`}
        </Alert>
      </Box>
    );
  }
  return null;
};

export default NattevåksperiodeoversiktMessages;
