const joinNonNullStrings = (strings: any[]): string => strings.filter(s => !!s).join('');

export default joinNonNullStrings;
