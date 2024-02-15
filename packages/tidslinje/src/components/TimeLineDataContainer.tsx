import { Column, Row } from 'nav-frontend-grid';
import React, { ReactNode } from 'react';
import styles from './timelineDataContainer.module.css';

const TimeLineDataContainer = ({ children }: { children: ReactNode }) => (
  <Row>
    <Column xs="12">
      <div className={styles.showDataContainer}>{children}</div>
    </Column>
  </Row>
);

export default TimeLineDataContainer;
