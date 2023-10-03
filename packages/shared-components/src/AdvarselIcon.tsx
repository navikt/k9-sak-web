import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import React from 'react';
import styles from './advarselIcon.module.css';

const AdvarselIcon = ({ title }: { title: string }) => (
  <ExclamationmarkTriangleFillIcon title={title} className={styles.advarselIkon} />
);

export default AdvarselIcon;
