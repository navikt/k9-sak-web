import { Column, Row } from 'nav-frontend-grid';
import PropTypes from 'prop-types';
import React, { ReactNode } from 'react';
import styles from './timelineDataContainer.css';

const TimeLineDataContainer = ({ children }: { children: ReactNode }) => (
  <Row>
    <Column xs="12">
      <div className={styles.showDataContainer}>{children}</div>
    </Column>
  </Row>
);
TimeLineDataContainer.propTypes = {
  children: PropTypes.node,
};
export default TimeLineDataContainer;
