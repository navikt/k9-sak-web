import Panel from 'nav-frontend-paneler';
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
  <Panel className={withoutTopMargin ? styles.containerWithoutTopMargin : styles.container}>{children}</Panel>
);

export default FadingPanel;
