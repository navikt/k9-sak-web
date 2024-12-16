export const isEqual = (obj1: object, obj2: object) => JSON.stringify(obj1) === JSON.stringify(obj2);

export const omit = (object: object, ...keysToOmit: string[]) =>
  Object.keys(object)
    .filter(key => !keysToOmit.includes(key))
    .map(key => ({ [key]: object[key] }))
    .reduce((a, b) => Object.assign(a, b), {});

const isNullOrUndefined = (value: unknown): boolean => value === null || value === undefined;
const isNotNullAndObject = (value: unknown): value is object => value !== null && typeof value === 'object';

const redefineIfUndefined = <T>(obj: T, otherObjOfType: T): T | null => {
  if (isNullOrUndefined(obj) && isNotNullAndObject(otherObjOfType)) {
    try {
      return new (otherObjOfType.constructor as { new (): T })();
    } catch {
      return null;
    }
  }
  return obj;
};

export const diff = (a: unknown, b: unknown) => {
  const thing1 = redefineIfUndefined(a, b);
  const thing2 = redefineIfUndefined(b, a);
  if (typeof thing1 !== typeof thing2) {
    return true;
  }
  if (thing1 === null && thing2 === null) {
    return false;
  }

  const diffObj = () => {
    if (thing1 instanceof Array) {
      if (thing2 instanceof Array) {
        const length = Math.max(thing1.length, thing2.length);
        return [...Array(length).keys()].map(i => diff(thing1[i], thing2[i]));
      }
      return true;
    }
    return [...new Set([...Object.keys(thing1), ...Object.keys(thing2)])].reduce(
      (diffs, key) => ({ ...diffs, [key]: diff(thing1[key], thing2[key]) }),
      {},
    );
  };

  switch (typeof thing1) {
    case 'object':
      return diffObj();
    case 'undefined':
    case 'function':
    case 'string':
    case 'number':
    case 'boolean':
    default:
      return thing1 !== thing2;
  }
};
