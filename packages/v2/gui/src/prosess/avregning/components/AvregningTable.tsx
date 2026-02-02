import mottakerTyper from '@fpsak-frontend/kodeverk/src/mottakerTyper';
import { getRangeOfMonths } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
import { BodyShort, Button, Table } from '@navikt/ds-react';
import classnames from 'classnames/bind';
import { FormattedMessage } from 'react-intl';
import styles from './avregningTable.module.css';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { formatCurrencyWithoutKr } from '@k9-sak-web/gui/utils/formatters.js';
import { isUngWeb } from '../../../utils/urlUtils';
import type { DetaljertSimuleringResultatDto } from '@k9-sak-web/backend/k9oppdrag/kontrakt/simulering/v1/DetaljertSimuleringResultatDto.js';
import type { SimuleringForMottakerDto } from '@k9-sak-web/backend/k9oppdrag/kontrakt/simulering/v1/SimuleringForMottakerDto.js';
import type { SimuleringResultatPerFagområdeDto } from '@k9-sak-web/backend/k9oppdrag/kontrakt/simulering/v1/SimuleringResultatPerFagområdeDto.js';
import type { SimuleringResultatRadDto } from '@k9-sak-web/backend/k9oppdrag/kontrakt/simulering/v1/SimuleringResultatRadDto.js';
import type { SimuleringResultatPerMånedDto } from '@k9-sak-web/backend/k9oppdrag/kontrakt/simulering/v1/SimuleringResultatPerMånedDto.js';
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
    <Button
      size="small"
      type="button"
      className="-ml-3 -mt-1"
      onClick={() => collapseProps.toggleDetails(collapseProps.mottakerIndex)}
      icon={collapseProps.showDetails ? <ChevronUpIcon title="Ekspandert" /> : <ChevronDownIcon title="Lukket" />}
      iconPosition="right"
      variant="tertiary"
    >
      {collapseProps.showDetails ? 'Vis færre detaljer' : 'Vis flere detaljer'}
    </Button>
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

const showCollapseButton = (mottakerResultatPerFag: SimuleringResultatPerFagområdeDto[]) =>
  mottakerResultatPerFag.some(fag => fag.rader.length > 1);

const rowToggable = (fagOmråde: SimuleringResultatPerFagområdeDto, rowIsFeilUtbetalt: boolean): boolean => {
  const fagFeilUtbetalt = fagOmråde.rader.find(rad => rad.feltnavn === avregningCodes.DIFFERANSE);
  return !!fagFeilUtbetalt && !rowIsFeilUtbetalt;
};

const rowIsHidden = (isRowToggable: boolean, showDetails: boolean) => isRowToggable && !showDetails;

const createColumns = (
  perioder: SimuleringResultatPerMånedDto[],
  rangeOfMonths: RangeOfMonths[],
  nextPeriod: string,
  boldText?: boolean,
) => {
  const nextPeriodFormatted = `${initializeDate(nextPeriod).format('MMMMYY')}`;

  // denne ser rar ut
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
      {formatCurrencyWithoutKr(måned.beløp ?? 0)}
    </Table.DataCell>
  ));
};

const tableTitle = (mottaker: SimuleringForMottakerDto) =>
  mottaker.mottakerType === mottakerTyper.ARBG ? (
    <BodyShort
      size="small"
      className={styles['tableTitle']}
    >{`${mottaker.mottakerNavn} (${mottaker.mottakerNummer})`}</BodyShort>
  ) : null;

