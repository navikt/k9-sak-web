import {
  k9_oppdrag_kontrakt_kodeverk_MottakerType,
  type k9_oppdrag_kontrakt_simulering_v1_DetaljertSimuleringResultatDto,
  type k9_oppdrag_kontrakt_simulering_v1_SimuleringForMottakerDto,
  type k9_oppdrag_kontrakt_simulering_v1_SimuleringResultatPerFagområdeDto,
  type k9_oppdrag_kontrakt_simulering_v1_SimuleringResultatPerMånedDto,
  type k9_oppdrag_kontrakt_simulering_v1_SimuleringResultatRadDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { getRangeOfMonths } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
import { BodyShort, Table } from '@navikt/ds-react';
import { formatCurrencyNoKr } from '@navikt/ft-utils';
import classnames from 'classnames/bind';
import type { JSX } from 'react';
import { CollapseButton } from './CollapseButton';
import styles from './avregningTable.module.css';

const classNames = classnames.bind(styles);

interface RangeOfMonths {
  month: string;
  year: string;
}

const resultatRadNavn: Record<string, string> = {
  resultatEtterMotregning: 'Resultat etter motregning mellom ytelser',
  inntrekk: 'Inntrekk',
  inntrekkNesteMåned: 'Inntrekk i neste måned',
  resultat: 'Resultat',
  tilbakekreving: 'Feilutbetaling',
  etterbetaling: 'Etterbetaling',
  avregnetBeløp: 'Avregnet beløp',
};

const fagOmrådeNavn: Record<string, string> = {
  REFUTG: 'Engangstønad',
  FP: 'Foreldrepenger',
  FPREF: 'Foreldrepenger',
  SVP: 'Svangerskapspenger',
  SVPREF: 'Svangerskapspenger',
  SP: 'Sykepenger',
  SPREF: 'Sykepenger',
  PB: 'Pleiepenger sykt barn',
  PBREF: 'Pleiepenger sykt barn',
  PN: 'Pleiepenger nærstående',
  PNREF: 'Pleiepenger nærstående',
  OM: 'Omsorgspenger',
  OMREF: 'Omsorgspenger',
  OPP: 'Opplæringspenger',
  OPPREF: 'Opplæringspenger',
  OOP: 'Omsorg, opplæring, og pleiepenger',
  OOPREF: 'Omsorg, opplæring, og pleiepenger',
  FRISINN: 'FRISINN',
  UNG: 'Ungdomsprogramytelse',
};

const feltnavnTekst: Record<string, string> = {
  nyttBeløp: 'nytt beløp',
  tidligereUtbetalt: 'tidligere utbetalt',
  differanse: 'avvik',
};

const getFagområdeFeltnavnDisplayText = (fagOmrådeKode: string, feltnavn: string): string => {
  const fagområde = fagOmrådeNavn[fagOmrådeKode];
  const felt = feltnavnTekst[feltnavn];
  return `${fagområde} ${felt}`;
};

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

const months: Record<string, string> = {
  januar: 'Jan',
  februar: 'Feb',
  mars: 'Mar',
  april: 'Apr',
  mai: 'Mai',
  juni: 'Jun',
  juli: 'Jul',
  august: 'Aug',
  september: 'Sep',
  oktober: 'Okt',
  november: 'Nov',
  desember: 'Des',
};

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
        {months[month.month]} {month.year}
      </span>
    )),
  ];
};

const showCollapseButton = (
  mottakerResultatPerFag: k9_oppdrag_kontrakt_simulering_v1_SimuleringResultatPerFagområdeDto[] | undefined,
) => mottakerResultatPerFag?.some(fag => fag.rader.length > 1) ?? false;

const rowToggable = (
  fagOmråde: k9_oppdrag_kontrakt_simulering_v1_SimuleringResultatPerFagområdeDto,
  rowIsFeilUtbetalt: boolean,
): boolean => {
  const fagFeilUtbetalt = fagOmråde.rader.find(rad => rad.feltnavn === avregningCodes.DIFFERANSE);
  return !!fagFeilUtbetalt && !rowIsFeilUtbetalt;
};

