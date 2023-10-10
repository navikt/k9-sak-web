import classnames from 'classnames/bind';
import Panel from 'nav-frontend-paneler';
import React, { ReactNode } from 'react';

import styles from './borderBox.module.css';

const classNames = classnames.bind(styles);

interface OwnProps {
  error?: boolean;
  className?: string;
  children?: ReactNode | ReactNode[];
}

/*
 * BorderBox
 *
 * Valideringskomponent. Visar en box kring noe som skall fikses.
 */
const BorderBox = ({ error = false, className, children }: OwnProps) => (
  <Panel border className={classNames('borderbox', { error }, className)}>
    {children}
  </Panel>
);

export default BorderBox;
