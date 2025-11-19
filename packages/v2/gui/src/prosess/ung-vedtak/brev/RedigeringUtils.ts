import { generate as cssGenerate, parse as cssParse, walk as cssWalk } from 'css-tree';
import * as Yup from 'yup';

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
