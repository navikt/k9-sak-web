import React from 'react';
import { FormattedMessage, FormattedDate, FormattedTime } from 'react-intl';

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
      <FormattedDate day="2-digit" month="2-digit" year="numeric" value={date} />
      {!useNewFormat && (
        <>
          -<span>{`${hours}:${minutes}`}</span>
        </>
      )}
      {useNewFormat && (
        <>
          <FormattedMessage id="DateTimeLabel.Kl" />
          <FormattedTime value={date} hour="numeric" minute="numeric" second="numeric" />
        </>
      )}
    </>
  );
};

export default DateTimeLabel;
