import { prettifyDate } from '../formats';

test('prettifyDate', () => {
  const expectedEqual = '10.09.2020';
  expect(prettifyDate('2020-09-10')).toBe(expectedEqual);

  const expectedNotEqual = '10.9.2020';
  expect(prettifyDate('2020-09-10')).not.toBe(expectedNotEqual);
});
