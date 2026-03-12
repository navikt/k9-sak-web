export const isObject = (v: unknown): v is object =>
  v !== undefined &&
  v !== null &&
  typeof v === "object"
