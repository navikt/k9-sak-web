import { lagKonsekvensForYtelsenTekst } from './VedtakInnvilgetRevurderingPanel';

const kodeverkNavnFraKode = kode => {
  if (kode === 'BEREGNING') {
    return 'Endring i beregning';
  }
  if (kode === 'UTTAK') {
    return 'Endring i uttak';
  }
  return '';
};

describe('<VedtakInnvilgetRevurderingPanel>', () => {
  it('skal lage korrekt tekst for konsekvens for ytelsen', () => {
    const konsekvenser = [{ type: 'BEREGNING' }, { type: 'UTTAK' }];
    const selectorData = lagKonsekvensForYtelsenTekst(konsekvenser, kodeverkNavnFraKode);
    expect(selectorData).toBe('Endring i beregning og Endring i uttak');
  });
});
