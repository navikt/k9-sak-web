import * as React from 'react';
import styles from './fullWidthRow.css';

interface FullWidthRowProps {
  children: React.ReactNode;
  colSpan: number;
}

const FullWidthRow = ({ children, colSpan }: FullWidthRowProps): JSX.Element => (
  <tr>
    <td className={styles.fullWidthRow__column} colSpan={colSpan}>
      {children}
    </td>
  </tr>
);

export default FullWidthRow;
