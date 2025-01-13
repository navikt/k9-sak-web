import { BodyShort, Table } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

interface OwnProps {
  headerColumnContent: React.ReactElement[];
}

const IngenArbeidsforholdRegistrert = ({ headerColumnContent }: OwnProps) => (
  <Table>
    <Table.Header>
      <Table.Row shadeOnHover={false}>
        {headerColumnContent.map(textCode => (
          <Table.HeaderCell scope="col" key={textCode.key}>
            {textCode}
          </Table.HeaderCell>
        ))}
      </Table.Row>
    </Table.Header>
    <Table.Body>
      <Table.Row shadeOnHover={false}>
        <Table.DataCell>
          <BodyShort size="small">
            <FormattedMessage id="PersonArbeidsforholdTable.IngenArbeidsforholdRegistrert" />
          </BodyShort>
        </Table.DataCell>
        <Table.DataCell />
        <Table.DataCell />
        <Table.DataCell />
        <Table.DataCell />
        <Table.DataCell />
      </Table.Row>
    </Table.Body>
  </Table>
);

export default IngenArbeidsforholdRegistrert;
