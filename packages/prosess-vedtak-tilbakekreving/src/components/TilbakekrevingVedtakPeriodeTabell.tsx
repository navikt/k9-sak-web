import { PeriodLabel, Table, TableColumn, TableRow } from '@fpsak-frontend/shared-components';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import { Kodeverk } from '@k9-sak-web/types';
import { BodyShort, Label } from '@navikt/ds-react';
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
      <TableRow key={periode.periode.fom}>
        <TableColumn>
          <BodyShort size="small">
            <PeriodLabel dateStringFom={periode.periode.fom} dateStringTom={periode.periode.tom} />
          </BodyShort>
        </TableColumn>
        <TableColumn>
          <BodyShort size="small">{formatCurrencyNoKr(periode.feilutbetaltBeløp)}</BodyShort>
        </TableColumn>
        <TableColumn>
          <BodyShort size="small">{getKodeverknavn(periode.vurdering)}</BodyShort>
        </TableColumn>
        <TableColumn>
          <BodyShort size="small">
            {periode.andelAvBeløp !== undefined && periode.andelAvBeløp !== null ? `${periode.andelAvBeløp}%` : ''}
          </BodyShort>
        </TableColumn>
        <TableColumn>
          <BodyShort size="small">{periode.renterProsent ? `${periode.renterProsent}%` : ''}</BodyShort>
        </TableColumn>
        <TableColumn>
          <BodyShort size="small">{formatCurrencyNoKr(periode.tilbakekrevingBeløp)}</BodyShort>
        </TableColumn>
        <TableColumn>
          <BodyShort size="small">{formatCurrencyNoKr(periode.tilbakekrevingBeløpEtterSkatt)}</BodyShort>
        </TableColumn>
      </TableRow>
    ))
    .concat(
      <TableRow key="sum">
        <TableColumn>
          <BodyShort size="small">
            <FormattedMessage id="TilbakekrevingVedtakPeriodeTabell.Sum" />
          </BodyShort>
        </TableColumn>
        <TableColumn>
          <BodyShort size="small">
            {formatCurrencyNoKr(perioder.reduce((sum, periode) => sum + periode.feilutbetaltBeløp, 0))}
          </BodyShort>
        </TableColumn>
        <TableColumn />
        <TableColumn />
        <TableColumn />
        <TableColumn>
          <Label size="small" as="p">
            {formatCurrencyNoKr(perioder.reduce((sum, periode) => sum + periode.tilbakekrevingBeløp, 0))}
          </Label>
        </TableColumn>
        <TableColumn>
          <Label size="small" as="p">
            {formatCurrencyNoKr(perioder.reduce((sum, periode) => sum + periode.tilbakekrevingBeløpEtterSkatt, 0))}
          </Label>
        </TableColumn>
      </TableRow>,
    );

  return (
    <div className={styles.table}>
      <Table noHover headerTextCodes={headerTextCodes}>
        {rader}
      </Table>
    </div>
  );
};

export default TilbakekrevingVedtakPeriodeTabell;
