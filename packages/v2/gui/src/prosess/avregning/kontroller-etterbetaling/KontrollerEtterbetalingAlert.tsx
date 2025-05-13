import { Alert } from '@navikt/ds-react';
import type { FC } from 'react';
import MaxWidth from '@k9-sak-web/gui/shared/maxWidth/maxWidth.js';

const KontrollerEtterbetalingAlert: FC = () => {
  return (
    <MaxWidth>
      <Alert variant="warning" size="small">
        Endrede opplysninger vil føre til en høy etterbetaling til bruker i en tidligere innvilget periode. Kontroller
        om dette er riktig.
      </Alert>
    </MaxWidth>
  );
};

export default KontrollerEtterbetalingAlert;
