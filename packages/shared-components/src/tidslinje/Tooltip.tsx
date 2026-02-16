import classNames from 'classnames';
import React, { type ReactNode } from 'react';
import styles from './Tooltip.module.css';

interface TooltipProps {
  children: ReactNode | ReactNode[];
  className?: string;
}

const Tooltip = ({ children, className }: TooltipProps) => (
  <div className={classNames(className, styles.tooltip)}>{children}</div>
);

export default Tooltip;
