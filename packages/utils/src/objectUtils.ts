export const isEqual = (obj1: object, obj2: object) => JSON.stringify(obj1) === JSON.stringify(obj2);

export const omit = (object: object, ...keysToOmit: string[]) =>
  Object.keys(object)
    .filter(key => !keysToOmit.includes(key))
    .map(key => ({ [key]: object[key] }))
    .reduce((a, b) => Object.assign(a, b), {});
