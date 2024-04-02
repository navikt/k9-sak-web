import mottakerTyper from '@fpsak-frontend/kodeverk/src/mottakerTyper';
import { formatCurrencyNoKr, getRangeOfMonths } from '@fpsak-frontend/utils';
import { Kodeverk, Periode } from '@k9-sak-web/types';
import { BodyShort, Table } from '@navikt/ds-react';
import classnames from 'classnames/bind';
import moment from 'moment/moment';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import CollapseButton from './CollapseButton';
import styles from './avregningTable.module.css';

const classNames = classnames.bind(styles);

export const avregningCodes = {
  DIFFERANSE: 'differanse',
  INNTREKK: 'inntrekk',
  FEILUTBETALING: 'feilutbetaling',
  INNTREKKNESTEMÅNED: 'inntrekkNesteMåned',
  OPPFYLT: 'oppfylt',
  REDUKSJON: 'reduksjon',
};

const isNextPeriod = (month, nextPeriod) =>
  `${month.month}${month.year}` === (nextPeriod ? moment(nextPeriod).format('MMMMYY') : false);
const getHeaderCodes = (showCollapseButton, collapseProps, rangeOfMonths, nextPeriod) => {
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

const showCollapseButton = mottakerResultatPerFag => mottakerResultatPerFag.some(fag => fag.rader.length > 1);

const rowToggable = (fagOmråde, rowIsFeilUtbetalt) => {
  const fagFeilUtbetalt = fagOmråde.rader.find(rad => rad.feltnavn === avregningCodes.DIFFERANSE);
  return fagFeilUtbetalt && !rowIsFeilUtbetalt;
};

const rowIsHidden = (isRowToggable, showDetails) => isRowToggable && !showDetails;

const createColumns = (perioder, rangeOfMonths, nextPeriod) => {
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
        lastColumn: måned.måned
          ? måned.måned === nextPeriodFormatted
          : moment(måned.periode.tom).format('MMMMYY') === nextPeriodFormatted,
      })}
    >
      {formatCurrencyNoKr(måned.beløp)}
    </Table.DataCell>
  ));
};

const tableTitle = mottaker =>
  mottaker.mottakerType.kode === mottakerTyper.ARBG ? (
    <BodyShort
      size="small"
      className={styles.tableTitle}
    >{`${mottaker.mottakerNavn} (${mottaker.mottakerNummer})`}</BodyShort>
  ) : null;

const getResultatRadene = (ingenPerioderMedAvvik, resultatPerFagområde, resultatOgMotregningRader) => {
  if (!ingenPerioderMedAvvik) {
    return resultatOgMotregningRader;
  }
  return resultatPerFagområde.length > 1
    ? resultatOgMotregningRader.filter(resultat => resultat.feltnavn !== avregningCodes.INNTREKKNESTEMÅNED)
    : [];
};

const avvikBruker = (ingenPerioderMedAvvik, mottakerTypeKode) =>
  !!(ingenPerioderMedAvvik && mottakerTypeKode === mottakerTyper.BRUKER);
const getPeriodeFom = (periodeFom, nesteUtbPeriodeFom) => periodeFom || nesteUtbPeriodeFom;
const getPeriod = (ingenPerioderMedAvvik, periodeFom, mottaker) =>
  getRangeOfMonths(
    avvikBruker(ingenPerioderMedAvvik, mottaker.mottakerType.kode)
      ? moment(mottaker.nesteUtbPeriode.tom).subtract(1, 'months')
      : getPeriodeFom(periodeFom, mottaker.nesteUtbPeriode.fom),
    mottaker.nesteUtbPeriode.tom,
  );

interface AvregningTableProps {
  toggleDetails: (id: number) => void;
  showDetails: [{ id: number; show: boolean }];
  simuleringResultat: {
    periode: Periode;
    perioderPerMottaker: [
      {
        resultatOgMotregningRader: object[];
        nesteUtbPeriode: Periode;
        resultatPerFagområde: [{ fagOmrådeKode: Kodeverk; rader: [{ feltnavn: string; resultaterPerMåned: Periode }] }];
      },
    ];
  };
  ingenPerioderMedAvvik: boolean;
}

const AvregningTable = ({
  simuleringResultat,
  toggleDetails,
  showDetails,
  ingenPerioderMedAvvik,
}: AvregningTableProps) =>
  simuleringResultat.perioderPerMottaker.map((mottaker, mottakerIndex) => {
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
                <Table.HeaderCell key={heading} scope="col">
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
                      return (
                        <Table.Row
                          key={`rowIndex${fagIndex + 1}${rowIndex + 1}`}
                          className={isFeilUtbetalt || ingenPerioderMedAvvik ? 'font-bold' : ''}
                        >
                          <Table.DataCell>
                            <FormattedMessage id={`Avregning.${fagOmråde.fagOmrådeKode.kode}.${rad.feltnavn}`} />
                          </Table.DataCell>
                          {createColumns(rad.resultaterPerMåned, rangeOfMonths, nesteMåned)}
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
                ).map((resultat, resultatIndex) => (
                  <Table.Row
                    key={`rowIndex${resultatIndex + 1}`}
                    className={resultat.feltnavn !== avregningCodes.INNTREKKNESTEMÅNED ? 'font-bold' : ''}
                  >
                    <Table.DataCell>
                      <FormattedMessage id={`Avregning.${resultat.feltnavn}`} />
                    </Table.DataCell>
                    {createColumns(resultat.resultaterPerMåned, rangeOfMonths, nesteMåned)}
                  </Table.Row>
                )),
              )}
          </Table.Body>
        </Table>
      </div>
    );
  });

export default AvregningTable;
