import classnames from 'classnames/bind';
import React, { ReactNode } from 'react';

import styles from './flexContainer.module.css';

const classNames = classnames.bind(styles);

interface OwnProps {
  children?: ReactNode | ReactNode[];
  wrap?: boolean;
  fullHeight?: boolean;
}

const FlexContainer = ({ children, wrap = false, fullHeight = false }: OwnProps) => (
  <div className={classNames('flexContainer', 'fluid', { flexWrap: wrap, fullHeight })}>{children}</div>
);

export default FlexContainer;
