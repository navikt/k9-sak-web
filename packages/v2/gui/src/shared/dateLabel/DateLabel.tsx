import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

interface OwnProps {
  dateString: string;
}

/**
 * DateLabel
 *
 * Presentasjonskomponent. Formaterer dato på formatet dd.mm.yyyy.
 *
 * Eksempel:
 * ```html
 * <DateLabel dateString="2017-08-31" />
 * ```
 *
 * Lagt til med date-fns og time zone. grunnet ulik output i tester lokalt og på github.
 *
 * Tidligere implementasjon:
 * <FormattedDate day="2-digit" month="2-digit" year="numeric" value={date} />
 *
 */

function isValidDate(d: Date) {
  return d instanceof Date && !Number.isNaN(d.getTime());
}

const DateLabel = ({ dateString }: OwnProps) => {
  const date = new Date(dateString);
  if (!isValidDate(date)) {
    return null;
  }
  const formatedDate = dayjs.tz(date, 'Europe/Oslo').format('DD.MM.YYYY');
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{formatedDate}</>;
};

export default DateLabel;
