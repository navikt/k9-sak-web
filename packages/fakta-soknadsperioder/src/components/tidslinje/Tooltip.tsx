import React, { ReactNode } from 'react';
import classNames from 'classnames';
import styles from './Tooltip.less';

interface TooltipProps {
    children: ReactNode | ReactNode[];
    className?: string;
}

export const Tooltip = ({ children, className }: TooltipProps) => (
    <div className={classNames(className, styles.tooltip)}>{children}</div>
);
