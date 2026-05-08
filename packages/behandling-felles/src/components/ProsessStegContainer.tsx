import { VedtaksbrevMal } from '@fpsak-frontend/utils/src/formidlingUtils';
import { ProcessMenu } from '@navikt/ft-plattform-komponenter';
import { useIntl } from 'react-intl';

import React, { ReactNode, useMemo, useState } from 'react';
import ProsessStegMenyRad from '../types/prosessStegMenyRadTsType';

import { Box } from '@navikt/ds-react';
import styles from './prosessStegContainer.module.css';

interface OwnProps {
  formaterteProsessStegPaneler: ProsessStegMenyRad[];
  velgProsessStegPanelCallback: (index: number) => void;
  children: ReactNode;
  hideMenu?: boolean; // Skjul menyen når v2-menyen brukes
}

interface VedtakFormState {
  brødtekst: string;
  overskrift: string;
  maler: VedtaksbrevMal[];
}

interface VedtakFormContextType {
  vedtakFormState: VedtakFormState | null;
  setVedtakFormState: React.Dispatch<React.SetStateAction<VedtakFormState | null>>;
}

export const VedtakFormContext = React.createContext<VedtakFormContextType | null>(null);

const ProsessStegContainer = ({
  formaterteProsessStegPaneler,
  velgProsessStegPanelCallback,
  children,
  hideMenu = false,
}: OwnProps) => {
  const intl = useIntl();
  const steg = useMemo(
    () =>
      formaterteProsessStegPaneler.map(panel => ({
        ...panel,
        label: intl.messages[panel.labelId] ? intl.formatMessage({ id: panel.labelId }) : panel.labelId,
        usePartialStatus: panel.type !== 'default' && panel.type !== 'danger' && panel.usePartialStatus,
      })),
    [formaterteProsessStegPaneler, intl],
  );

  // Byttet ut redux-form med formik uten å tenke på at staten forsvinner når man bytter panel
  // Dette er en fiks for det, men bør på sikt erstattes med hyppig mellomlagring i vedtak
  const [vedtakFormState, setVedtakFormState] = useState(null);
  const value = useMemo(() => ({ vedtakFormState, setVedtakFormState }), [vedtakFormState, setVedtakFormState]);

  return (
    <Box>
      {/* Skjul menyen når v2-menyen brukes */}
      {!hideMenu && (
        <div className={styles.meny}>
          <ProcessMenu
            steps={steg}
            onClick={velgProsessStegPanelCallback}
            stepArrowContainerStyle={styles.stepArrowContainer}
          />
        </div>
      )}
      <VedtakFormContext.Provider value={value}>{children}</VedtakFormContext.Provider>
    </Box>
  );
};

export default ProsessStegContainer;
