import * as React from 'react';
import Alertstripe, { AlertStripeType } from 'nav-frontend-alertstriper';
import styles from './alertstripe.module.css';

interface CustomAlertstripeProps {
  type: AlertStripeType;
  children: React.ReactNode;
}

const CustomAlertstripe = ({ type, children }: CustomAlertstripeProps) => (
  <Alertstripe type={type} className={styles.customAlertstripe}>
    {children}
  </Alertstripe>
);

export default CustomAlertstripe;
