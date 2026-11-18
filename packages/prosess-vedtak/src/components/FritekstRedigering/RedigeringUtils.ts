import { parse as cssParse, generate as cssGenerate, walk as cssWalk } from 'css-tree';
import * as Yup from 'yup';

import { Brevmottaker, VedtaksbrevMal } from '@fpsak-frontend/utils/src/formidlingUtils';
import { DokumentDataType } from '@k9-sak-web/types/src/dokumentdata';
import { safeJSONParse } from '@fpsak-frontend/utils';

export const utledStiler = (html: string) => {
  const heleBrevet = new DOMParser().parseFromString(html, 'text/html');
  const stiler = heleBrevet?.querySelector('style')?.innerHTML;
  const styleAst = cssParse(stiler);

  cssWalk(styleAst, (nodeRef, item, list) => {
    const node = nodeRef;
    if (node.type === 'Atrule' && node.name === 'page') list.remove(item);
    if (['ClassSelector', 'IdSelector', 'TypeSelector'].includes(node.type)) {
      if (node.name === 'body') {
        node.name = 'brev-wrapper';
      } else {
        switch (node.type) {
          case 'ClassSelector':
            node.name = `brev-wrapper .${node.name}`;
            break;
          case 'IdSelector':
            node.name = `brev-wrapper #${node.name}`;
            break;
          case 'TypeSelector':
            node.name = `brev-wrapper ${node.name}`;
            break;
          default:
            break;
        }
      }
      node.type = 'ClassSelector';
    }
  });

  return cssGenerate(styleAst);
};

const parseLetterDocument = (html: string) => {
  const parser = new DOMParser();
  const xhtml = parser.parseFromString(html, 'application/xhtml+xml');
  // Behold gyldig XHTML urørt, også når HTML-parseren ville endret avsnittsstrukturen.
  if (!xhtml.querySelector('parsererror')) return xhtml;

  const document = parser.parseFromString(html, 'text/html');
  const serialized = new XMLSerializer().serializeToString(document);
  const normalized = parser.parseFromString(serialized, 'application/xhtml+xml');
  if (normalized.querySelector('parsererror')) {
    throw new Error('Brevet kunne ikke konverteres til XHTML.');
  }
  return normalized;
};

export const seksjonSomKanRedigeres = (html: string) => {
  const heleBrevet = parseLetterDocument(html);
  return Array.from(heleBrevet.querySelectorAll('body > *, section > *'));
};

const htmlForRedigerbartFelt = (elementer: Element[]) => {
  let funnetRedigerbartInnhold = false;
  const prefiks = [];
  elementer.forEach(el => {
    if (el.hasAttribute('data-editable')) {
      funnetRedigerbartInnhold = true;
    } else if (!funnetRedigerbartInnhold && !el.hasAttribute('data-hidden')) {
      prefiks.push(new XMLSerializer().serializeToString(el));
    }
  });
  return prefiks;
};

export const utledPrefiksInnhold = (seksjoner: Element[]) => htmlForRedigerbartFelt(seksjoner).join('');

export const utledSuffiksInnhold = (seksjoner: Element[]) =>
  htmlForRedigerbartFelt(seksjoner.reverse()).reverse().join('');

export const utledRedigerbartInnhold = (html: string) => {
  const heleBrevet = parseLetterDocument(html);
  const editable = heleBrevet.querySelector('[data-editable]');
  // Fjern bare Typsts whitespace-wrappere, ikke mellomrommene eller formateringen inni dem.
  editable?.querySelectorAll('span').forEach(span => {
    if (
      span.attributes.length === 1 &&
      span.getAttribute('style')?.trim().replace(/;$/, '').trim() === 'white-space: pre-wrap'
    ) {
      span.replaceWith(...Array.from(span.childNodes));
    }
  });
  if (!editable) return undefined;
  const serializer = new XMLSerializer();
  return Array.from(editable.childNodes, node => serializer.serializeToString(node)).join('');
};

export const utledSkalInkludereKalender = (html: string) => {
  const heleBrevet = parseLetterDocument(html);
  return !!heleBrevet.querySelector('[data-attachement]');
};

export const lagLagreHtmlDokumentdataRequest = ({
  dokumentdata,
  redigerbarDokumentmal,
  redigertHtml,
  originalHtml,
  inkluderKalender,
  overstyrtMottaker,
}: {
  dokumentdata: DokumentDataType;
  redigerbarDokumentmal: VedtaksbrevMal;
  redigertHtml: string;
  originalHtml: string;
  inkluderKalender: boolean;
  overstyrtMottaker?: Brevmottaker;
}) => ({
  ...dokumentdata,
  REDIGERTBREV: {
    redigertHtml,
    originalHtml,
    redigertMal: redigerbarDokumentmal.redigerbarMalType,
    inkluderKalender,
  },
  VEDTAKSBREV_TYPE: redigerbarDokumentmal.vedtaksbrev,
  VEDTAKSBREV_MAL: redigerbarDokumentmal.dokumentMalType,
  ...(overstyrtMottaker ? { OVERSTYRT_MOTTAKER: safeJSONParse(overstyrtMottaker) } : {}),
});

export const validerManueltRedigertBrev = (html: string): boolean => {
  const innholdet = document.createElement('div');
  innholdet.innerHTML = html;
  const tekst = innholdet.textContent || innholdet.innerText || '';
  const malInnholdStrenger = ['Fyll inn overskrift', 'Fyll inn brevtekst'];
  const regex = new RegExp(malInnholdStrenger.join('|'), 'gi');
  return !regex.test(tekst);
};

export const validerRedigertHtml = Yup.string().test('validate-redigert-html', '', value =>
  validerManueltRedigertBrev(value),
);
