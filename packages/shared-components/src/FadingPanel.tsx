import { Box } from '@navikt/ds-react';
import React, { ReactNode } from 'react';
import styles from './fadingPanel.module.css';

interface OwnProps {
  withoutTopMargin?: boolean;
  children: ReactNode | ReactNode[];
}

/*
 * FadingPanel
 *
 * Wrapper rundt Panel-komponenten fra nav-frontend. Animerer(fade-in) innholdet i panelet.
 */
const FadingPanel = ({ withoutTopMargin = false, children }: OwnProps) => (
  <Box
    background="surface-default"
    padding="4"
    className={withoutTopMargin ? styles.containerWithoutTopMargin : styles.container}
  >
    {children}
  </Box>
);

export default FadingPanel;
