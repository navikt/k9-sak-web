import { Loader } from '@navikt/ds-react';
import React from 'react';
import styles from './spinner.module.css';

const Spinner = () => (
  <div className={styles.spinner}>
    <Loader size="large" title="Venter..." />
  </div>
);

export default Spinner;
