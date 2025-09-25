export const range = (length: number) => [...Array(length).keys()];

export const makeArrayWithoutDuplicates = <T>(array: T[]): T[] => {
  const arrayWithoutDuplicates: T[] = [];
  array.forEach(value => {
    if (!arrayWithoutDuplicates.includes(value)) {
      arrayWithoutDuplicates.push(value);
    }
  });
  return arrayWithoutDuplicates;
};

export const getArrayDifference = (baseArray: string[], otherArray: string[]) =>
  baseArray.filter(value => otherArray.includes(value) === false);
