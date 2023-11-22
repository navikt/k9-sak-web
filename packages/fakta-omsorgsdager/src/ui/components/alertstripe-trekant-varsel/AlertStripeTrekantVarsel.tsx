import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import WarningIcon from '../../icons/WarningIcon';
import styles from './alertStripeTrekantVarsel.css';

interface IconWithTextProps {
  text: string;
}

const AlertStripeTrekantVarsel = ({ text }: IconWithTextProps) => (
  <div className={styles.alertstripe}>
    <div className={styles.alertstripe_ikon}>
      <WarningIcon />
    </div>
    <Normaltekst className={styles.alertstripe_tekst} tag="div">
      {text}
    </Normaltekst>
  </div>
);
export default AlertStripeTrekantVarsel;
