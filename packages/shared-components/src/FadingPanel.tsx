import React, { ReactNode } from 'react';
import Panel from 'nav-frontend-paneler';

import styles from './fadingPanel.less';

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
