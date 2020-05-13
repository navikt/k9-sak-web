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
  <div className={styles.bekreftelseContainer}>
    <div>
      {begrunnField}
      <VerticalSpacer sixteenPx />
      <FlexRow className={styles.submitKnapper}>
        {bekreftKnapp}
        {tilbakestillKnapp}
      </FlexRow>
    </div>
  </div>
);

export default BegrunnBekreftTilbakestillSeksjon;
