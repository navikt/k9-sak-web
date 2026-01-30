import mottakerTyper from '@fpsak-frontend/kodeverk/src/mottakerTyper';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import { getRangeOfMonths } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
import { Kodeverk, Periode, SimuleringMottaker, SimuleringResultatRad } from '@k9-sak-web/types';
import { BodyShort, Table } from '@navikt/ds-react';
import classnames from 'classnames/bind';
import { JSX } from 'react';
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
  `${month.month}${month.year}` === (nextPeriod ? initializeDate(nextPeriod).format('MMMMYY') : false);

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

const rowToggable = (fagOmråde: ResultatPerFagområde, rowIsFeilUtbetalt: boolean): boolean => {
  const fagFeilUtbetalt = fagOmråde.rader.find(rad => rad.feltnavn === avregningCodes.DIFFERANSE);
  return !!fagFeilUtbetalt && !rowIsFeilUtbetalt;
};

const rowIsHidden = (isRowToggable: boolean, showDetails: boolean) => isRowToggable && !showDetails;

const createColumns = (
  perioder: SimuleringResultatRad['resultaterPerMåned'],
  rangeOfMonths: RangeOfMonths[],
  nextPeriod: string,
  boldText?: boolean,
) => {
  const nextPeriodFormatted = `${initializeDate(nextPeriod).format('MMMMYY')}`;

  const perioderData = rangeOfMonths.map(month => {
    const periodeExists = perioder.find(
      periode =>
        initializeDate(periode.periode.tom).format('MMMMYY').toLowerCase() ===
        `${month.month}${month.year}`.toLowerCase(),
    );
    return periodeExists || { måned: `${month.month}${month.year}`, beløp: null };
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
      {formatCurrencyNoKr(måned.beløp ?? 0)}
    </Table.DataCell>
  ));
};

const tableTitle = (mottaker: SimuleringMottaker) =>
  mottaker.mottakerType.kode === mottakerTyper.ARBG ? (
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
    avvikBruker(ingenPerioderMedAvvik, mottaker.mottakerType.kode)
      ? initializeDate(mottaker.nesteUtbPeriode.tom ?? '')
          .subtract(1, 'months')
          .format('YYYY-MM')
      : getPeriodeFom(periodeFom, mottaker.nesteUtbPeriode.fom ?? ''),
    mottaker.nesteUtbPeriode.tom ?? '',
  );

interface ResultatPerFagområde {
  fagOmrådeKode: Kodeverk | string;
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
  isUngFagsak: boolean;
}

const AvregningTable = ({
  simuleringResultat,
  toggleDetails,
  showDetails,
  ingenPerioderMedAvvik,
  isUngFagsak,
}: AvregningTableProps) => (
  <>
    {simuleringResultat.perioderPerMottaker.map((mottaker, mottakerIndex) => {
      const rangeOfMonths = getPeriod(
        ingenPerioderMedAvvik,
        simuleringResultat.periode?.fom ?? '', // Provide a fallback empty string
        mottaker,
      );
      const nesteMåned: string = mottaker.nesteUtbPeriode.tom ?? '';
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
                  <Table.HeaderCell key={heading.key} scope="col" textSize="small">
                    {heading}
                  </Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {([] as JSX.Element[])
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
                        const fagområdeKode =
                          typeof fagOmråde.fagOmrådeKode === 'string'
                            ? fagOmråde.fagOmrådeKode
                            : fagOmråde.fagOmrådeKode.kode;
                        return (
                          <Table.Row key={`rowIndex${fagIndex + 1}${rowIndex + 1}`} className={rowClassnames}>
                            <Table.DataCell className={boldText ? 'font-bold' : ''} textSize="small">
                              <FormattedMessage id={`Avregning.${fagområdeKode}.${rad.feltnavn}`} />
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
                  )
                    .filter(resultat => {
                      if (
                        isUngFagsak &&
                        (resultat.feltnavn === avregningCodes.INNTREKKNESTEMÅNED ||
                          resultat.feltnavn === avregningCodes.INNTREKK)
                      ) {
                        return false;
                      }
                      return true;
                    })
                    .map((resultat, resultatIndex) => {
                      const boldText = resultat.feltnavn !== avregningCodes.INNTREKKNESTEMÅNED;
                      return (
                        <Table.Row key={`rowIndex${resultatIndex + 1}`} className={styles.rowBorderSolid}>
                          <Table.DataCell className={boldText ? 'font-bold' : ''} textSize="small">
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
