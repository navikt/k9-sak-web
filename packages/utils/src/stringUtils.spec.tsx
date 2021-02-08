import { joinNonNullStrings, safeJSONParse } from './stringUtils';

describe('stringUtils', () => {
  it('joinNonNullStrings setter sammen alle non-null strings i en liste', () => {
    const stringList = ['1', 'hei', null, undefined, '2'];

    const result = joinNonNullStrings(stringList);

    expect(result).toBe('1hei2');
  });
});

describe('safeJSONParse', () => {
  it('safeJSONParse krasher ikke hvis argumentet ikke er valid JSON', () => {
    const str = 'hello world';

    const result = safeJSONParse(str);

    expect(result).toBeNull();
  });

  it('safeJSONParse returnerer JSON parsed data hvis argumentet er valid JSON', () => {
    const str = '{"hello": "world"}';

    const result = safeJSONParse(str);

    expect(result.hello).toBe('world');
  });
});
