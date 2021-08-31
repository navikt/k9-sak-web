import React, { ReactNode } from 'react';
import classnames from 'classnames/bind';

import styles from './flexColumn.less';

const classNames = classnames.bind(styles);

interface OwnProps {
  children?: ReactNode | ReactNode[];
  className?: string;
}

const FlexColumn = ({ children, className }: OwnProps) => (
  <div className={classNames('flexColumn', className)}>{children}</div>
);

export default FlexColumn;
