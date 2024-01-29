import classnames from 'classnames/bind';
import React, { FunctionComponent, ReactNode } from 'react';
import styles from './tableRow.module.css';

const classNames = classnames.bind(styles);

interface OwnProps {
  isHeader?: boolean;
  children: ReactNode | ReactNode[];
  className?: string;
  onClick?: () => void;
}

/**
 * TableRow
 *
 * Presentasjonskomponent. Tabellrad som brukes av komponenten Table.
 */
const TableRow: FunctionComponent<OwnProps> = ({ isHeader = false, children, className, onClick }) => (
  <tr
    className={classNames(className, {
      rowHeader: isHeader,
      rowContent: !isHeader,
    })}
    onClick={onClick}
  >
    {children}
  </tr>
);

export default TableRow;
