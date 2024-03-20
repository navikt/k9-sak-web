import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import styles from './spinner.module.css';

const Spinner = () => (
  <div className={styles.spinner}>
    <NavFrontendSpinner />
  </div>
);

export default Spinner;
