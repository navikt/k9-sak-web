import React from 'react';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import styles from './advarselIcon.css';

const AdvarselIcon = ({ title }: { title: string }) => (
  <ExclamationmarkTriangleFillIcon title={title} className={styles.advarselIkon} />
);

export default AdvarselIcon;
