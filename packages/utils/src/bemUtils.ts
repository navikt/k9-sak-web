interface BemUtilInterface {
  block: string;
  element: (e: string) => string;
  modifier: (m: string) => string;
  elementWithModifier: (e: string, m: string) => string;
}

const bemUtils = (cls: string): BemUtilInterface => ({
  block: cls,
  element: (e: string): string => `${cls}__${e}`,
  modifier: (m: string): string => `${cls}--${m}`,
  elementWithModifier: (e: string, m: string): string => `${cls}__${e} ${cls}__${e}--${m}`,
});

export default bemUtils;
