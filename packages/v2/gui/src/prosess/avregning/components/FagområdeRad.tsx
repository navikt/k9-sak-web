import { Table } from '@navikt/ds-react';
import styles from './avregningTable.module.css';
import { createColumns, type RangeOfMonths } from './avregningHelpers';
import {
  RadId as avregningCodes,
  RadId,
  type RadId as AvregningRadId,
} from '@k9-sak-web/backend/combined/kodeverk/økonomi/oppdrag/RadId.js';
import { FagOmrådeKode } from '@k9-sak-web/backend/k9sak/kodeverk/økonomi/oppdrag/FagOmrådeKode.js';
import type { DetaljertSimuleringResultatDto } from '@k9-sak-web/backend/combined/kontrakt/simulering/v1/DetaljertSimuleringResultatDto.js';
import type { SimuleringResultatPerFagområdeDto } from '@k9-sak-web/backend/combined/kontrakt/simulering/v1/SimuleringResultatPerFagområdeDto.js';

/** Fagområdenavn brukt i etiketter for simulering */
const FAGOMRÅDE_NAVN: Partial<Record<FagOmrådeKode, string>> = {
  [FagOmrådeKode.ENGANGSSTØNAD]: 'Engangstønad',
  [FagOmrådeKode.FORELDREPENGER]: 'Foreldrepenger',
  [FagOmrådeKode.FORELDREPENGER_ARBEIDSGIVER]: 'Foreldrepenger',
  [FagOmrådeKode.SVANGERSKAPSPENGER]: 'Svangerskapspenger',
  [FagOmrådeKode.SVANGERSKAPSPENGER_ARBEIDSGIVER]: 'Svangerskapspenger',
  [FagOmrådeKode.SYKEPENGER]: 'Sykepenger',
  [FagOmrådeKode.SYKEPENGER_ARBEIDSGIVER]: 'Sykepenger',
  [FagOmrådeKode.PLEIEPENGER_SYKT_BARN]: 'Pleiepenger sykt barn',
  [FagOmrådeKode.PLEIEPENGER_SYKT_BARN_ARBEIDSGIVER]: 'Pleiepenger sykt barn',
  [FagOmrådeKode.PLEIEPENGER_NÆRSTÅENDE]: 'Pleiepenger nærstående',
  [FagOmrådeKode.PLEIEPENGER_NÆRSTÅENDE_ARBEIDSGIVER]: 'Pleiepenger nærstående',
  [FagOmrådeKode.OMSORGSPENGER]: 'Omsorgspenger',
  [FagOmrådeKode.OMSORGSPENGER_ARBEIDSGIVER]: 'Omsorgspenger',
  [FagOmrådeKode.OPPLÆRINGSPENGER]: 'Opplæringspenger',
  [FagOmrådeKode.OPPLÆRINGSPENGER_ARBEIDSGIVER]: 'Opplæringspenger',
  [FagOmrådeKode.PLEIEPENGER_V1]: 'Omsorg, opplæring, og pleiepenger',
  [FagOmrådeKode.PLEIEPENGER_V1_ARBEIDSGIVER]: 'Omsorg, opplæring, og pleiepenger',
  [FagOmrådeKode.FRISINN]: 'FRISINN',
  [FagOmrådeKode.UNG]: 'Ungdomsprogramytelse',
};

/** Suffiks per feltnavn (differanse har unntak for OOPREF og FRISINN) */
const FELT_SUFFIX: Partial<Record<AvregningRadId, string>> = {
  [avregningCodes.NYTT_BELØP]: 'nytt beløp',
  [avregningCodes.TIDLIGERE_UTBETALT]: 'tidligere utbetalt',
  [avregningCodes.DIFFERANSE]: 'avvik',
};

const FAGOMRÅDE_DIFFERANSE_NÆRSTÅENDE = new Set<FagOmrådeKode>([
  FagOmrådeKode.PLEIEPENGER_V1_ARBEIDSGIVER,
  FagOmrådeKode.FRISINN,
]);

const getFagområdeFeltLabel = (fagKode: FagOmrådeKode, feltnavn: RadId): string => {
  const fagNavn = FAGOMRÅDE_NAVN[fagKode];
  if (!fagNavn) return feltnavn;
  const suffix =
    feltnavn === avregningCodes.DIFFERANSE && FAGOMRÅDE_DIFFERANSE_NÆRSTÅENDE.has(fagKode)
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
