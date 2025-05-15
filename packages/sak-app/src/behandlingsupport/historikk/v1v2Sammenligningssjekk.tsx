// Funksjon for å rendre gitt react node og returnere tekst innhaldet frå den. (bubble-wrapper element)
// Brukt til å samanlikne tekst i gammalt historikk innslag med nytt, sikre at nytt innslag har all info frå gammalt.
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { MemoryRouter } from 'react-router';
import React, { ReactNode, JSX } from 'react';
import { EtablerteUlikeHistorikkinnslagTyper } from './historikkTypes.js';
import { KodeverdiSomObjektHistorikkinnslagTypeKilde } from '@k9-sak-web/backend/k9sak/generated';

class HistorikkV1V2Sammenligningsfeil extends Error {
  public readonly opprettetTidspunkt: string;
  public readonly wordsNotFound: string[];

  constructor(message: string, opprettetTidspunkt: string, wordsNotFound: string[]) {
    let msg = message;
    if (opprettetTidspunkt.length > 0) {
      msg = `${msg} Innslag opprettet "${opprettetTidspunkt}".`;
    }
    if (wordsNotFound.length > 0) {
      msg = `${msg} --- ${wordsNotFound.length} manglande ord.`;
    }
    super(msg);
    this.name = this.constructor.name;
    this.opprettetTidspunkt = opprettetTidspunkt;
    this.wordsNotFound = wordsNotFound;
  }

  redactWordsNotFound() {
    for (let i = 0; i < this.wordsNotFound.length; i++) {
      const word = this.wordsNotFound[i];
      const showCharCount = word.length > 5 ? 3 : 1;
      const redaction = word.length > showCharCount ? '*'.repeat(word.length - showCharCount) : '';
      this.wordsNotFound[i] = this.wordsNotFound[i].substring(0, 3) + redaction;
    }
  }
}

const extractBubbleWrapperStrings = async (node: ReactNode): Promise<string[]> => {
  const div = document.createElement('div');
  const root = createRoot(div);
  flushSync(() => {
    const el = <MemoryRouter>{node}</MemoryRouter>;
    root.render(el);
  });
  const bubble = div.querySelector('.navds-chat__bubble-wrapper');
  if (bubble instanceof HTMLElement) {
    // If the bubble has expandable (BubbleText) components, click the expand button so that we compare the full text.
    const expandButtons = () =>
      Array.from(bubble.querySelectorAll('button[aria-label="Åpne tekstfelt"][aria-expanded="false"]')).filter(
        el => el instanceof HTMLButtonElement,
      );
    expandButtons().forEach(btn => btn.click());
    // Must wait until click handler has run and re-render is done before proceeding:
    return new Promise((resolve, reject) => {
      // callback in requestAnimationFrame should be called after rendering of changes from expand button click is done
      requestAnimationFrame(() => {
        try {
          const strings = extractStringsRecursively(bubble);
          resolve(strings);
        } catch (e) {
          reject(e);
        }
      });
    });
  } else {
    console.warn('extractString: fant ikkje bubble wrapper klasse i rendra html.');
    return ['bubble-wrapper not found!'];
  }
};

// Traverserer rekursivt gjennom DOM for å hente ut alle tekst strenger.
// Brukast istadenfor innerText på rot elementet sidan vi då ikkje får separert ulike ord, ser det ut til.
const extractStringsRecursively = (element: HTMLElement): string[] => {
  let strings: string[] = [];
  for (const child of element.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      const txt = child.textContent;
      if (txt != null) {
        strings = [...strings, ...extractWords(txt)];
      }
    } else if (child.nodeType === Node.ELEMENT_NODE && child instanceof HTMLElement) {
      strings = [...strings, ...extractStringsRecursively(child)];
    } else {
      if (child instanceof SVGElement) {
        // Ignore on purpose
      } else {
        console.warn('other child not processed: ', child);
      }
    }
  }
  return strings;
};

const extractWords = (txt: string): string[] =>
  txt.split(/([\s\n\r-(),-]|\p{P})+/u).filter(v => v.length > 1 || Number.isFinite(parseFloat(v)));

