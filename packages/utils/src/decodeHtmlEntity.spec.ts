import decodeHtmlEntity from './decodeHtmlEntity';

describe('decode-Html-Entity', () => {
  it('skal sjekke at html entity med navn og kode er decodert', () => {
    expect(decodeHtmlEntity('&amp; og &#34;')).toEqual('& og "');
  });
  it('skal sjekke at html entity less than og greater than er ikke decodert', () => {
    expect(decodeHtmlEntity('&lt; og &gt; og &#60; og &#62;')).toEqual('&lt; og &gt; og &#60; og &#62;');
  });
});
