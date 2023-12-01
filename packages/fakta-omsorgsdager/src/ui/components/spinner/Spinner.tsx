import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import styles from './spinner.css';

const Spinner = () => (
  <div className={styles.spinner}>
    <NavFrontendSpinner />
  </div>
);

export default Spinner;
