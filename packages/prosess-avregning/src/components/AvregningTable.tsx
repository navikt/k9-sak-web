import mottakerTyper from '@fpsak-frontend/kodeverk/src/mottakerTyper';
import { formatCurrencyNoKr, getRangeOfMonths } from '@fpsak-frontend/utils';
import { Periode, SimuleringMottaker, SimuleringResultatRad } from '@k9-sak-web/types';
import { BodyShort, Table } from '@navikt/ds-react';
import classnames from 'classnames/bind';
import moment from 'moment/moment';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import CollapseButton from './CollapseButton';
import styles from './avregningTable.module.css';

const classNames = classnames.bind(styles);

interface RangeOfMonths {
  month: string;
  year: string;
}

export const avregningCodes = {
  DIFFERANSE: 'differanse',
  INNTREKK: 'inntrekk',
  FEILUTBETALING: 'feilutbetaling',
  INNTREKKNESTEMÅNED: 'inntrekkNesteMåned',
  OPPFYLT: 'oppfylt',
  REDUKSJON: 'reduksjon',
};

const isNextPeriod = (month: RangeOfMonths, nextPeriod: string) =>
  `${month.month}${month.year}` === (nextPeriod ? moment(nextPeriod).format('MMMMYY') : false);

const getHeaderCodes = (
  showCollapseButton: boolean,
  collapseProps: { toggleDetails: AvregningTableProps['toggleDetails']; showDetails: boolean; mottakerIndex: number },
  rangeOfMonths: RangeOfMonths[],
  nextPeriod: string,
) => {
  const firstElement = showCollapseButton ? (
    <CollapseButton {...collapseProps} key={`collapseButton-${rangeOfMonths.length}`} />
  ) : (
    <div />
  );
  return [
    firstElement,
    ...rangeOfMonths.map(month => (
      <span
        className={classNames({
          nextPeriod: isNextPeriod(month, nextPeriod),
          normalPeriod: !isNextPeriod(month, nextPeriod),
        })}
        key={`${month.month}-${month.year}`}
      >
        <FormattedMessage id={`Avregning.headerText.${month.month}`} /> {month.year}
      </span>
    )),
  ];
};

const showCollapseButton = (mottakerResultatPerFag: ResultatPerFagområde[]) =>
  mottakerResultatPerFag.some(fag => fag.rader.length > 1);

const rowToggable = (fagOmråde: ResultatPerFagområde, rowIsFeilUtbetalt: boolean) => {
  const fagFeilUtbetalt = fagOmråde.rader.find(rad => rad.feltnavn === avregningCodes.DIFFERANSE);
  return fagFeilUtbetalt && !rowIsFeilUtbetalt;
};

const rowIsHidden = (isRowToggable: boolean, showDetails: boolean) => isRowToggable && !showDetails;

const createColumns = (
  perioder: SimuleringResultatRad['resultaterPerMåned'],
  rangeOfMonths: RangeOfMonths[],
  nextPeriod: string,
  boldText?: boolean,
) => {
  const nextPeriodFormatted = `${moment(nextPeriod).format('MMMMYY')}`;

  const perioderData = rangeOfMonths.map(month => {
    const periodeExists = perioder.find(
      periode => moment(periode.periode.tom).format('MMMMYY') === `${month.month}${month.year}`,
    );
    return periodeExists || { måned: `${month.month}${month.year}`, beløp: null };
  });

  return perioderData.map((måned, månedIndex) => (
    <Table.DataCell
      key={`columnIndex${månedIndex + 1}`}
      className={classNames({
        rodTekst: måned.beløp < 0,
        lastColumn:
          'måned' in måned && måned.måned
            ? måned.måned === nextPeriodFormatted
            : 'periode' in måned && moment(måned.periode.tom).format('MMMMYY') === nextPeriodFormatted,
        'font-bold': boldText,
      })}
    >
      {formatCurrencyNoKr(måned.beløp)}
    </Table.DataCell>
  ));
};

const tableTitle = (mottaker: SimuleringMottaker) =>
  mottaker.mottakerType === mottakerTyper.ARBG ? (
    <BodyShort
      size="small"
      className={styles.tableTitle}
    >{`${mottaker.mottakerNavn} (${mottaker.mottakerNummer})`}</BodyShort>
  ) : null;

const getResultatRadene = (
  ingenPerioderMedAvvik: boolean,
  resultatPerFagområde: ResultatPerFagområde[],
  resultatOgMotregningRader: SimuleringResultatRad[],
) => {
  if (!ingenPerioderMedAvvik) {
    return resultatOgMotregningRader;
  }
  return resultatPerFagområde.length > 1
    ? resultatOgMotregningRader.filter(resultat => resultat.feltnavn !== avregningCodes.INNTREKKNESTEMÅNED)
    : [];
};

