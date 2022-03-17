import { expect } from 'chai';

import { lagKonsekvensForYtelsenTekst } from './VedtakInnvilgetRevurderingPanel';

const getKodeverknavn = kodeverk => {
  if (kodeverk.kode === 'BEREGNING') {
    return 'Endring i beregning';
  }
  if (kodeverk.kode === 'UTTAK') {
    return 'Endring i uttak';
  }
  return '';
};

describe('<VedtakInnvilgetRevurderingPanel>', () => {
  it('skal lage korrekt tekst for konsekvens for ytelsen', () => {
    const konsekvenser = [
      {
        kode: 'BEREGNING',
      },
      {
        kode: 'UTTAK',
      },
    ];
    const selectorData = lagKonsekvensForYtelsenTekst(konsekvenser, getKodeverknavn);
    expect(selectorData).to.eql('Endring i beregning og Endring i uttak');
  });
});
