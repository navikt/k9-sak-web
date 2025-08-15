import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';
import styles from './alertStripeTrekantVarsel.module.css';

interface IconWithTextProps {
  text: string;
}

const AlertStripeTrekantVarsel = ({ text }: IconWithTextProps) => (
  <div className={styles.alertstripe}>
    <div className={styles.alertstripe_ikon}>
      <ExclamationmarkTriangleFillIcon fontSize="1.5rem" style={{ color: 'var(--ax-text-warning-decoration)' }} />
    </div>
    <BodyShort size="small" className={styles.alertstripe_tekst} as="div">
      {text}
    </BodyShort>
  </div>
);
export default AlertStripeTrekantVarsel;
