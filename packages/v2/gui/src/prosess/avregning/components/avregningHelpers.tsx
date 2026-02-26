import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
import { Table } from '@navikt/ds-react';
import classnames from 'classnames/bind';
import styles from './avregningTable.module.css';
import { formatCurrencyWithoutKr } from '@k9-sak-web/gui/utils/formatters.js';
import type { SimuleringResultatPerMånedDto } from '@k9-sak-web/backend/k9oppdrag/kontrakt/simulering/v1/SimuleringResultatPerMånedDto.js';

const classNames = classnames.bind(styles);

export interface RangeOfMonths {
  month: string;
  year: string;
}

export const createColumns = (
  perioder: SimuleringResultatPerMånedDto[],
  rangeOfMonths: RangeOfMonths[],
  nextPeriod: string,
  boldText?: boolean,
) => {
  const nextPeriodFormatted = `${initializeDate(nextPeriod).format('MMMMYY')}`;

  const perioderData = rangeOfMonths.map(month => {
    const periode = perioder.find(
      periode =>
        initializeDate(periode.periode.tom).format('MMMMYY').toLowerCase() ===
        `${month.month}${month.year}`.toLowerCase(),
    );
    return periode || { måned: `${month.month}${month.year}`, beløp: null };
  });

  return perioderData.map((måned, månedIndex) => (
    <Table.DataCell
      textSize="small"
      key={`columnIndex${månedIndex + 1}`}
      className={classNames({
        rodTekst: måned.beløp !== null && måned.beløp < 0,
        lastColumn:
          'måned' in måned && måned.måned
            ? måned.måned === nextPeriodFormatted
            : 'periode' in måned && initializeDate(måned.periode.tom).format('MMMMYY') === nextPeriodFormatted,
        'font-bold': boldText,
      })}
    >
      {formatCurrencyWithoutKr(måned.beløp ?? 0)}
    </Table.DataCell>
  ));
};
