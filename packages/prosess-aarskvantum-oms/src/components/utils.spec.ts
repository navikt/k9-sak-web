import { expect } from 'chai';
import { durationTilTimerMed7ogEnHalvTimesDagsbasis, periodeErIKoronaperioden } from './utils';

it('Gjør om periode til antall timer, der en dag er 7.5 time', () => {
  const timerOgMinutter = 'PT3H30M';
  expect(durationTilTimerMed7ogEnHalvTimesDagsbasis(timerOgMinutter)).to.equal(3.5);

  const dagerTimerMinutter = 'P3DT12H15M';
  expect(durationTilTimerMed7ogEnHalvTimesDagsbasis(dagerTimerMinutter)).to.equal(3 * 7.5 + 12 + 0.25);
});

it('finner ut om en periode er i koronaperioden', () => {
  const slutterDagenfør = '2020-03-10/2020-03-12';
  expect(periodeErIKoronaperioden(slutterDagenfør)).to.equal(false);

  const slutterFørsteDag = '2020-03-10/2020-03-13';
  expect(periodeErIKoronaperioden(slutterFørsteDag)).to.equal(true);

  const slutterSisteDag = '2020-12-10/2020-12-31';
  expect(periodeErIKoronaperioden(slutterSisteDag)).to.equal(true);

  const slutterDagenEtter = '2020-12-10/2021-01-01';
  expect(periodeErIKoronaperioden(slutterDagenEtter)).to.equal(true);

  const kunDagenEtter = '2021-01-01/2021-01-01';
  expect(periodeErIKoronaperioden(kunDagenEtter)).to.equal(false);

  const begynnerDagenEtter = '2021-01-01/2021-01-12';
  expect(periodeErIKoronaperioden(begynnerDagenEtter)).to.equal(false);
});
