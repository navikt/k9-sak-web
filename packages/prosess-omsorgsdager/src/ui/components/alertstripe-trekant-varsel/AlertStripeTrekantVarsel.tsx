import { BodyShort } from '@navikt/ds-react';
import React from 'react';
import WarningIcon from '../../icons/WarningIcon';
import styles from './alertStripeTrekantVarsel.module.css';

interface IconWithTextProps {
  text: string;
}

const AlertStripeTrekantVarsel = ({ text }: IconWithTextProps) => (
  <div className={styles.alertstripe}>
    <div className={styles.alertstripe_ikon}>
      <WarningIcon />
    </div>
    <BodyShort size="small" className={styles.alertstripe_tekst} as="div">
      {text}
    </BodyShort>
  </div>
);
export default AlertStripeTrekantVarsel;
