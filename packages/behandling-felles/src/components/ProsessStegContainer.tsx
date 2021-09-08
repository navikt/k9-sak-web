import React, { useMemo, ReactNode } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { ProcessMenu } from '@navikt/k9-react-components';

import ProsessStegMenyRad from '../types/prosessStegMenyRadTsType';

import styles from './prosessStegContainer.less';

interface OwnProps {
  formaterteProsessStegPaneler: ProsessStegMenyRad[];
  velgProsessStegPanelCallback: (index: number) => void;
  children: ReactNode;
}

const ProsessStegContainer = ({
  intl,
  formaterteProsessStegPaneler,
  velgProsessStegPanelCallback,
  children,
}: OwnProps & WrappedComponentProps) => {
  const steg = useMemo(
    () =>
      formaterteProsessStegPaneler.map(panel => ({
        ...panel,
        label: intl.formatMessage({ id: panel.labelId }),
        usePartialStatus: panel.type !== 'default' && panel.usePartialStatus,
      })),
    [formaterteProsessStegPaneler],
  );

  return (
    <div className={styles.container}>
      <div className={styles.meny}>
        <ProcessMenu steps={steg} onClick={velgProsessStegPanelCallback} />
      </div>
      {children}
    </div>
  );
};

export default injectIntl(ProsessStegContainer);
