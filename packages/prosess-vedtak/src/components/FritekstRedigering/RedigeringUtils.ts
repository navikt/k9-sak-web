import { parse as cssParse, generate as cssGenerate, walk as cssWalk } from 'css-tree';

import { VedtaksbrevMal } from '@fpsak-frontend/utils/src/formidlingUtils';
import { DokumentDataType } from '@k9-sak-web/types/src/dokumentdata';

export const utledStiler = (html: string) => {
  const heleBrevet = new DOMParser().parseFromString(html, 'text/html');
  const stiler = heleBrevet.querySelector('style').innerHTML;
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

export const utledPrefiksInnhold = (html: string) => {
  const heleBrevet = new DOMParser().parseFromString(html, 'text/html');
  let funnetRedigerbartInnhold = false;
  const prefiks = [];
  Array.from(heleBrevet.querySelectorAll('body > *')).map(div => {
    if (div.hasAttribute('data-editable')) {
      funnetRedigerbartInnhold = true;
    } else if (!funnetRedigerbartInnhold) {
      prefiks.push(div.innerHTML);
    }
    return div;
  });
  return prefiks.join('');
};

export const utledSuffiksInnhold = (html: string) => {
  const heleBrevet = new DOMParser().parseFromString(html, 'text/html');
  let funnetRedigerbartInnhold = false;
  const suffiks = [];
  Array.from(heleBrevet.querySelectorAll('body > *')).map(div => {
    if (div.hasAttribute('data-editable')) {
      funnetRedigerbartInnhold = true;
    } else if (funnetRedigerbartInnhold) {
      suffiks.push(div.innerHTML);
    }
    return div;
  });
  return suffiks.join('');
};

export const utledRedigerbartInnhold = (html: string) => {
  const heleBrevet = new DOMParser().parseFromString(html, 'text/html');
  return heleBrevet.querySelector('[data-editable]').innerHTML;
};

export const lagLagreHtmlDokumentdataRequest = ({
  dokumentdata,
  redigerbarDokumentmal,
  redigertHtml,
  originalHtml,
  inkluderKalender,
}: {
  dokumentdata: DokumentDataType;
  redigerbarDokumentmal: VedtaksbrevMal;
  redigertHtml: string;
  originalHtml: string;
  inkluderKalender: boolean;
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
});
