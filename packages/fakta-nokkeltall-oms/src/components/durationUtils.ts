import moment from 'moment';

export interface DagerTimer {
  dager: number;
  timer?: number;
}

const formaterTimerDesimal = (timerDesimal: number): number => Number.parseFloat(timerDesimal.toFixed(2));

export const konverterDesimalTilDagerOgTimer = (desimal: number): DagerTimer => {
  const dager = Math.floor(desimal);
  const timerDesimal = desimal % 1;

  return {
    dager,
    timer: timerDesimal !== 0 ? formaterTimerDesimal(timerDesimal * 7.5) : null,
  };
};

export const beregnDagerTimer = (dagerTimer: string): DagerTimer => {
  const duration = moment.duration(dagerTimer);
  const totaltAntallTimer = duration.asHours();

  return {
    dager: Math.floor(totaltAntallTimer / 7.5),
    timer: totaltAntallTimer % 7.5,
  };
};

export const sumTid = (dagerTimer_1: DagerTimer, dagerTimer_2: DagerTimer): DagerTimer => {
  const sumTimer = (dagerTimer_2.timer || 0) + (dagerTimer_1.timer || 0);

  return {
    dager: dagerTimer_2.dager + dagerTimer_1.dager + Math.floor(sumTimer / 7.5),
    timer: formaterTimerDesimal(sumTimer % 7.5),
  };
};
