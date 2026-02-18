import { Box } from '@navikt/ds-react';
import { ReactNode } from 'react';
import styles from './fadingPanel.module.css';

interface OwnProps {
  withoutTopMargin?: boolean;
  children: ReactNode | ReactNode[];
}

/*
 * FadingPanel
 *
 * Wrapper rundt Panel-komponent. Animerer(fade-in) innholdet i panelet.
 */
const FadingPanel = ({ withoutTopMargin = false, children }: OwnProps) => (
  <Box.New padding="4" className={withoutTopMargin ? styles.containerWithoutTopMargin : styles.container}>
    {children}
  </Box.New>
);

export default FadingPanel;
