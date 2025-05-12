import { Alert } from '@navikt/ds-react';
import type { FC } from 'react';

const KontrollerEtterbetalingAlert: FC = () => {
  return (
    <Alert variant="warning" size="small" contentMaxWidth={false}>
      Ny inntektsmelding vil føre til en høy etterbetaling til bruker i en tidligere innvilget periode. Kontroller om
      dette er riktig.
    </Alert>
  );
};

export default KontrollerEtterbetalingAlert;
