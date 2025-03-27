import { dateFormat, timeFormat } from '@navikt/ft-utils';

import { kjønn as kjønnKode } from '@k9-sak-web/backend/k9sak/kodeverk/Kjønn.js';
import styles from './snakkeboble.module.css';
import { historikkAktor, type HistorikkAktor } from '../tilbake/historikkinnslagTsTypeV2.js';
import {
  type HistorikkAktørDtoType,
  HistorikkAktørDtoType as historikkAktør,
} from '@k9-sak-web/backend/k9sak/generated';

export const isLegacyTilbakeHistorikkAktor = (
  aktørType: HistorikkAktor | HistorikkAktørDtoType,
): aktørType is HistorikkAktor => typeof aktørType === 'object' && aktørType['kode'] !== undefined;

const historikkAktørTypeMedHøgrePlassering = [
  historikkAktor.SAKSBEHANDLER,
  historikkAktor.VEDTAKSLOSNINGEN,
  historikkAktor.BESLUTTER, // <- manuelt tilbake kodeverk
  historikkAktør.SAKSBEHANDLER,
  historikkAktør.VEDTAKSLØSNINGEN,
  historikkAktør.BESLUTTER, // <- auto generert k9sak
];

export const utledPlassering = (aktørType: HistorikkAktor | HistorikkAktørDtoType): 'right' | 'left' => {
  const kode = isLegacyTilbakeHistorikkAktor(aktørType) ? aktørType.kode : aktørType;
  return historikkAktørTypeMedHøgrePlassering.some(v => v === kode) ? 'right' : 'left';
};

export const getStyle = (aktørType: HistorikkAktor | HistorikkAktørDtoType, kjønn?: string) => {
  const pos = utledPlassering(aktørType) === 'right' ? styles.chatRight : '';
  const kode = isLegacyTilbakeHistorikkAktor(aktørType) ? aktørType.kode : aktørType;
  switch (kode) {
    case historikkAktor.ARBEIDSGIVER:
    case historikkAktør.ARBEIDSGIVER:
      return `${styles.bubbleArbeidsgiver} ${pos}`;
    case historikkAktor.BESLUTTER:
    case historikkAktør.BESLUTTER:
      return `${styles.bubbleBeslutter} ${pos}`;
    case historikkAktor.VEDTAKSLOSNINGEN:
    case historikkAktør.VEDTAKSLØSNINGEN:
      return `${styles.bubbleVedtakslosningen} ${pos}`;
    case historikkAktor.SAKSBEHANDLER:
    case historikkAktør.SAKSBEHANDLER:
      return `${styles.bubbleSaksbehandler} ${pos}`;
    case historikkAktor.SOKER:
    case historikkAktør.SØKER: {
      const style =
        kjønn === kjønnKode.KVINNE
          ? styles.bubbleSokerKvinne
          : kjønn === kjønnKode.MANN
            ? styles.bubbleSokerMann
            : styles.bubbleSoker;
      return `${style} ${pos}`;
    }
    case historikkAktør.UDEFINERT:
      return `${styles.bubbleUdefinert} ${pos}`;
  }
};

export const formatDate = (date: string) => `${dateFormat(date)} - ${timeFormat(date)}`;

export const parseBoldText = (input: string) =>
  input
    .split(/(__.*?__)/g)
    .map((part, index) =>
      part.startsWith('__') && part.endsWith('__') ? <b key={index}>{part.slice(2, -2)}</b> : part,
    );

export const scrollUp = (): void => {
  if (window.innerWidth < 1305) {
    window.scroll(0, 0);
  }
};
