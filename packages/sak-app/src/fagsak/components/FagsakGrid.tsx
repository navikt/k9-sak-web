import React, { ReactNode } from 'react';
import MediaQuery from 'react-responsive';

import styles from './fagsakGrid.less';

interface OwnProps {
  behandlingContent: ReactNode;
  profileAndNavigationContent: ReactNode;
  supportContent: () => ReactNode;
  visittkortContent: () => ReactNode;
}

/**
 * FagsakGrid
 *
 * Presentasjonskomponent. Har ansvar for å sette opp applikasjonens hovedgrid.
 */
const FagsakGrid = ({
  behandlingContent,
  profileAndNavigationContent,
  supportContent,
  visittkortContent,
}: OwnProps) => (
  <>
    <MediaQuery maxWidth={1599}>{visittkortContent()}</MediaQuery>
    <div className={styles.gridContainer}>
      <div className={styles.leftColumn}>
        <MediaQuery minWidth={1600}>{visittkortContent()}</MediaQuery>
        {behandlingContent}
      </div>
      <div className={styles.rightColumn}>
        <div>{profileAndNavigationContent}</div>
        <div>{supportContent()}</div>
      </div>
    </div>
  </>
);

export default FagsakGrid;
