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
  // eslint-disable-next-line no-restricted-globals
  return d instanceof Date && !isNaN(d.getTime());
}

const DateLabel = ({ dateString }: OwnProps) => {
  const date = new Date(dateString);
  if (!isValidDate(date)) {
    return null;
  }
  const formatedDate = format(zonedTimeToUtc(date, 'Europe/Oslo'), 'dd.MM.yyyy');
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{formatedDate}</>;
};

export default DateLabel;
