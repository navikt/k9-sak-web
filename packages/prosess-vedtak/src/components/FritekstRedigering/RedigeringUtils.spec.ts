import {
  seksjonSomKanRedigeres,
  utledPrefiksInnhold,
  utledRedigerbartInnhold,
  utledSkalInkludereKalender,
  utledStiler,
  utledSuffiksInnhold,
} from './RedigeringUtils';

const body = `
  <header><img id="nav_logo" src="data:image/png;base64,AA==" alt="Nav"{close}></header>
  <section data-hidden="data-hidden">
    <div data-editable="data-editable">
      <h1>Vedtak</h1>
      <p>Første<span style="white-space: pre-wrap">&#x20;</span><strong>avsnitt</strong>.
        <br{close}>Neste linje med <a href="https://nav.no/?a=1&amp;b=2" title="Nav">lenke</a>.</p>
      <h2>Vurdering</h2>
      <ul><li><p>Et punkt</p><ol><li>Nestet punkt</li></ol></li></ul>
    </div>
    <div class="same_page"><h2>Klage</h2><p>Fast tekst</p></div>
    <div data-hidden="data-hidden" data-attachement="data-attachement"><h2>Kalender</h2></div>
  </section>
  <footer><span class="sidetall">side</span></footer>
`;

const letter = (close: string) => `<!DOCTYPE html><html><head>
  <meta charset="utf-8"${close}>
  <style>@page { size: A4; } body { padding: 10mm; } h1 { font-size: 25px; }</style>
  </head><body>${body.replaceAll('{close}', close)}</body></html>`;

const parseXhtml = (html: string) => {
  const document = new DOMParser().parseFromString(html, 'application/xhtml+xml');
  expect(document.querySelector('parsererror')).toBeNull();
  return document;
};

describe.each([
  ['pdfgen XHTML', letter(' /')],
  ['pdfgenrs HTML', letter('')],
])('%s', (_name, html) => {
  it('extracts XML-compatible editable content without losing formatting or word spacing', () => {
    const editable = utledRedigerbartInnhold(html);
    expect(editable).toBeDefined();
    const document = parseXhtml(`<div>${editable}</div>`);
    expect(document.querySelector('h1')?.textContent).toBe('Vedtak');
    expect(document.querySelector('h2')?.textContent).toBe('Vurdering');
    expect(document.querySelector('p')?.textContent).toContain('Første avsnitt.');
    expect(document.querySelector('strong')?.textContent).toBe('avsnitt');
    expect(document.querySelector('br')).not.toBeNull();
    expect(document.querySelector('ul > li > ol > li')?.textContent).toBe('Nestet punkt');
    expect(document.querySelector('a')?.getAttribute('href')).toBe('https://nav.no/?a=1&b=2');
    expect(document.querySelector('a')?.getAttribute('title')).toBe('Nav');
    expect(document.querySelector('span')).toBeNull();
    expect(editable).not.toContain('Kalender');
    expect(editable).not.toContain('Fast tekst');
  });

  it('preserves fixed content and omits hidden sections from the editor prefix and suffix', () => {
    const prefix = utledPrefiksInnhold(seksjonSomKanRedigeres(html));
    const suffix = utledSuffiksInnhold(seksjonSomKanRedigeres(html));
    const prefixDocument = parseXhtml(`<div>${prefix}</div>`);
    expect(prefixDocument.querySelector('img#nav_logo')?.getAttribute('alt')).toBe('Nav');
    const suffixDocument = parseXhtml(`<div>${suffix}</div>`);
    expect(suffixDocument.querySelector('.same_page')?.textContent).toContain('Fast tekst');
    expect(suffixDocument.querySelector('footer .sidetall')).not.toBeNull();
    expect(prefix + suffix).not.toContain('data-editable');
    expect(prefix + suffix).not.toContain('Kalender');
  });

  it('detects attachments without changing the existing attribute contract', () => {
    expect(utledSkalInkludereKalender(html)).toBe(true);
    expect(utledSkalInkludereKalender(html.replace('data-attachement="data-attachement"', ''))).toBe(false);
  });

  it('keeps extracted content stable when it is loaded again', () => {
    const editable = utledRedigerbartInnhold(html);
    expect(utledRedigerbartInnhold(`<html><body><div data-editable="">${editable}</div></body></html>`)).toBe(editable);
  });

  it('keeps CSS scoped to the letter and removes print-only page rules', () => {
    const styles = utledStiler(html);
    expect(styles).toContain('.brev-wrapper');
    expect(styles).toContain('font-size:25px');
    expect(styles).not.toContain('@page');
  });
});

it('preserves legacy XML nesting instead of applying browser HTML paragraph repair', () => {
  const html = '<html><body><div data-editable=""><p>Før<p>Inni</p>Etter</p></div></body></html>';
  const editable = utledRedigerbartInnhold(html);
  expect(parseXhtml(`<div>${editable}</div>`).querySelector('p > p')?.textContent).toBe('Inni');
});

it('preserves intentional spans and unwraps generated spans without deleting their children', () => {
  const html = `<html><body><div data-editable="">
    <p>A<span style="white-space: pre-wrap"> <em>B</em> </span>C</p>
    <p><span class="keep" style="white-space: pre-wrap">D</span>
    <span style="font-weight: bold">E</span></p>
  </div></body></html>`;
  const document = parseXhtml(`<div>${utledRedigerbartInnhold(html)}</div>`);
  expect(document.querySelector('p')?.textContent).toBe('A B C');
  expect(document.querySelector('em')?.textContent).toBe('B');
  expect(document.querySelector('span.keep')?.textContent).toBe('D');
  expect(document.querySelector('span[style="font-weight: bold"]')?.textContent).toBe('E');
});

it('returns no editable content when the response has no editable section', () => {
  expect(utledRedigerbartInnhold('<html><body><p>Fast tekst<br></p></body></html>')).toBeUndefined();
});

it('preserves nonbreaking currency spaces and escaped text when normalizing HTML entities', () => {
  // Happy DOM skriver feilaktig HTML-entiteten &nbsp; også ved XML-serialisering.
  const xmlSerializer = new XMLSerializer();
  const serialize = xmlSerializer.serializeToString.bind(xmlSerializer);
  const serializer = vi
    .spyOn(XMLSerializer.prototype, 'serializeToString')
    .mockImplementation(node => serialize(node).replaceAll('&nbsp;', '&#160;'));
  const html = '<html><body><div data-editable><p>1&nbsp;234,56 &amp; &lt;tekst&gt;</p></div></body></html>';
  try {
    const editable = utledRedigerbartInnhold(html);
    expect(parseXhtml(`<div>${editable}</div>`).querySelector('p')?.textContent).toBe('1\u00a0234,56 & <tekst>');
  } finally {
    serializer.mockRestore();
  }
});
