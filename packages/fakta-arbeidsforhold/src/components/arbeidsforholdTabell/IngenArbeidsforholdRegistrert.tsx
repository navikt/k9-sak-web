import { BodyShort } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Table from '@fpsak-frontend/shared-components/src/table/Table';
import TableColumn from '@fpsak-frontend/shared-components/src/table/TableColumn';
import TableRow from '@fpsak-frontend/shared-components/src/table/TableRow';

interface OwnProps {
  headerColumnContent: React.ReactElement[];
}

const IngenArbeidsforholdRegistrert = ({ headerColumnContent }: OwnProps) => (
  <Table headerColumnContent={headerColumnContent} noHover>
    <TableRow>
      <TableColumn>
        <BodyShort size="small">
          <FormattedMessage id="PersonArbeidsforholdTable.IngenArbeidsforholdRegistrert" />
        </BodyShort>
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
