import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export const beregnDagerTimer = (dur: string): number => Math.round(dayjs.duration(dur).asHours() * 100) / 100;
