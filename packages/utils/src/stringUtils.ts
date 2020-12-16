export const joinNonNullStrings = (strings: any[]): string => strings.filter(s => !!s).join('');

export function safeJSONParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return '';
  }
}
