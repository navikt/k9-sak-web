import { format } from 'date-fns';

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
  return (
    <>
      {format(date, 'dd.MM.yyyy')}
      {!useNewFormat && ` - ${hours}:${minutes}`}
      {useNewFormat && ` Kl.${format(date, 'HH:mm:ss')}`}
    </>
  );
};

export default DateTimeLabel;
