import { validerManueltRedigertBrev } from './RedigeringUtils';

describe('validerManueltRedigertBrev', () => {
  it.each([
    ['<h1>Fyll inn overskrift</h1><p>Fyll inn brevtekst</p>'],
    ['<h1>Vedtak</h1><p>Tekst <b>Fyll inn</b> brevtekst</p>'],
    ['<h1>Vedtak</h1><ul><li>Fyll inn <i>brevtekst</i></li></ul>'],
    ['<h1>Vedtak</h1><p>fyll inn BREVTEKST</p>'],
    ['Fyll inn overskrift'],
  ])('avviser brev som fortsatt har plassholdertekst: %s', html => {
    expect(validerManueltRedigertBrev(html)).toBe(false);
  });

  it.each([
    ['<h1>Vedtak om pleiepenger</h1><p>Du har fått innvilget.</p>'],
    ['<h2>Vedtak</h2><p>Tekst&nbsp;med&amp;entiteter &lt;b&gt;</p>'],
    ['<h1>Vedtak</h1><img src="x" onerror="1"><p>ok</p>'],
    [''],
  ])('godtar brev uten plassholdertekst: %s', html => {
    expect(validerManueltRedigertBrev(html)).toBe(true);
  });
});
