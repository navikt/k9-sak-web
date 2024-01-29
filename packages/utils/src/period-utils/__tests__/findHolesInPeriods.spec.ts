import Period from '../Period';
import findHolesInPeriods from '../findHolesInPeriods';

test('finnHullIPeriode', () => {
  const perioder = [new Period('2020-04-01', '06.04.2020'), new Period('2020-02-01', '06.02.2020')];
  const expectedHull = [new Period('2020-02-07', '2020-03-31')];
  const result = findHolesInPeriods(perioder);

  expect(result).toEqual(expectedHull);
});
