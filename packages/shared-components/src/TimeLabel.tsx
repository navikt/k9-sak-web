import React from 'react';

interface OwnProps {
  dateTimeString: string;
}

/**
 * TimeLabel
 *
 * Presentasjonskomponent. Formaterer tidspunkt til formatet hh:mm:ss.
 *
 * Eksempel:
 * ```html
 * <DateTimeLabel dateTimeString="2017-08-02T00:54:25.455" />
 * ```
 */
const TimeLabel = ({ dateTimeString }: OwnProps) => (
  <FormattedTime value={new Date(dateTimeString)} hour="numeric" minute="numeric" second="numeric" />
);

export default TimeLabel;
