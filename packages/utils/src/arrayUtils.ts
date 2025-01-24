export const range = (length: number) => [...Array(length).keys()];

const isObject = (v: unknown): v is object => typeof v === 'object';

export const haystack = (object: unknown, keys: string | string[], defaultValue = null) => {
  const keysArray: string[] = Array.isArray(keys) ? keys : keys.replace(/(\[(\d+)\])/g, '.$2').split('.');
  const firstKey = keysArray[0];
  const currentObject = isObject(object) ? object[firstKey] : undefined;
  if (currentObject && keysArray.length > 1) {
    return haystack(currentObject, keysArray.slice(1), defaultValue);
  }
  return currentObject === undefined ? defaultValue : currentObject;
};

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
