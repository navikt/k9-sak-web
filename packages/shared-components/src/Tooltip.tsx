import React, { ReactNode } from 'react';
import classnames from 'classnames/bind';

import styles from './tooltip.less';

const classNames = classnames.bind(styles);

interface OwnProps {
  children: ReactNode | string;
  content: ReactNode | string;
  alignLeft?: boolean;
  alignRight?: boolean;
  alignTop?: boolean;
  alignBottom?: boolean;
}

/**
 * Tooltip
 */
const Tooltip = ({
  children,
  content,
  alignRight = false,
  alignLeft = false,
  alignTop = false,
  alignBottom = false,
}: OwnProps) => (
  <div className={styles.tooltip}>
    <span
      className={classNames(styles.tooltiptext, {
        right: alignRight || (!alignLeft && !alignTop && !alignBottom),
        left: alignLeft,
        top: alignTop,
        bottom: alignBottom,
      })}
    >
      {content}
    </span>
    {children}
  </div>
);

export default Tooltip;
