import { getArrayDifference, makeArrayWithoutDuplicates, range } from './arrayUtils';

describe('arrayUtils', () => {
  describe('range', () => {
    it("skal lage en rekkefølge fra og med 0 med lengde 'length'", () => {
      const rangeZero = range(0);
      const rangeOne = range(1);
      const rangeTwo = range(2);
      const rangeTen = range(10);

      expect(rangeZero).toEqual([]);
      expect(rangeOne).toEqual([0]);
      expect(rangeTwo).toEqual([0, 1]);
      expect(rangeTen).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
  });

  describe('makeArrayWithoutDuplicates', () => {
    test('Should make array without duplicates', () => {
      const arrayWithDuplicates = ['hei', 'test', 'hei', 'en test til'];
      const expectedResult = ['hei', 'test', 'en test til'];
      const result = makeArrayWithoutDuplicates(arrayWithDuplicates);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getArrayDifference', () => {
    test('Should return difference between arrays', () => {
      const arrayOne = ['en', 'to', 'tre', 'fire'];
      const arrayTwo = ['en', 'to', 'tre'];
      const resultOne = getArrayDifference(arrayOne, arrayTwo);
      const resultTwo = getArrayDifference(arrayTwo, arrayOne);

      expect(resultOne).toEqual(['fire']);
      expect(resultTwo).toEqual([]);
    });
  });
});
