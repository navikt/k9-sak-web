import React, { ReactNode } from 'react';

import styles from './floatRight.module.css';

interface OwnProps {
  children?: ReactNode;
}

const FloatRight = ({ children }: OwnProps) => <span className={styles.floatRight}>{children}</span>;

export default FloatRight;
