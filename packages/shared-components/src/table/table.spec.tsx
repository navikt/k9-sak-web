import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from '../../i18n/nb_NO.json';
import Table from './Table';
import TableColumn from './TableColumn';
import TableRow from './TableRow';

describe('<Table>', () => {
  const headerTextCodes = ['FagsakList.Saksnummer', 'FagsakList.Sakstype'];

  it('skal vise korrekt antall kolonneheadere med korrekt tekst', () => {
    renderWithIntl(
      <Table headerTextCodes={headerTextCodes}>
        <TableRow id="1">
          <TableColumn key={1}>{12345}</TableColumn>
          <TableColumn key={2}>{23446}</TableColumn>
        </TableRow>
      </Table>,
      { messages },
    );

    expect(screen.getByText('FagsakList.Saksnummer')).toBeInTheDocument();
    expect(screen.getByText('FagsakList.Sakstype')).toBeInTheDocument();
  });

  it('skal vise korrekt antall kolonneheadere med korrekt tekst for formatterte headere', () => {
    const formattedHeaderTextCodes = [
      <FormattedMessage id="FagsakList.Saksnummer" />,
      <FormattedMessage id="FagsakList.Sakstype" />,
    ];

    renderWithIntl(
      <Table headerColumnContent={formattedHeaderTextCodes}>
        <TableRow id="1">
          <TableColumn key={1}>{12345}</TableColumn>
          <TableColumn key={2}>{23446}</TableColumn>
        </TableRow>
      </Table>,
      { messages },
    );
    expect(screen.getByText('FagsakList.Saksnummer')).toBeInTheDocument();
    expect(screen.getByText('FagsakList.Sakstype')).toBeInTheDocument();
  });

  it('skal vise korrekt antall rader og kolonner', () => {
    renderWithIntl(
      <Table headerTextCodes={headerTextCodes}>
        <TableRow key={1} id="1">
          <TableColumn key={1}>{12345}</TableColumn>
          <TableColumn key={2}>{23446}</TableColumn>
        </TableRow>
        <TableRow key={2} id="2">
          <TableColumn key={3}>{34567}</TableColumn>
          <TableColumn key={4}>{45678}</TableColumn>
        </TableRow>
      </Table>,
    );

    expect(screen.getByText('12345')).toBeInTheDocument();
    expect(screen.getByText('23446')).toBeInTheDocument();
    expect(screen.getByText('34567')).toBeInTheDocument();
    expect(screen.getByText('45678')).toBeInTheDocument();
  });
});
