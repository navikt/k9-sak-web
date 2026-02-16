import { Table } from '@navikt/ds-react';
import styles from './avregningTable.module.css';
import { createColumns, type RangeOfMonths } from './avregningHelpers';
import { RadId as avregningCodes } from '@k9-sak-web/backend/k9sak/kodeverk/økonomi/oppdrag/RadId.js';
import type { DetaljertSimuleringResultatDto } from '@k9-sak-web/backend/k9oppdrag/kontrakt/simulering/v1/DetaljertSimuleringResultatDto.js';
import type { SimuleringResultatPerFagområdeDto } from '@k9-sak-web/backend/k9oppdrag/kontrakt/simulering/v1/SimuleringResultatPerFagområdeDto.js';

/** Fagområdenavn brukt i etiketter for simulering */
const FAGOMRÅDE_NAVN: Record<string, string> = {
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

/** Suffiks per feltnavn (differanse har unntak for OOPREF og FRISINN) */
const FELT_SUFFIX: Record<string, string> = {
  nyttBeløp: 'nytt beløp',
  tidligereUtbetalt: 'tidligere utbetalt',
  differanse: 'avvik',
};

const FAGOMRÅDE_DIFFERANSE_NÆRSTÅENDE = new Set(['OOPREF', 'FRISINN']);

const getFagområdeFeltLabel = (fagKode: string, feltnavn: string): string => {
  const fagNavn = FAGOMRÅDE_NAVN[fagKode];
  if (!fagNavn) return feltnavn;
  const suffix =
    feltnavn === 'differanse' && FAGOMRÅDE_DIFFERANSE_NÆRSTÅENDE.has(fagKode)
      ? 'nærstående avvik'
      : FELT_SUFFIX[feltnavn];
  if (!suffix) return feltnavn;
  return `${fagNavn} ${suffix}`;
};

const rowToggable = (fagOmråde: SimuleringResultatPerFagområdeDto, rowIsFeilUtbetalt: boolean): boolean => {
  const fagFeilUtbetalt = fagOmråde.rader.find(rad => rad.feltnavn === avregningCodes.DIFFERANSE);
  return !!fagFeilUtbetalt && !rowIsFeilUtbetalt;
};

const rowIsHidden = (isRowToggable: boolean, showDetails: boolean) => isRowToggable && !showDetails;

interface FagområdeRaderProps {
  fagOmråde: SimuleringResultatPerFagområdeDto;
  fagIndex: number;
  visDetaljer: { id: number; show: boolean };
  simuleringResultat: DetaljertSimuleringResultatDto;
  rangeOfMonths: RangeOfMonths[];
  nesteMåned: string;
}

const FagområdeRad = ({
  fagOmråde,
  fagIndex,
  visDetaljer,
  simuleringResultat,
  rangeOfMonths,
  nesteMåned,
}: FagområdeRaderProps) => {
  const raderSomSkalVises = fagOmråde.rader.filter(rad => {
    const isFeilUtbetalt = rad.feltnavn === avregningCodes.DIFFERANSE;
    const isRowToggable = rowToggable(fagOmråde, isFeilUtbetalt);
    return !rowIsHidden(isRowToggable, visDetaljer ? visDetaljer.show : false);
  });

  return raderSomSkalVises.map((rad, rowIndex) => {
    const isFeilUtbetalt = rad.feltnavn === avregningCodes.DIFFERANSE;
    const isRowToggable = rowToggable(fagOmråde, isFeilUtbetalt);
    const boldText = isFeilUtbetalt || simuleringResultat.ingenPerioderMedAvvik;
    return (
      <Table.Row
        key={`rowIndex${fagIndex + 1}${rowIndex + 1}`}
        className={isRowToggable ? styles['rowBorderDashed'] : styles['rowBorderSolid']}
      >
        <Table.DataCell className={boldText ? 'font-bold' : ''} textSize="small">
          {getFagområdeFeltLabel(fagOmråde?.fagOmrådeKode, rad.feltnavn) || rad.feltnavn}
        </Table.DataCell>
        {createColumns(rad.resultaterPerMåned ?? [], rangeOfMonths, nesteMåned, boldText)}
      </Table.Row>
    );
  });
};

export default FagområdeRad;
