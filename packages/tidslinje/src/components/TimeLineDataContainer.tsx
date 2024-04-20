import { HGrid } from '@navikt/ds-react';
import React, { ReactNode } from 'react';
import styles from './timelineDataContainer.module.css';

const TimeLineDataContainer = ({ children }: { children: ReactNode }) => (
  <HGrid gap="1" columns={{ xs: '12fr' }}>
    <div className={styles.showDataContainer}>{children}</div>
  </HGrid>
);

export default TimeLineDataContainer;