const checkRenderedElementTexts = async (
  v1Innslag: EtablerteUlikeHistorikkinnslagTyper,
  v1Element: JSX.Element,
  v2Element: JSX.Element,
) => {
  const v1Words = await extractBubbleWrapperStrings(v1Element);
  const v2Words = await extractBubbleWrapperStrings(v2Element);
  const v1WordsNotInV2 = v1Words.filter(
    v1Word => !v2Words.some(v2Word => v1Word.toLowerCase() === v2Word.toLowerCase()),
  );
  if (v1WordsNotInV2.length > 0) {
    const behandlingId = 'behandlingId' in v1Innslag ? v1Innslag.behandlingId : v1Innslag.behandlingUuid;
    throw new HistorikkV1V2Sammenligningsfeil(
      `behandling ${behandlingId}: v1 rendra ord som ikkje er i v2. `,
      v1Innslag.opprettetTidspunkt,
      v1WordsNotInV2,
    );
  }
};

// Når vi veit at v2 av historikk av ein viss type mangler nokre ord i v1, og ikkje vil at det skal rapporterast som feil
// kan dei leggast inn her for å undertrykke feilrapportering
const historikkInnslagMissingWordsExemptions = new Map<string, string[]>();
historikkInnslagMissingWordsExemptions.set('KLAGE_BEH_NFP', ['endret', 'fra']);
historikkInnslagMissingWordsExemptions.set(KodeverdiSomObjektHistorikkinnslagTypeKilde.FAKTA_ENDRET, [
  'Aldersvilkåret',
]);
historikkInnslagMissingWordsExemptions.set(
  KodeverdiSomObjektHistorikkinnslagTypeKilde.TILBAKEKREVING_VIDEREBEHANDLING,
  ['satt'],
);
historikkInnslagMissingWordsExemptions.set(KodeverdiSomObjektHistorikkinnslagTypeKilde.SAK_RETUR, [
  'Vurdering',
  'eller',
  'Fastsatt',
  'er',
  'Er',
]);

const allMissingWordsAreExempted = (historikkInnslagV1Type: string, wordsMissing: string[]): boolean => {
  const wordsKnownMissing = historikkInnslagMissingWordsExemptions.get(historikkInnslagV1Type);
  if (wordsKnownMissing != null) {
    return wordsMissing.every(wordMissing =>
      wordsKnownMissing.some(wordKnownMissing => wordKnownMissing === wordMissing),
    );
  }
  return wordsMissing.length === 0;
};

export const compareRenderedElementTexts = async (
  v1Innslag: EtablerteUlikeHistorikkinnslagTyper[],
  v1Elementer: JSX.Element[],
  v2Elementer: JSX.Element[],
) => {
  if (v1Innslag.length !== v1Elementer.length) {
    throw new HistorikkV1V2Sammenligningsfeil(
      `v1Innslag ikkje samme lengde som rendra v1Elementer (${v1Innslag.length} != ${v1Elementer.length})`,
      '',
      [],
    );
  }
  if (v1Elementer.length !== v2Elementer.length) {
    throw new HistorikkV1V2Sammenligningsfeil(
      `historikk innslag v1/v2: rendra ulikt tal element (v1: ${v1Elementer.length}, v2: ${v2Elementer.length})`,
      '',
      [],
    );
  }
  for (let i = 0; i < v1Elementer.length; i++) {
    try {
      await checkRenderedElementTexts(v1Innslag[i], v1Elementer[i], v2Elementer[i]);
    } catch (err) {
      if (err instanceof HistorikkV1V2Sammenligningsfeil) {
        const feilaInnslagV1 = v1Innslag[i];
        if (
          (feilaInnslagV1.erKlage || feilaInnslagV1.erSak) &&
          allMissingWordsAreExempted(feilaInnslagV1.type.kode, err.wordsNotFound)
        ) {
          console.info(
            `historikk innslag v2 med uuid ${feilaInnslagV1.uuid} mangler ${err.wordsNotFound.length} ord funne i v1, men disse er untatt fra feilrapportering. (${err.wordsNotFound.join(', ')})`,
          );
        } else {
          err.message = `historikk innslag nr ${i + 1}: ${err.message}`;
          console.warn(
            err,
            err.wordsNotFound.map(v => v),
          );
          err.redactWordsNotFound(); // Ønsker ikkje å sende potensielt sensitiv info til sentry
          throw err;
        }
      } else {
        throw err;
      }
    }
  }
};
