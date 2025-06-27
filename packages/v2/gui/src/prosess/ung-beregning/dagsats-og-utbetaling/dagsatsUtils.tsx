import { UngdomsytelseSatsPeriodeDtoSatsType } from '@k9-sak-web/backend/ungsak/generated';
import { Tooltip } from '@navikt/ds-react';
import styles from './dagsatsOgUtbetaling.module.css';

export const formatSats = (satstype: UngdomsytelseSatsPeriodeDtoSatsType) => {
  let icon: React.ReactElement | undefined = undefined;
  let tooltipTekst = '';
  if (satstype === UngdomsytelseSatsPeriodeDtoSatsType.LAV) {
    icon = (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="5" cy="5" r="5" fill="#417DA0" />
      </svg>
    );
    tooltipTekst = 'Når deltaker er under 25 år, ganger vi grunnbeløpet med 2/3 av 2,041.';
  } else if (satstype === UngdomsytelseSatsPeriodeDtoSatsType.HØY) {
    icon = (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="5" cy="5" r="5" fill="#B65781" />
      </svg>
    );
    tooltipTekst = 'Når deltaker er over 25 år, ganger vi grunnbeløpet med 2,056.';
  }
  return (
    <span className={styles.sats}>
      {satstype} {icon && <Tooltip content={tooltipTekst}>{icon}</Tooltip>}
    </span>
  );
};

export const formatMonthYear = (dateStr: string): string => {
  const date = new Date(`${dateStr}-01T00:00:00`);

  // Format using Norwegian locale
  const formatted = new Intl.DateTimeFormat('nb-NO', {
    month: 'long',
    year: 'numeric',
  }).format(date);

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};
