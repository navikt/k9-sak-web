import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';

interface OwnProps {
  dateTimeString: string;
  useNewFormat?: boolean;
}

/**
 * DateTimeLabel
 *
 * Presentasjonskomponent. Formaterer dato til formatet dd.mm.yyyy - hh:mm.
 *
 * Eksempel:
 * ```html
 * <DateTimeLabel dateTimeString="2017-08-02T00:54:25.455" />
 * ```
 */
const DateTimeLabel = ({ dateTimeString, useNewFormat = false }: OwnProps) => {
  const date = new Date(dateTimeString);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const dateAsDayjs = initializeDate(date, '', false, true);
  return (
    <>
      {dateAsDayjs.format('DD.MM.YYYY')}
      {!useNewFormat && ` - ${hours}:${minutes}`}
      {useNewFormat && ` Kl.${dateAsDayjs.format('HH:mm:ss')}`}
    </>
  );
};

export default DateTimeLabel;
