// @vitest-environment-options {"settings":{"enableJavaScriptEvaluation":true,"suppressInsecureJavaScriptEnvironmentWarning":true}}

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
    [''],
  ])('godtar brev uten plassholdertekst: %s', html => {
    expect(validerManueltRedigertBrev(html)).toBe(true);
  });

  it('kjører ikke hendelsesattributter i HTML-en', () => {
    const html =
      '<h1>Vedtak</h1><img onerror="this.ownerDocument.documentElement.dataset.imageError = \'true\'" src="http://["><p>ok</p>';

    // Ugyldig src gir synkron error-hendelse i happy-dom. Kontrollen sikrer at testmiljøet kjører onerror.
    document.createElement('div').innerHTML = html;
    expect(document.documentElement.getAttribute('data-image-error')).toBe('true');
    document.documentElement.removeAttribute('data-image-error');

    expect(validerManueltRedigertBrev(html)).toBe(true);
    expect(document.documentElement.getAttribute('data-image-error')).toBeNull();
  });
});
