import type { Mottaker } from '@k9-sak-web/backend/k9formidling/models/Mottaker.js';
import { generate as cssGenerate, parse as cssParse, walk as cssWalk } from 'css-tree';
import * as Yup from 'yup';
import type { DokumentDataType } from './types/dokumentdata';

export interface VedtaksbrevMal {
  dokumentMalType: string;
  redigerbarMalType: string;
  vedtaksbrev: string;
}

export type Brevmottaker = Readonly<Mottaker>;

export const utledStiler = (html: string) => {
  const heleBrevet = new DOMParser().parseFromString(html, 'text/html');
  const stiler = heleBrevet?.querySelector('style')?.innerHTML ?? '';
  const styleAst = cssParse(stiler);

  cssWalk(styleAst, (nodeRef, item, list) => {
    const node = nodeRef;
    if (node.type === 'Atrule' && node.name === 'page') list.remove(item);
    if (['ClassSelector', 'IdSelector', 'TypeSelector'].includes(node.type)) {
      if ('name' in node && node.name === 'body') {
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

export const seksjonSomKanRedigeres = (html: string) => {
  const heleBrevet = new DOMParser().parseFromString(html, 'application/xhtml+xml');
  return Array.from(heleBrevet.querySelectorAll('body > *, section > *'));
};

const htmlForRedigerbartFelt = (elementer: Element[]) => {
  let funnetRedigerbartInnhold = false;
  const prefiks: string[] = [];
  elementer.forEach(el => {
    if (el.hasAttribute('data-editable')) {
      funnetRedigerbartInnhold = true;
    } else if (!funnetRedigerbartInnhold && !el.hasAttribute('data-hidden')) {
      prefiks.push(el.outerHTML);
    }
  });
  return prefiks;
};

export const utledPrefiksInnhold = (seksjoner: Element[]) => htmlForRedigerbartFelt(seksjoner).join('');

export const utledSuffiksInnhold = (seksjoner: Element[]) =>
  htmlForRedigerbartFelt(seksjoner.reverse()).reverse().join('');

export const utledRedigerbartInnhold = (html: string) => {
  // Bruker application/xhtml+xml som datatype, da backend bruker en xhtml parser som
  // ikke støtter feks. <br> som ikke er self-closing (<br/>)
  const heleBrevet = new DOMParser().parseFromString(html, 'application/xhtml+xml');
  return heleBrevet?.querySelector('[data-editable]')?.innerHTML;
};

export const utledSkalInkludereKalender = (html: string) => {
  const heleBrevet = new DOMParser().parseFromString(html, 'application/xhtml+xml');
  return !!heleBrevet.querySelector('[data-attachement]');
};

export interface LagreHtmlDokumentdataRequest {
  // dokumentdata: DokumentDataType;
  redigerbarDokumentmal: VedtaksbrevMal;
  redigertHtml: string;
  originalHtml: string;
  // inkluderKalender: boolean;
  overstyrtMottaker?: Brevmottaker;
}

export type LagreHtmlDokumentdataResponse = DokumentDataType & {
  REDIGERTBREV: {
    redigertHtml: string;
    originalHtml: string;
    redigertMal: string;
    // inkluderKalender: boolean;
  };
  VEDTAKSBREV_TYPE: string;
  VEDTAKSBREV_MAL: string;
  OVERSTYRT_MOTTAKER?: Mottaker;
};

export const validerManueltRedigertBrev = (html: string): boolean => {
  const innholdet = document.createElement('div');
  innholdet.innerHTML = html;
  const tekst = innholdet.textContent || innholdet.innerText || '';
  const malInnholdStrenger = ['Fyll inn overskrift', 'Fyll inn brevtekst'];
  const regex = new RegExp(malInnholdStrenger.join('|'), 'gi');
  return !regex.test(tekst);
};

export const validerRedigertHtml = Yup.string().test('validate-redigert-html', '', value =>
  value ? validerManueltRedigertBrev(value) : false,
);

export const harDokumentdataApiFeilmelding = ({ feilmeldinger }: { feilmeldinger: any[] }) =>
  feilmeldinger.some(feilmelding => {
    if (feilmelding.feilmelding) {
      return feilmelding.feilmelding.includes('/k9/formidling/dokumentdata/api');
    }
    if (feilmelding.message === '') {
      return feilmelding.message.length < 1;
    }
    return false;
  });

export const harForhandsvisFeilmeldinger = ({ feilmeldinger }: { feilmeldinger: any[] }) =>
  feilmeldinger.some(
    feilmelding =>
      !!(feilmelding.feilmelding && feilmelding.feilmelding.includes('/k9/formidling/api/brev/forhaandsvis')),
  );

export const utledForhandsvisFeilmeldinger = ({
  feilmeldinger,
}: {
  feilmeldinger: any[];
}): { feilmelding: string; type: string }[] =>
  feilmeldinger.filter(
    feilmelding =>
      !!(feilmelding.feilmelding && feilmelding.feilmelding.includes('/k9/formidling/api/brev/forhaandsvis')),
  );
