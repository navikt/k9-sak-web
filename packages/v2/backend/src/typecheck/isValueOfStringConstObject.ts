export const isValueOfStringConstObject = <const Obj extends Readonly<Record<string, string>>>(
  prop: string,
  obj: Obj,
): prop is Obj[keyof Obj] => {
  return Object.values(obj).some(v => v === prop);
};
