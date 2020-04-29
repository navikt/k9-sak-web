import React, { FunctionComponent, ReactNode } from 'react';
import { VerticalSpacer } from '@fpsak-frontend/shared-components/index';
import FlexRow from '@fpsak-frontend/shared-components/src/flexGrid/FlexRow';
import styles from './begrunnBekreftTilbakestill.less';

interface BegrunnBekreftTilbakestillSeksjonProps {
  begrunnField: ReactNode;
  bekreftKnapp: ReactNode;
  tilbakestillKnapp: ReactNode;
}

const BegrunnBekreftTilbakestillSeksjon: FunctionComponent<BegrunnBekreftTilbakestillSeksjonProps> = ({
  begrunnField,
  bekreftKnapp,
  tilbakestillKnapp,
}) => (
  <FlexRow className={styles.bekreftelseContainer}>
    <div className={styles.textAreaStyle}>{begrunnField}</div>
    <VerticalSpacer sixteenPx />
    <FlexRow className={styles.submitKnapper}>
      {bekreftKnapp}
      {tilbakestillKnapp}
    </FlexRow>
  </FlexRow>
);

export default BegrunnBekreftTilbakestillSeksjon;
