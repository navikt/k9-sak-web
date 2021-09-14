import { durationTilTimerMed7ogEnHalvTimesDagsbasis, periodeErISmittevernsperioden } from './utils';

it('Gjør om periode til antall timer, der en dag er 7.5 time', () => {
  const timerOgMinutter = 'PT3H30M';
  expect(durationTilTimerMed7ogEnHalvTimesDagsbasis(timerOgMinutter)).toBe(3.5);

  const dagerTimerMinutter = 'P3DT12H15M';
  expect(durationTilTimerMed7ogEnHalvTimesDagsbasis(dagerTimerMinutter)).toBe(3 * 7.5 + 12 + 0.25);
});

it('finner ut om en periode er i smittevernsperioden', () => {
  const slutterDagenfør = '2020-03-10/2020-04-19';
  expect(periodeErISmittevernsperioden(slutterDagenfør)).toBe(false);

  const slutterFørsteDag = '2020-03-10/2020-04-20';
  expect(periodeErISmittevernsperioden(slutterFørsteDag)).toBe(true);

  const slutterSisteDag = '2020-09-10/2020-09-30';
  expect(periodeErISmittevernsperioden(slutterSisteDag)).toBe(true);

  const slutterDagenEtter = '2021-09-10/2021-10-01';
  expect(periodeErISmittevernsperioden(slutterDagenEtter)).toBe(true);

  const kunDagenEtter = '2021-10-01/2021-10-01';
  expect(periodeErISmittevernsperioden(kunDagenEtter)).toBe(false);

  const begynnerDagenEtter = '2021-10-01/2021-10-12';
  expect(periodeErISmittevernsperioden(begynnerDagenEtter)).toBe(false);
});
