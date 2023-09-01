import classnames from 'classnames/bind';
import React, { ReactNode } from 'react';

import styles from './aksjonspunktBox.css';

const classNames = classnames.bind(styles);

interface OwnProps {
  children: ReactNode | ReactNode[];
  erAksjonspunktApent: boolean;
  className?: string;
}

const AksjonspunktBox = ({ erAksjonspunktApent, className, children }: OwnProps) => (
  <div className={classNames(className, 'aksjonspunkt', { erAksjonspunktApent })}>{children}</div>
);

export default AksjonspunktBox;
