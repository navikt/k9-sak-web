import { expect } from 'chai';
import formaterDato from './utils';

describe('utils', () => {
  it('formaterDato formaterer til vinsningsdato hvis iso-format, ellers -', () => {
    const isoDato = '2020-11-26';
    expect(formaterDato(isoDato)).to.eql('26.11.2020');

    const ikkeEnDato = '2020-13-37';
    expect(formaterDato(ikkeEnDato)).to.eql('-');

    const nulldato = null;
    expect(formaterDato(nulldato)).to.eql('-');
  });
});
