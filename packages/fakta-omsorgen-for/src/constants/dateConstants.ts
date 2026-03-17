import dayjs from 'dayjs';

const today = dayjs().utc(true).startOf('day');
export const tomorrow = today.add(1, 'day').startOf('day');
