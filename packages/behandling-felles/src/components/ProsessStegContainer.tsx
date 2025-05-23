import { ProcessMenu } from '@navikt/ft-plattform-komponenter';
import React, { ReactNode, useMemo, useState } from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';

import ProsessStegMenyRad from '../types/prosessStegMenyRadTsType';

import styles from './prosessStegContainer.module.css';

interface OwnProps {
  formaterteProsessStegPaneler: ProsessStegMenyRad[];
  velgProsessStegPanelCallback: (index: number) => void;
  children: ReactNode;
  noBorder?: boolean;
}

export const VedtakFormContext = React.createContext(null);

const ProsessStegContainer = ({
  intl,
  formaterteProsessStegPaneler,
  velgProsessStegPanelCallback,
  children,
  noBorder,
}: OwnProps & WrappedComponentProps) => {
  const steg = useMemo(
    () =>
      formaterteProsessStegPaneler.map(panel => ({
        ...panel,
        label: intl.formatMessage({ id: panel.labelId }),
        usePartialStatus: panel.type !== 'default' && panel.type !== 'danger' && panel.usePartialStatus,
      })),
    [formaterteProsessStegPaneler, intl],
  );

  // Byttet ut redux-form med formik uten å tenke på at staten forsvinner når man bytter panel
  // Dette er en fiks for det, men bør på sikt erstattes med hyppig mellomlagring i vedtak
  const [vedtakFormState, setVedtakFormState] = useState(null);
  const value = useMemo(() => ({ vedtakFormState, setVedtakFormState }), [vedtakFormState, setVedtakFormState]);

  return (
    <div className={noBorder ? '' : styles.container}>
      <div className={styles.meny}>
        <ProcessMenu
          steps={steg}
          onClick={velgProsessStegPanelCallback}
          stepArrowContainerStyle={styles.stepArrowContainer}
        />
      </div>
      <VedtakFormContext.Provider value={value}>{children}</VedtakFormContext.Provider>
    </div>
  );
};

export default injectIntl(ProsessStegContainer);
