import { Alert } from '@navikt/ds-react';
import { Box, Margin, TitleWithUnderline } from '@navikt/ft-plattform-komponenter';
import React from 'react';

interface SignertSeksjonProps {
  harGyldigSignatur: boolean;
}

const SignertSeksjon = ({ harGyldigSignatur }: SignertSeksjonProps): JSX.Element => (
  <div>
    <TitleWithUnderline>Godkjent signatur</TitleWithUnderline>
    <Box marginTop={Margin.medium}>
      {harGyldigSignatur && (
        <Alert inline variant="success">
          Det finnes dokumentasjon som er signert av sykehuslege eller lege fra spesialisthelsetjenesten.
        </Alert>
      )}
      {!harGyldigSignatur && (
        <Alert inline variant="warning">
          Ingen legeerklæring fra sykehuslege/spesialisthelsetjenesten registrert.
        </Alert>
      )}
    </Box>
  </div>
);

export default SignertSeksjon;
