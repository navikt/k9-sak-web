import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import Table from '@fpsak-frontend/shared-components/src/table/Table';
import TableRow from '@fpsak-frontend/shared-components/src/table/TableRow';
import TableColumn from '@fpsak-frontend/shared-components/src/table/TableColumn';

interface OwnProps {
  headerColumnContent: React.ReactElement[];
}

const IngenArbeidsforholdRegistrert = ({ headerColumnContent }: OwnProps) => (
  <Table headerColumnContent={headerColumnContent} noHover>
    <TableRow>
      <TableColumn>
        <Normaltekst>
          <FormattedMessage id="PersonArbeidsforholdTable.IngenArbeidsforholdRegistrert" />
        </Normaltekst>
      </TableColumn>
      <TableColumn />
      <TableColumn />
      <TableColumn />
      <TableColumn />
      <TableColumn />
    </TableRow>
  </Table>
);

export default IngenArbeidsforholdRegistrert;
