// Funksjon for å rendre gitt react node og returnere tekst innhaldet frå den. (bubble-wrapper element)
// Brukt til å samanlikne tekst i gammalt historikk innslag med nytt, sikre at nytt innslag har all info frå gammalt.
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { MemoryRouter } from 'react-router';
import React, { ReactNode, JSX } from 'react';
import type { Historikkinnslag } from '@k9-sak-web/types';
import historikkinnslagType from '@fpsak-frontend/sak-historikk/src/kodeverk/historikkinnslagType.js';

class HistorikkV1V2Sammenligningsfeil extends Error {
  public readonly historikkInnslagV1Type: string;
  public readonly wordsNotFound: string[];

  constructor(message: string, historikkinnslagType: string, wordsNotFound: string[]) {
    let msg = message;
    if (historikkinnslagType.length > 0) {
      msg = `${msg} Innslag type ${historikkinnslagType}.`;
    }
    if (wordsNotFound.length > 0) {
      msg = `${msg} --- ${wordsNotFound.length} manglande ord.`;
    }
    super(msg);
    this.name = this.constructor.name;
    this.historikkInnslagV1Type = historikkinnslagType;
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
      bubble
        .querySelectorAll('button[aria-label="Åpne tekstfelt"][aria-expanded="false"]')
        .values()
        .filter(el => el instanceof HTMLButtonElement);
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
  v1Innslag: Historikkinnslag,
  v1Element: JSX.Element,
  v2Element: JSX.Element,
) => {
  const v1Words = await extractBubbleWrapperStrings(v1Element);
  const v2Words = await extractBubbleWrapperStrings(v2Element);
  const v1WordsNotInV2 = v1Words.filter(
    v1Word => !v2Words.some(v2Word => v1Word.toLowerCase() === v2Word.toLowerCase()),
  );
  if (v1WordsNotInV2.length > 0) {
    const innslagType = v1Innslag.type.kode;
    throw new HistorikkV1V2Sammenligningsfeil(
      `behandling ${v1Innslag.behandlingUuid}: v1 rendra ord som ikkje er i v2. `,
      innslagType,
      v1WordsNotInV2,
    );
  }
};

// Når vi veit at v2 av historikk av ein viss type mangler nokre ord i v1, og ikkje vil at det skal rapporterast som feil
// kan dei leggast inn her for å undertrykke feilrapportering
const historikkInnslagMissingWordsExcemptions = new Map<string, string[]>();
historikkInnslagMissingWordsExcemptions.set(historikkinnslagType.FAKTA_OM_FEILUTBETALING, [
  'For',
  'Hendelse',
  'endret',
  'fra',
]);
historikkInnslagMissingWordsExcemptions.set(historikkinnslagType.SAK_RETUR, ['Om']);

const allMissingWordsAreExcempted = (historikkInnslagV1Type: string, wordsMissing: string[]): boolean => {
  const wordsKnownMissing = historikkInnslagMissingWordsExcemptions.get(historikkInnslagV1Type);
  if (wordsKnownMissing != null) {
    return wordsMissing.every(wordMissing =>
      wordsKnownMissing.some(wordKnownMissing => wordKnownMissing === wordMissing),
    );
  }
  return wordsMissing.length === 0;
};

export const compareRenderedElementTexts = async (
  v1Innslag: Historikkinnslag[],
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
        if (allMissingWordsAreExcempted(err.historikkInnslagV1Type, err.wordsNotFound)) {
          // Alle orda er unntatt feilrapportering, logger berre som debug
          console.info(
            `historikk innslag (${err.historikkInnslagV1Type}) v2 mangler ord fra v1, men disse er unntatt feilrapportering. (${err.wordsNotFound.join(', ')})`,
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
