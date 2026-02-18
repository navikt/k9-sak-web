import React from 'react';
import styles from './basicList.module.css';

export interface BasicListProps {
  elements: React.ReactNode[];
}

export const BasicList = ({ elements }: BasicListProps) => (
  <ul className={styles.basicList}>
    {elements.map((element, index) => (
      <li className={styles.element} key={`element-${index}`}>
        {element}
      </li>
    ))}
  </ul>
);
