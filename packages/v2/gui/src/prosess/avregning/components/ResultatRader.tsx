import { Table } from '@navikt/ds-react';
import styles from './avregningTable.module.css';
import { avregningCodes, createColumns, type RangeOfMonths } from './avregningHelpers';
import { isUngWeb } from '../../../utils/urlUtils';
import type { SimuleringResultatPerFagområdeDto } from '@k9-sak-web/backend/k9oppdrag/kontrakt/simulering/v1/SimuleringResultatPerFagområdeDto.js';
import type { SimuleringResultatRadDto } from '@k9-sak-web/backend/k9oppdrag/kontrakt/simulering/v1/SimuleringResultatRadDto.js';

/** Etiketter for resultatrad (feltnavn på resultatOgMotregningRader) */
const RESULTAT_FELT_LABELS: Record<string, string> = {
  inntrekk: 'Inntrekk',
  inntrekkNesteMåned: 'Inntrekk i neste måned',
  resultatEtterMotregning: 'Resultat etter motregning mellom ytelser',
  resultat: 'Resultat',
  avregnetBeløp: 'Avregnet beløp',
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
    ? resultatOgMotregningRader.filter(resultat => resultat.feltnavn !== avregningCodes.INNTREKKNESTEMÅNED)
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
    if (
      isUngWeb() &&
      (resultat.feltnavn === avregningCodes.INNTREKKNESTEMÅNED || resultat.feltnavn === avregningCodes.INNTREKK)
    ) {
      return false;
    }
    return true;
  });
  return resultaterFiltert.map((resultat, resultatIndex) => {
    const boldText = resultat.feltnavn !== avregningCodes.INNTREKKNESTEMÅNED;
    return (
      <Table.Row key={`rowIndex${resultatIndex + 1}`} className={styles['rowBorderSolid']}>
        <Table.DataCell className={boldText ? 'font-bold' : ''} textSize="small">
          {RESULTAT_FELT_LABELS[resultat.feltnavn] ?? resultat.feltnavn}
        </Table.DataCell>
        {createColumns(resultat.resultaterPerMåned ?? [], rangeOfMonths, nesteMåned, boldText)}
      </Table.Row>
    );
  });
};

export default ResultatRader;