const avvikBruker = (ingenPerioderMedAvvik: boolean, mottakerTypeKode: string) =>
  !!(ingenPerioderMedAvvik && mottakerTypeKode === mottakerTyper.BRUKER);
const getPeriodeFom = (periodeFom: string, nesteUtbPeriodeFom: string) => periodeFom || nesteUtbPeriodeFom;

const getPeriod = (ingenPerioderMedAvvik: boolean, periodeFom: string, mottaker: SimuleringMottaker) =>
  getRangeOfMonths(
    avvikBruker(ingenPerioderMedAvvik, mottaker.mottakerType)
      ? moment(mottaker.nesteUtbPeriode.tom).subtract(1, 'months')
      : getPeriodeFom(periodeFom, mottaker.nesteUtbPeriode.fom),
    mottaker.nesteUtbPeriode.tom,
  );

interface ResultatPerFagområde {
  fagOmrådeKode: string;
  rader: SimuleringResultatRad[];
}

interface AvregningTableProps {
  toggleDetails: (id: number) => void;
  showDetails: { id: number; show: boolean }[];
  simuleringResultat: {
    periode: Periode;
    perioderPerMottaker: SimuleringMottaker[];
  };
  ingenPerioderMedAvvik: boolean;
}

const AvregningTable = ({
  simuleringResultat,
  toggleDetails,
  showDetails,
  ingenPerioderMedAvvik,
}: AvregningTableProps) => (
  <>
    {simuleringResultat.perioderPerMottaker.map((mottaker, mottakerIndex) => {
      const rangeOfMonths = getPeriod(ingenPerioderMedAvvik, simuleringResultat.periode?.fom, mottaker);
      const nesteMåned = mottaker.nesteUtbPeriode.tom;
      const visDetaljer = showDetails.find(d => d.id === mottakerIndex);
      return (
        <div className={styles.tableWrapper} key={`tableIndex${mottakerIndex + 1}`}>
          {tableTitle(mottaker)}
          <Table key={`tableIndex${mottakerIndex + 1}`} className={styles.simuleringTable}>
            <Table.Header>
              <Table.Row>
                {getHeaderCodes(
                  showCollapseButton(mottaker.resultatPerFagområde),
                  { toggleDetails, showDetails: visDetaljer ? visDetaljer.show : false, mottakerIndex },
                  rangeOfMonths,
                  nesteMåned,
                ).map(heading => (
                  <Table.HeaderCell key={heading.key} scope="col">
                    {heading}
                  </Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {[]
                .concat(
                  ...mottaker.resultatPerFagområde.map((fagOmråde, fagIndex) =>
                    fagOmråde.rader
                      .filter(rad => {
                        const isFeilUtbetalt = rad.feltnavn === avregningCodes.DIFFERANSE;
                        const isRowToggable = rowToggable(fagOmråde, isFeilUtbetalt);
                        return !rowIsHidden(isRowToggable, visDetaljer ? visDetaljer.show : false);
                      })
                      .map((rad, rowIndex) => {
                        const isFeilUtbetalt = rad.feltnavn === avregningCodes.DIFFERANSE;
                        const isRowToggable = rowToggable(fagOmråde, isFeilUtbetalt);
                        const rowClassnames = `${isRowToggable ? styles.rowBorderDashed : styles.rowBorderSolid}`;
                        const boldText = isFeilUtbetalt || ingenPerioderMedAvvik;
                        return (
                          <Table.Row key={`rowIndex${fagIndex + 1}${rowIndex + 1}`} className={rowClassnames}>
                            <Table.DataCell className={boldText ? 'font-bold' : ''}>
                              <FormattedMessage id={`Avregning.${fagOmråde.fagOmrådeKode}.${rad.feltnavn}`} />
                            </Table.DataCell>
                            {createColumns(rad.resultaterPerMåned, rangeOfMonths, nesteMåned, boldText)}
                          </Table.Row>
                        );
                      }),
                  ),
                )
                .concat(
                  getResultatRadene(
                    ingenPerioderMedAvvik,
                    mottaker.resultatPerFagområde,
                    mottaker.resultatOgMotregningRader,
                  ).map((resultat, resultatIndex) => {
                    const boldText = resultat.feltnavn !== avregningCodes.INNTREKKNESTEMÅNED;
                    return (
                      <Table.Row key={`rowIndex${resultatIndex + 1}`} className={styles.rowBorderSolid}>
                        <Table.DataCell className={boldText ? 'font-bold' : ''}>
                          <FormattedMessage id={`Avregning.${resultat.feltnavn}`} />
                        </Table.DataCell>
                        {createColumns(resultat.resultaterPerMåned, rangeOfMonths, nesteMåned, boldText)}
                      </Table.Row>
                    );
                  }),
                )}
            </Table.Body>
          </Table>
        </div>
      );
    })}
  </>
);

export default AvregningTable;