const getResultatRadene = (
  ingenPerioderMedAvvik?: boolean,
  resultatPerFagområde?: SimuleringResultatPerFagområdeDto[],
  resultatOgMotregningRader?: SimuleringResultatRadDto[],
) => {
  if (!resultatPerFagområde || !resultatOgMotregningRader) {
    return [];
  }
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

const getPeriod = (ingenPerioderMedAvvik: boolean, periodeFom: string, mottaker: SimuleringForMottakerDto) =>
  getRangeOfMonths(
    avvikBruker(ingenPerioderMedAvvik, mottaker.mottakerType)
      ? initializeDate(mottaker.nesteUtbPeriode?.tom ?? '')
          .subtract(1, 'months')
          .format('YYYY-MM')
      : getPeriodeFom(periodeFom, mottaker.nesteUtbPeriode?.fom ?? ''),
    mottaker.nesteUtbPeriode?.tom ?? '',
  );

interface AvregningTableProps {
  toggleDetails: (id: number) => void;
  showDetails: { id: number; show: boolean }[];
  simuleringResultat: DetaljertSimuleringResultatDto;
}

const AvregningTable = ({ simuleringResultat, toggleDetails, showDetails }: AvregningTableProps) => {
  const isUngFagsak = isUngWeb();
  return (
    <>
      {simuleringResultat.perioderPerMottaker?.map((mottaker: SimuleringForMottakerDto, mottakerIndex) => {
        const rangeOfMonths = getPeriod(
          simuleringResultat.ingenPerioderMedAvvik ?? false,
          simuleringResultat.periode?.fom ?? '', // Provide a fallback empty string
          mottaker,
        );
        const nesteMåned: string = mottaker.nesteUtbPeriode?.tom ?? '';
        const visDetaljer = showDetails.find(d => d.id === mottakerIndex);
        return (
          <div className={styles['tableWrapper']} key={`tableIndex${mottakerIndex + 1}`}>
            {tableTitle(mottaker)}
            <Table key={`tableIndex${mottakerIndex + 1}`} className={styles['simuleringTable']}>
              <Table.Header>
                <Table.Row>
                  {getHeaderCodes(
                    showCollapseButton(mottaker.resultatPerFagområde ?? []),
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
                {([] as React.ReactNode[])
                  .concat(
                    ...(mottaker.resultatPerFagområde ?? []).map((fagOmråde, fagIndex) =>
                      fagOmråde.rader
                        .filter(rad => {
                          const isFeilUtbetalt = rad.feltnavn === avregningCodes.DIFFERANSE;
                          const isRowToggable = rowToggable(fagOmråde, isFeilUtbetalt);
                          return !rowIsHidden(isRowToggable, visDetaljer ? visDetaljer.show : false);
                        })
                        .map((rad, rowIndex) => {
                          const isFeilUtbetalt = rad.feltnavn === avregningCodes.DIFFERANSE;
                          const isRowToggable = rowToggable(fagOmråde, isFeilUtbetalt);
                          const boldText = isFeilUtbetalt || simuleringResultat.ingenPerioderMedAvvik;
                          const fagområdeKode =
                            typeof fagOmråde.fagOmrådeKode === 'string'
                              ? fagOmråde.fagOmrådeKode
                              : fagOmråde.fagOmrådeKode;
                          return (
                            <Table.Row
                              key={`rowIndex${fagIndex + 1}${rowIndex + 1}`}
                              className={isRowToggable ? styles['rowBorderDashed'] : styles['rowBorderSolid']}
                            >
                              <Table.DataCell className={boldText ? 'font-bold' : ''} textSize="small">
                                <FormattedMessage id={`Avregning.${fagområdeKode}.${rad.feltnavn}`} />
                              </Table.DataCell>
                              {createColumns(rad.resultaterPerMåned ?? [], rangeOfMonths, nesteMåned, boldText)}
                            </Table.Row>
                          );
                        }),
                    ),
                  )
                  .concat(
                    getResultatRadene(
                      simuleringResultat.ingenPerioderMedAvvik ?? false,
                      mottaker.resultatPerFagområde ?? [],
                      mottaker.resultatOgMotregningRader ?? [],
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
                          <Table.Row key={`rowIndex${resultatIndex + 1}`} className={styles['rowBorderSolid']}>
                            <Table.DataCell className={boldText ? 'font-bold' : ''} textSize="small">
                              <FormattedMessage id={`Avregning.${resultat.feltnavn}`} />
                            </Table.DataCell>
                            {createColumns(resultat.resultaterPerMåned ?? [], rangeOfMonths, nesteMåned, boldText)}
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
};

export default AvregningTable;
