import { PeriodLabel } from '@k9-sak-web/shared-components';
import { Kodeverk } from '@k9-sak-web/types';
import { formatCurrencyNoKr } from '@k9-sak-web/utils';
import { BodyShort, Label, Table } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { BeregningResultatPeriode } from '../types/beregningsresultatTilbakekrevingTsType';

import styles from './tilbakekrevingVedtakPeriodeTabell.module.css';

const headerTextCodes = [
  'TilbakekrevingVedtakPeriodeTabell.Periode',
  'TilbakekrevingVedtakPeriodeTabell.FeilutbetaltBelop',
  'TilbakekrevingVedtakPeriodeTabell.Vurdering',
  'TilbakekrevingVedtakPeriodeTabell.AndelAvBelop',
  'TilbakekrevingVedtakPeriodeTabell.Renter',
  'TilbakekrevingVedtakPeriodeTabell.ForSkatt',
  'TilbakekrevingVedtakPeriodeTabell.BelopSomTilbakekreves',
];

interface OwnProps {
  perioder: BeregningResultatPeriode[];
  getKodeverknavn: (kodeverk: Kodeverk) => string;
}

const TilbakekrevingVedtakPeriodeTabell = ({ perioder, getKodeverknavn }: OwnProps) => {
  const rader = perioder
    .map(periode => (
      <Table.Row key={periode.periode.fom} shadeOnHover={false}>
        <Table.DataCell>
          <BodyShort size="small">
            <PeriodLabel dateStringFom={periode.periode.fom} dateStringTom={periode.periode.tom} />
          </BodyShort>
        </Table.DataCell>
        <Table.DataCell>
          <BodyShort size="small">{formatCurrencyNoKr(periode.feilutbetaltBeløp)}</BodyShort>
        </Table.DataCell>
        <Table.DataCell>
          <BodyShort size="small">{getKodeverknavn(periode.vurdering)}</BodyShort>
        </Table.DataCell>
        <Table.DataCell>
          <BodyShort size="small">
            {periode.andelAvBeløp !== undefined && periode.andelAvBeløp !== null ? `${periode.andelAvBeløp}%` : ''}
          </BodyShort>
        </Table.DataCell>
        <Table.DataCell>
          <BodyShort size="small">{periode.renterProsent ? `${periode.renterProsent}%` : ''}</BodyShort>
        </Table.DataCell>
        <Table.DataCell>
          <BodyShort size="small">{formatCurrencyNoKr(periode.tilbakekrevingBeløp)}</BodyShort>
        </Table.DataCell>
        <Table.DataCell>
          <BodyShort size="small">{formatCurrencyNoKr(periode.tilbakekrevingBeløpEtterSkatt)}</BodyShort>
        </Table.DataCell>
      </Table.Row>
    ))
    .concat(
      <Table.Row key="sum" shadeOnHover={false}>
        <Table.DataCell>
          <BodyShort size="small">
            <FormattedMessage id="TilbakekrevingVedtakPeriodeTabell.Sum" />
          </BodyShort>
        </Table.DataCell>
        <Table.DataCell>
          <BodyShort size="small">
            {formatCurrencyNoKr(perioder.reduce((sum, periode) => sum + periode.feilutbetaltBeløp, 0))}
          </BodyShort>
        </Table.DataCell>
        <Table.DataCell />
        <Table.DataCell />
        <Table.DataCell />
        <Table.DataCell>
          <Label size="small" as="p">
            {formatCurrencyNoKr(perioder.reduce((sum, periode) => sum + periode.tilbakekrevingBeløp, 0))}
          </Label>
        </Table.DataCell>
        <Table.DataCell>
          <Label size="small" as="p">
            {formatCurrencyNoKr(perioder.reduce((sum, periode) => sum + periode.tilbakekrevingBeløpEtterSkatt, 0))}
          </Label>
        </Table.DataCell>
      </Table.Row>,
    );

  return (
    <div className={styles.table}>
      <Table>
        <Table.Header>
          <Table.Row shadeOnHover={false}>
            {headerTextCodes.map(text => (
              <Table.HeaderCell scope="col" key={text}>
                <FormattedMessage id={text} />
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>{rader}</Table.Body>
      </Table>
    </div>
  );
};

export default TilbakekrevingVedtakPeriodeTabell;
