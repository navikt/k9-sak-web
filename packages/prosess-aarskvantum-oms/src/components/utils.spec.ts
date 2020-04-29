import { expect } from 'chai';
import { durationTilTimerMed7ogEnHalvTimesDagsbasis } from './utils';

it('Gjør om periode til antall timer, der en dag er 7.5 time', () => {
  const timerOgMinutter = 'PT3H30M';
  expect(durationTilTimerMed7ogEnHalvTimesDagsbasis(timerOgMinutter)).to.equal(3.5);

  const dagerTimerMinutter = 'P3DT12H15M';
  expect(durationTilTimerMed7ogEnHalvTimesDagsbasis(dagerTimerMinutter)).to.equal(3 * 7.5 + 12 + 0.25);
});
