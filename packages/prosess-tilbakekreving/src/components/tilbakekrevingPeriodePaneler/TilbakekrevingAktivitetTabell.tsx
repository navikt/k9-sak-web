import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

import { Table, TableColumn, TableRow } from '@fpsak-frontend/shared-components';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';

import styles from './tilbakekrevingAktivitetTabell.css';

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
              <Normaltekst>{y.aktivitet}</Normaltekst>
            </TableColumn>
            <TableColumn>
              <Normaltekst>{formatCurrencyNoKr(y.belop)}</Normaltekst>
            </TableColumn>
          </TableRow>
        );
      })}
    </Table>
  );
};

export default TilbakekrevingAktivitetTabell;
