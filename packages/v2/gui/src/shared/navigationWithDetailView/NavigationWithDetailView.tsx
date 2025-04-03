import React from 'react';
import styles from './navigationWithDetailView.module.css';

export interface NavigationWithDetailViewProps {
  navigationSection: () => React.ReactNode;
  detailSection: () => React.ReactNode;
  showDetailSection: boolean;
}

export const NavigationWithDetailView = ({
  navigationSection,
  detailSection,
  showDetailSection,
}: NavigationWithDetailViewProps) => (
  <div className={styles.navigationWithDetailView}>
    <div className={`${styles.navigationSection} navigationWithDetailView__navigationSection`}>
      {navigationSection()}
    </div>
    {showDetailSection && (
      <div className={`${styles.detailSection} navigationWithDetailView__detailSection`}>{detailSection()}</div>
    )}
  </div>
);
