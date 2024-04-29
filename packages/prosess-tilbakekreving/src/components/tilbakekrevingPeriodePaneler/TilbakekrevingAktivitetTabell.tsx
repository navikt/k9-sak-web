import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import { BodyShort, Table } from '@navikt/ds-react';
import React from 'react';
import { useIntl } from 'react-intl';
import styles from './tilbakekrevingAktivitetTabell.module.css';

const headerTextCodes = ['TilbakekrevingAktivitetTabell.Aktivitet', 'TilbakekrevingAktivitetTabell.FeilutbetaltBelop'];

interface OwnProps {
  ytelser: {
    aktivitet: string;
    belop: number;
  }[];
}

const TilbakekrevingAktivitetTabell = ({ ytelser }: OwnProps) => {
  const intl = useIntl();
  if (ytelser.length === 0) {
    return null;
  }
  let counter = 0;
  return (
    <Table className={styles.feilutbetalingTable}>
      <Table.Header>
        <Table.Row shadeOnHover={false}>
          {headerTextCodes.map(text => (
            <Table.HeaderCell scope="col" key={text}>
              {intl.formatMessage({ id: text })}
            </Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {ytelser.map(y => {
          counter += 1;
          return (
            <Table.Row key={y.aktivitet + y.belop + counter} shadeOnHover={false}>
              <Table.DataCell>
                <BodyShort size="small">{y.aktivitet}</BodyShort>
              </Table.DataCell>
              <Table.DataCell>
                <BodyShort size="small">{formatCurrencyNoKr(y.belop)}</BodyShort>
              </Table.DataCell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};

export default TilbakekrevingAktivitetTabell;
