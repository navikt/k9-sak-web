import classnames from 'classnames/bind';
import React, { ReactNode } from 'react';

import styles from './tableRow.css';

const classNames = classnames.bind(styles);

const createMouseDownHandler = (onMouseDown, id, model) => e => onMouseDown && onMouseDown(e, id, model);

const findNearestRow = element => (element.tagName === 'TR' ? element : findNearestRow(element.parentElement));

const setFocus = (e, isNext) => {
  const row = findNearestRow(e.target);
  const otherRow = isNext ? row.nextSibling : row.previousSibling;
  const element = otherRow || row;

  if (element) {
    element.focus();
    e.preventDefault();
  }
};

const createKeyHandler = (onKeyDown, id, model) => e => {
  if (e.key === 'ArrowDown') {
    setFocus(e, true);
  } else if (e.key === 'ArrowUp') {
    setFocus(e, false);
  } else if (onKeyDown && e.target.tagName !== 'TD' && (e.key === 'Enter' || e.key === ' ')) {
    onKeyDown(e, id, model);
    e.preventDefault();
  }
};

interface OwnProps {
  id?: number | string;
  model?: any;
  isHeader?: boolean;
  onMouseDown?: (e: React.MouseEvent, id: number | string, model: any) => void;
  onKeyDown?: (e: React.KeyboardEvent, id: number | string, model: any) => void;
  children: ReactNode | ReactNode[];
  noHover?: boolean;
  isSelected?: boolean;
  isBold?: boolean;
  isDashedBottomBorder?: boolean;
  isSolidBottomBorder?: boolean;
  isApLeftBorder?: boolean;
  className?: string;
  notFocusable?: boolean;
}

/**
 * TableRow
 *
 * Presentasjonskomponent. Tabellrad som brukes av komponenten Table.
 */
const TableRow = ({
  id,
  model,
  isHeader = false,
  onMouseDown,
  onKeyDown,
  children,
  noHover = false,
  isSelected = false,
  isBold = false,
  isDashedBottomBorder = false,
  isSolidBottomBorder = false,
  isApLeftBorder = false,
  className,
  notFocusable = false,
}: OwnProps) => (
  <tr
    className={classNames(className, {
      rowHeader: isHeader,
      rowContent: !isHeader && !noHover,
      selected: isSelected,
      bold: isBold,
      dashedBottomBorder: isDashedBottomBorder,
      solidBottomBorder: isSolidBottomBorder,
      apLeftBorder: isApLeftBorder,
    })}
    onMouseDown={createMouseDownHandler(onMouseDown, id, model)}
    onKeyDown={createKeyHandler(onKeyDown, id, model)}
    tabIndex={notFocusable ? null : 0}
  >
    {children}
  </tr>
);

export default TableRow;
