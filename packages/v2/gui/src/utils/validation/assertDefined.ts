export const assertDefined = <T>(v: T | null | undefined): T => {
  if (v != null) {
    return v;
  } else if (v === null) {
    throw new Error(`assertDefined got null value`);
  } else {
    throw new Error(`assertDefined got undefined value`);
  }
};