const rowIsHidden = (isRowToggable: boolean, showDetails: boolean) => isRowToggable && !showDetails;

const createColumns = (
  perioder: k9_oppdrag_kontrakt_simulering_v1_SimuleringResultatPerMånedDto[] | undefined,
  rangeOfMonths: RangeOfMonths[],
  nextPeriod: string,
  boldText?: boolean,
) => {
  const nextPeriodFormatted = `${initializeDate(nextPeriod).format('MMMMYY')}`;

  const perioderData = rangeOfMonths.map(month => {
    const periodeExists = perioder?.find(
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

const tableTitle = (mottaker: k9_oppdrag_kontrakt_simulering_v1_SimuleringForMottakerDto) =>
  mottaker.mottakerType === k9_oppdrag_kontrakt_kodeverk_MottakerType.ARBG_ORG ? (
    <BodyShort
      size="small"
      className={styles.tableTitle}
    >{`${mottaker.mottakerNavn} (${mottaker.mottakerNummer})`}</BodyShort>
  ) : null;

const getResultatRadene = (
  ingenPerioderMedAvvik: boolean,
  resultatPerFagområde: k9_oppdrag_kontrakt_simulering_v1_SimuleringResultatPerFagområdeDto[] | undefined,
  resultatOgMotregningRader: k9_oppdrag_kontrakt_simulering_v1_SimuleringResultatRadDto[] | undefined,
) => {
  if (!ingenPerioderMedAvvik) {
    return resultatOgMotregningRader ?? [];
  }
  return resultatPerFagområde && resultatPerFagområde.length > 1 && resultatOgMotregningRader
    ? resultatOgMotregningRader.filter(resultat => resultat.feltnavn !== avregningCodes.INNTREKKNESTEMÅNED)
    : [];
};

const avvikBruker = (ingenPerioderMedAvvik: boolean, mottakerTypeKode: string) =>
  !!(ingenPerioderMedAvvik && mottakerTypeKode === k9_oppdrag_kontrakt_kodeverk_MottakerType.BRUKER);
const getPeriodeFom = (periodeFom: string, nesteUtbPeriodeFom: string) => periodeFom || nesteUtbPeriodeFom;

const getPeriod = (
  ingenPerioderMedAvvik: boolean,
  periodeFom: string,
  mottaker: k9_oppdrag_kontrakt_simulering_v1_SimuleringForMottakerDto,
) =>
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
  simuleringResultat: k9_oppdrag_kontrakt_simulering_v1_DetaljertSimuleringResultatDto;
  ingenPerioderMedAvvik: boolean;
  isUngFagsak: boolean;
}

export const AvregningTable = ({
  simuleringResultat,
  toggleDetails,
  showDetails,
  ingenPerioderMedAvvik,
  isUngFagsak,
}: AvregningTableProps) => (
  <>
    {simuleringResultat.perioderPerMottaker?.map((mottaker, mottakerIndex) => {
      const rangeOfMonths = getPeriod(
        ingenPerioderMedAvvik,
        simuleringResultat.periode?.fom ?? '', // Provide a fallback empty string
        mottaker,
      );
      const nesteMåned: string = mottaker.nesteUtbPeriode?.tom ?? '';
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
              {([] as Array<JSX.Element>)
                .concat(
                  ...(mottaker.resultatPerFagområde?.map((fagOmråde, fagIndex) =>
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
                        const displayText = getFagområdeFeltnavnDisplayText(fagOmråde.fagOmrådeKode, rad.feltnavn);

                        return (
                          <Table.Row key={`rowIndex${fagIndex + 1}${rowIndex + 1}`} className={rowClassnames}>
                            <Table.DataCell className={boldText ? 'font-bold' : ''} textSize="small">
                              {displayText}
                            </Table.DataCell>
                            {createColumns(rad.resultaterPerMåned, rangeOfMonths, nesteMåned, boldText)}
                          </Table.Row>
                        );
                      }),
                  ) ?? []),
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
                            {resultatRadNavn[resultat.feltnavn]}
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
