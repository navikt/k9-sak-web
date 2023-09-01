import classnames from 'classnames/bind';
import React, { ReactElement, ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';

import TableColumn from './TableColumn';
import TableRow from './TableRow';

import styles from './table.css';

const classNames = classnames.bind(styles);

const EMPTY_STRING = 'EMPTY';

const isString = value => typeof value === 'string';

const headers = (headerTextCodes, headerColumnContent, suppliedHeaders) => {
  if (suppliedHeaders) {
    return suppliedHeaders;
  }

  if (headerTextCodes.length > 0) {
    return headerTextCodes.map(headerElement => {
      if (isString(headerElement) && headerElement.startsWith(EMPTY_STRING)) {
        return <TableColumn key={headerElement}>&nbsp;</TableColumn>;
      }
      return (
        <TableColumn key={headerElement.key ? headerElement.key : headerElement}>
          <FormattedMessage id={headerElement} />
        </TableColumn>
      );
    });
  }

  return headerColumnContent.map(element => <TableColumn key={element.key}>{element}</TableColumn>);
};

interface OwnProps {
  headerTextCodes?: any;
  headerColumnContent?: ReactElement[];
  children: ReactElement | ReactElement[];
  classNameTable?: string;
  noHover?: boolean;
  stripet?: boolean;
  suppliedHeaders?: ReactElement;
  withoutTbody?: boolean; // Denne må settes til true når man vil gruppere rader i flere tbody-tagger
  notFocusableHeader?: boolean;
}

/**
 * Table
 *
 * Presentasjonskomponent. Definerer en tabell med rader og kolonner.
 */
const Table = ({
  headerTextCodes = [],
  headerColumnContent = [],
  classNameTable = '',
  noHover = false,
  children,
  stripet = false,
  suppliedHeaders,
  withoutTbody = false,
  notFocusableHeader = false,
}: OwnProps) => {
  const performFunctionOnChildren = (
    childOrChildren: ReactElement | ReactElement[],
    func: (child: ReactElement) => ReactElement,
  ) => (Array.isArray(childOrChildren) ? React.Children.map(childOrChildren, func) : func(childOrChildren));

  const tableRowsWithNoHoverProp = childrenOfTbody =>
    performFunctionOnChildren(
      childrenOfTbody,
      (row: ReactNode) => React.isValidElement(row) && React.cloneElement(row as React.ReactElement<any>, { noHover }),
    );

  const content = withoutTbody
    ? performFunctionOnChildren(children, tbody => (
        <tbody {...tbody.props}>{tableRowsWithNoHoverProp(tbody.props.children)}</tbody>
      ))
    : tableRowsWithNoHoverProp(children);

  return (
    <table className={classNames('table', { [classNameTable]: classNameTable, noHover, stripet })}>
      <thead>
        <TableRow isHeader noHover={noHover} notFocusable={notFocusableHeader}>
          {headers(headerTextCodes, headerColumnContent, suppliedHeaders)}
        </TableRow>
      </thead>
      {withoutTbody ? content : <tbody>{content}</tbody>}
    </table>
  );
};

export default Table;
