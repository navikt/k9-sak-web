import { Table } from '@navikt/ds-react';
import styles from './avregningTable.module.css';
import { createColumns, type RangeOfMonths } from './avregningHelpers';
import { isUngWeb } from '../../../utils/urlUtils';
import type { SimuleringResultatPerFagområdeDto } from '@k9-sak-web/backend/combined/kontrakt/simulering/v1/SimuleringResultatPerFagområdeDto.js';
import type { SimuleringResultatRadDto } from '@k9-sak-web/backend/combined/kontrakt/simulering/v1/SimuleringResultatRadDto.js';
import {
  RadId as avregningCodes,
  type RadId as AvregningRadId,
} from '@k9-sak-web/backend/combined/kodeverk/økonomi/oppdrag/RadId.js';

type ResultatRadId = Extract<AvregningRadId, 'resultatEtterMotregning' | 'inntrekkNesteMåned' | 'resultat'>;

/** Etiketter for resultatrad (feltnavn på resultatOgMotregningRader) */
const RESULTAT_FELT_LABELS: Record<ResultatRadId, string> = {
  [avregningCodes.RESULTAT_ETTER_MOTREGNING]: 'Resultat etter motregning mellom ytelser',
  [avregningCodes.INNTREKK_NESTE_MÅNED]: 'Inntrekk i neste måned',
  [avregningCodes.RESULTAT]: 'Resultat',
};

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
    ? resultatOgMotregningRader.filter(resultat => resultat.feltnavn !== avregningCodes.INNTREKK_NESTE_MÅNED)
    : [];
};

interface ResultatRaderProps {
  ingenPerioderMedAvvik: boolean;
  resultatPerFagområde: SimuleringResultatPerFagområdeDto[];
  resultatOgMotregningRader: SimuleringResultatRadDto[];
  rangeOfMonths: RangeOfMonths[];
  nesteMåned: string;
}

const ResultatRader = ({
  ingenPerioderMedAvvik,
  resultatPerFagområde,
  resultatOgMotregningRader,
  rangeOfMonths,
  nesteMåned,
}: ResultatRaderProps) => {
  const resultater = getResultatRadene(ingenPerioderMedAvvik, resultatPerFagområde, resultatOgMotregningRader);
  const resultaterFiltert = resultater.filter(resultat => {
    if (isUngWeb() && resultat.feltnavn === avregningCodes.INNTREKK_NESTE_MÅNED) {
      return false;
    }
    return true;
  });
  return resultaterFiltert.map((resultat, resultatIndex) => {
    const boldText = resultat.feltnavn !== avregningCodes.INNTREKK_NESTE_MÅNED;
    return (
      <Table.Row key={`rowIndex${resultatIndex + 1}`} className={styles['rowBorderSolid']}>
        <Table.DataCell className={boldText ? 'font-bold' : ''} textSize="small">
          {RESULTAT_FELT_LABELS[resultat.feltnavn as ResultatRadId] ?? resultat.feltnavn}
        </Table.DataCell>
        {createColumns(resultat.resultaterPerMåned ?? [], rangeOfMonths, nesteMåned, boldText)}
      </Table.Row>
    );
  });
};

export default ResultatRader;
