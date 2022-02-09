import React from 'react';
import { FormattedDate } from 'react-intl';

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
 */

function isValidDate(d) {
  return d instanceof Date && !Number.isNaN(d.getTime());
}

const DateLabel = ({ dateString }: OwnProps) => {
  const date = new Date(dateString);
  if (!isValidDate(date)) {
    return null;
  }
  return <FormattedDate day="2-digit" month="2-digit" year="numeric" value={date} />;
};

export default DateLabel;
