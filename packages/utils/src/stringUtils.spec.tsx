import { expect } from 'chai';
import joinNonNullStrings from './stringUtils';

describe('stringUtils', () => {
  it('joinNonNullStrings setter sammen alle non-null strings i en liste', () => {
    const stringList = ['1', 'hei', null, undefined, '2'];

    const result = joinNonNullStrings(stringList);

    expect(result).to.equal('1hei2');
  });
});
