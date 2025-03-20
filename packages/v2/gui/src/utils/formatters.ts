import dayjs from 'dayjs';

export const tilNOK = Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 });

export const stdDato = (input: dayjs.Dayjs | string | Date) => dayjs(input).format('YYYY-MM-DD');

export const visnDato = (input: dayjs.Dayjs | string | Date) => dayjs(input).format('DD.MM.YYYY');
