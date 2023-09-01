import { Column, Row } from 'nav-frontend-grid';
import React from 'react';
import styles from './dateContainer.module.css';

interface DateContainerProps {
  opptjeningFomDato: string;
  opptjeningTomDato: string;
}

const DateContainer = ({ opptjeningFomDato, opptjeningTomDato }: DateContainerProps) => (
  <div className={styles.dateContainer}>
    <div className={styles.dates}>
      <Row className={styles.dateContainer}>
        <Column xs="1" className={styles.startDateContainer} />
        <Column xs="9">
          <div>{opptjeningFomDato}</div>
        </Column>
        <Column xs="2">
          <div className={styles.endDate}>{opptjeningTomDato}</div>
        </Column>
      </Row>
    </div>
  </div>
);

export default DateContainer;
