import { Column, Row } from 'nav-frontend-grid';
import React from 'react';
import styles from './dateContainer.less';

interface DateContainerProps {
  opptjeningFomDate: string;
  opptjeningTomDate: string;
}

const DateContainer = ({ opptjeningFomDate, opptjeningTomDate }: DateContainerProps) => (
  <div className={styles.dateContainer}>
    <div className={styles.dates}>
      <Row className={styles.dateContainer}>
        <Column xs="9" className={styles.startDateContainer}>
          <div>{opptjeningFomDate}</div>
        </Column>
        <Column xs="1" />
        <Column xs="2">
          <div className={styles.endDate}>{opptjeningTomDate}</div>
        </Column>
      </Row>
    </div>
  </div>
);

export default DateContainer;
