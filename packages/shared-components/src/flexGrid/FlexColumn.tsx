import classnames from 'classnames/bind';
import React, { ReactNode } from 'react';

import styles from './flexColumn.css';

const classNames = classnames.bind(styles);

interface OwnProps {
  children?: ReactNode | ReactNode[];
  className?: string;
}

const FlexColumn = ({ children, className }: OwnProps) => (
  <div className={classNames('flexColumn', className)}>{children}</div>
);

export default FlexColumn;
