interface OwnProps {
  dateStringFom: string;
  dateStringTom?: string;
  showTodayString?: boolean;
}

const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Intl.DateTimeFormat('nb-NO', options).format(date);
};

/**
 * PeriodLabel
 *
 * Presentasjonskomponent. Formaterer til og fra dato til en periode på formatet dd.mm.yyyy - dd.mm.yyyy.
 *
 * Eksempel:
 * ```html
 * <PeriodLabel dateStringFom="2017-08-25" dateStringTom="2017-08-31" />
 * ```
 */
const PeriodLabel = ({ dateStringFom, dateStringTom, showTodayString = false }: OwnProps) => (
  <span>
    {formatDate(new Date(dateStringFom))}
    {dateStringTom && (
      <>
        {' - '}
        {formatDate(new Date(dateStringTom))}
      </>
    )}
    {showTodayString && !dateStringTom && <span>d.d.</span>}
  </span>
);

export default PeriodLabel;
