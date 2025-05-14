import { Alert } from '@navikt/ds-react';
import type { FC } from 'react';
import ContentMaxWidth from '@k9-sak-web/gui/shared/ContentMaxWidth/ContentMaxWidth.js';

const KontrollerEtterbetalingAlert: FC = () => {
  return (
    <ContentMaxWidth>
      <Alert variant="warning" size="small">
        Endrede opplysninger vil føre til en høy etterbetaling til bruker i en tidligere innvilget periode. Kontroller
        om dette er riktig.
      </Alert>
    </ContentMaxWidth>
  );
};

export default KontrollerEtterbetalingAlert;
