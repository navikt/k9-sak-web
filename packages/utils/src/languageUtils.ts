export const replaceNorwegianCharacters = (str: string) => {
  let result = str.split('æ').join('ae');
  result = result.split('ø').join('oe');
  return result.split('å').join('aa');
};
