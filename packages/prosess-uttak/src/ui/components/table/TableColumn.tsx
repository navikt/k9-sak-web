import React, { ReactNode, FunctionComponent } from 'react';
import classnames from 'classnames/bind';

import styles from './tableColumn.module.css';

const classNames = classnames.bind(styles);

interface OwnProps {
  children?: number | string | ReactNode;
  className?: string;
  hidden?: boolean;
  colSpan?: number;
}

/**
 * TableColumn
 *
 * Presentasjonskomponent. Tabellkolonne som brukes av komponenten Table.
 */
const TableColumn: FunctionComponent<OwnProps> = ({ children = '', className, hidden = false, colSpan }) => {
  if (hidden) {
    return null;
  }
  return (
    <td className={classNames(styles.columnStyle, className)} colSpan={colSpan}>
      {children}
    </td>
  );
};

export default TableColumn;
