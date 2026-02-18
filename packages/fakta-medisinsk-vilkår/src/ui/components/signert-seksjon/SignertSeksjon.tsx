import { Alert, Box, Heading, HStack } from '@navikt/ds-react';
import { type JSX } from 'react';

interface SignertSeksjonProps {
  harGyldigSignatur: boolean;
}

const SignertSeksjon = ({ harGyldigSignatur }: SignertSeksjonProps): JSX.Element => (
  <div>
    <HStack justify="space-between" align="end">
      <Heading size="small" level="2">
        Godkjent signatur
      </Heading>
    </HStack>
    <hr style={{ color: '#B7B1A9' }} />
    <Box.New marginBlock="4 0">
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
    </Box.New>
  </div>
);

export default SignertSeksjon;
