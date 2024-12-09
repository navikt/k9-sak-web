export const joinNonNullStrings = (strings: string[]): string => strings.filter(s => !!s).join('');

export function safeJSONParse(str: any) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}
