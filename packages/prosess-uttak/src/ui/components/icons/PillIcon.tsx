import * as React from 'react';
import styles from './PillIcon.module.css';

import type { JSX } from 'react';

interface PillIconProps {
  text: string;
  type: 'success' | 'warning' | 'info';
}

const PillIcon = ({ text, type }: PillIconProps): JSX.Element => {
  const style = {
    success: styles['PillIcon--success'],
    warning: styles['PillIcon--warning'],
    info: styles['PillIcon--info'],
  };

  return <div className={style[type]}>{text}</div>;
};

export default PillIcon;
