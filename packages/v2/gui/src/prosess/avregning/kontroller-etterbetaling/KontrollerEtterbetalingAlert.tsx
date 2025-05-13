import { Alert } from '@navikt/ds-react';
import type { FC } from 'react';

import styles from './kontrollerEtterbetalingAlert.module.css';

const KontrollerEtterbetalingAlert: FC = () => {
  return (
    <Alert className={styles.kontrollerEtterbetalingAlert} variant="warning" size="small" contentMaxWidth={false}>
      Endrede opplysninger vil føre til en høy etterbetaling til bruker i en tidligere innvilget periode. Kontroller om
      dette er riktig.
    </Alert>
  );
};

export default KontrollerEtterbetalingAlert;
