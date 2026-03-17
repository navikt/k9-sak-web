function stringEnum<T extends { [index: string]: U }, U extends string>(x: T) {
  return x;
}

export default stringEnum;
