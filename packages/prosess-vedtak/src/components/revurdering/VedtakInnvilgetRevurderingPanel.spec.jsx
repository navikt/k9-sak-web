import { lagKonsekvensForYtelsenTekst } from './VedtakInnvilgetRevurderingPanel';

const kodeverkNavnFraKode = (kode, kodeverkType) => {
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
    const konsekvenser = ['BEREGNING', 'UTTAK'];
    const selectorData = lagKonsekvensForYtelsenTekst(konsekvenser, kodeverkNavnFraKode);
    expect(selectorData).toBe('Endring i beregning og Endring i uttak');
  });
});
