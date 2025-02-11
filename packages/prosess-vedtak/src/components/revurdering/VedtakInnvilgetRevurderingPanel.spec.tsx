import { lagKonsekvensForYtelsenTekst } from './VedtakInnvilgetRevurderingPanel';

const getKodeverknavn = kodeverk => {
  if (kodeverk === 'BEREGNING') {
    return 'Endring i beregning';
  }
  if (kodeverk === 'UTTAK') {
    return 'Endring i uttak';
  }
  return '';
};

describe('<VedtakInnvilgetRevurderingPanel>', () => {
  it('skal lage korrekt tekst for konsekvens for ytelsen', () => {
    const konsekvenser = [{ type: 'BEREGNING' }, { type: 'UTTAK' }];
    const selectorData = lagKonsekvensForYtelsenTekst(konsekvenser, getKodeverknavn);
    expect(selectorData).toBe('Endring i beregning og Endring i uttak');
  });
});
