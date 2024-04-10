import { HGrid } from '@navikt/ds-react';
import React from 'react';
import styles from './dateContainer.module.css';

interface DateContainerProps {
  opptjeningFomDato: string;
  opptjeningTomDato: string;
}

const DateContainer = ({ opptjeningFomDato, opptjeningTomDato }: DateContainerProps) => (
  <div className={styles.dateContainer}>
    <div className={styles.dates}>
      <HGrid gap="1" columns={{ xs: '1fr 9fr 2fr' }} className={styles.dateContainer}>
        <div className={styles.startDateContainer} />
        <div>{opptjeningFomDato}</div>
        <div className={styles.endDate}>{opptjeningTomDato}</div>
      </HGrid>
    </div>
  </div>
);

export default DateContainer;
