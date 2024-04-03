import { Table, TableColumn, TableRow } from '@fpsak-frontend/shared-components';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import { BodyShort } from '@navikt/ds-react';
import React from 'react';

import styles from './tilbakekrevingAktivitetTabell.module.css';

const headerTextCodes = ['TilbakekrevingAktivitetTabell.Aktivitet', 'TilbakekrevingAktivitetTabell.FeilutbetaltBelop'];

interface OwnProps {
  ytelser: {
    aktivitet: string;
    belop: number;
  }[];
}

const TilbakekrevingAktivitetTabell = ({ ytelser }: OwnProps) => {
  if (ytelser.length === 0) {
    return null;
  }
  let counter = 0;
  return (
    <Table headerTextCodes={headerTextCodes} noHover classNameTable={styles.feilutbetalingTable}>
      {ytelser.map(y => {
        counter += 1;
        return (
          <TableRow key={y.aktivitet + y.belop + counter}>
            <TableColumn>
              <BodyShort size="small">{y.aktivitet}</BodyShort>
            </TableColumn>
            <TableColumn>
              <BodyShort size="small">{formatCurrencyNoKr(y.belop)}</BodyShort>
            </TableColumn>
          </TableRow>
        );
      })}
    </Table>
  );
};

export default TilbakekrevingAktivitetTabell;
