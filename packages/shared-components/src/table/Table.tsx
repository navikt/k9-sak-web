import React, { ReactElement, FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames/bind';

import TableRow from './TableRow';
import TableColumn from './TableColumn';

import styles from './table.less';

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
  suppliedHeaders?: Element;
}

/**
 * Table
 *
 * Presentasjonskomponent. Definerer en tabell med rader og kolonner.
 */
const Table: FunctionComponent<OwnProps> = ({
  headerTextCodes = [],
  headerColumnContent = [],
  classNameTable = '',
  noHover = false,
  children,
  stripet = false,
  suppliedHeaders,
}) => (
  <table className={classNames('table', { [classNameTable]: classNameTable, noHover, stripet })}>
    <thead>
      <TableRow isHeader noHover={noHover}>
        {headers(headerTextCodes, headerColumnContent, suppliedHeaders)}
      </TableRow>
    </thead>
    <tbody>
      {Array.isArray(children)
        ? React.Children.map(children, child => React.cloneElement(child, { noHover }))
        : React.cloneElement(children, { noHover })}
    </tbody>
  </table>
);

export default Table;
