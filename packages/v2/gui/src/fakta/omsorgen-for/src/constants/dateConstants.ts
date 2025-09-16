import dayjs from 'dayjs';

export const today = dayjs().utc(true).startOf('day');
