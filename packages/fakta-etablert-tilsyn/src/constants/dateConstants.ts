import dayjs from 'dayjs';

export const today = dayjs().utc(true).startOf('day');
export const tomorrow = today.add(1, 'day').startOf('day');

export default {
  today,
  tomorrow,
};
