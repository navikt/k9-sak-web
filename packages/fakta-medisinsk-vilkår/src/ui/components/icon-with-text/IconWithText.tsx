import React, { type JSX } from 'react';
import styles from './iconWithText.module.css';

interface IconWithTextProps {
  iconRenderer: () => React.ReactNode;
  text: string;
}

const IconWithText = ({ text, iconRenderer }: IconWithTextProps): JSX.Element => (
  <div className={styles.iconWithText}>
    {iconRenderer()}
    <span className={styles.iconWithText__text}>{text}</span>
  </div>
);

export default IconWithText;
