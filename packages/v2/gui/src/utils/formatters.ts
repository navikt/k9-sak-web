import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export const tilNOK = Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 });

export const stdDato = (input: dayjs.Dayjs | string | Date) => dayjs(input).format('YYYY-MM-DD');

export const visnDato = (input: dayjs.Dayjs | string | Date) => dayjs(input).format('DD.MM.YYYY');

export const formatCurrencyWithKr = (value: string | number) => {
  const roundedValue = Math.round(Number(value));
  if (Number.isNaN(roundedValue)) {
    return undefined;
  }
  const formattedValue = roundedValue.toLocaleString('nb-NO').replace(/,|\s/g, ' ');
  return `${formattedValue} kr`;
};

export const formatCurrencyWithoutKr = (value: number) => {
  if (value === null || value === undefined) {
    return undefined;
  }
  const newVal = value.toString().replace(/\s/g, '');
  if (Number.isNaN(Number(newVal))) {
    return undefined;
  }
  return Math.round(+newVal).toLocaleString('nb-NO').replace(/,|\s/g, ' ');
};

export const beregnDagerTimer = (dur: string): number => Math.round(dayjs.duration(dur).asHours() * 100) / 100;

export const formatFødselsdato = (fnrOrDate?: string): string => {
  if (!fnrOrDate) return '';
  // If input is a date string (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}$/.test(fnrOrDate)) {
    const date = dayjs(fnrOrDate, 'YYYY-MM-DD', true);
    return date.isValid() ? date.format('DD.MM.YY') : '';
  }
  // If input is a fødselsnummer
  if (/^\d{6}/.test(fnrOrDate)) {
    const date = dayjs(fnrOrDate.slice(0, 6), 'DDMMYY', true);
    return date.isValid() ? date.format('DD.MM.YY') : '';
  }
  return '';
};
