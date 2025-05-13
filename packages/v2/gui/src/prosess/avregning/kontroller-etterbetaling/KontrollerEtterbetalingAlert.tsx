import { Alert } from '@navikt/ds-react';
import type { FC } from 'react';
import MaxWidth from '../../../shared/maxWidth/maxWidth';

const KontrollerEtterbetalingAlert: FC = () => {
  return (
    <MaxWidth>
      <Alert variant="warning" size="small">
        Ny inntektsmelding vil føre til en høy etterbetaling til bruker i en tidligere innvilget periode. Kontroller om
        dette er riktig.
      </Alert>
    </MaxWidth>
  );
};

export default KontrollerEtterbetalingAlert;
