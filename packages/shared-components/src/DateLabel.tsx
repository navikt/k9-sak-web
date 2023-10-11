import { format } from 'date-fns';
import zonedTimeToUtc from 'date-fns-tz/zonedTimeToUtc';
import React from 'react';

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

function isValidDate(d) {
  return d instanceof Date && !Number.isNaN(d.getTime());
}

const DateLabel = ({ dateString }: OwnProps) => {
  const date = format(new Date(dateString), 'dd.MM.yyyy');
  if (!isValidDate(date)) {
    return null;
  }
  console.log(zonedTimeToUtc(date, 'Europe/Oslo'));
  const formatedDate = format(zonedTimeToUtc(date, 'Europe/Oslo'), 'dd.MM.yyyy');
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{formatedDate}</>;
};

export default DateLabel;
