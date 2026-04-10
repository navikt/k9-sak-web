import { Tooltip } from '@navikt/ds-react';
import {
  ung_sak_kontrakt_aktivitetspenger_beregning_AktivitetspengerSatsType as AktivitetspengerSatsTypeEnum,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import styles from './aktivitetspengerSatsOgUtbetaling.module.css';

export const formatSats = (satstype: typeof AktivitetspengerSatsTypeEnum[keyof typeof AktivitetspengerSatsTypeEnum]) => {
  let icon: React.ReactElement | undefined = undefined;
  let tooltipTekst = '';
  if (satstype === AktivitetspengerSatsTypeEnum.LAV) {
    icon = (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="5" cy="5" r="5" fill="#417DA0" />
      </svg>
    );
    tooltipTekst = 'Lav sats (under 25 år)';
  } else if (satstype === AktivitetspengerSatsTypeEnum.HØY) {
    icon = (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="5" cy="5" r="5" fill="#B65781" />
      </svg>
    );
    tooltipTekst = 'Høy sats (over 25 år)';
  } else if (satstype === AktivitetspengerSatsTypeEnum.BEREGNINGSGRUNNLAG) {
    icon = (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="5" cy="5" r="5" fill="#66A3C4" />
      </svg>
    );
    tooltipTekst = 'Sats basert på beregningsgrunnlag';
  }
  return (
    <span className={styles['sats']}>
      {satstype} {icon && <Tooltip content={tooltipTekst}>{icon}</Tooltip>}
    </span>
  );
};

export const formatMonthYear = (dateStr: string): string => {
  const date = new Date(`${dateStr}-01T00:00:00`);
  const formatted = new Intl.DateTimeFormat('nb-NO', {
    month: 'long',
    year: 'numeric',
  }).format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};
