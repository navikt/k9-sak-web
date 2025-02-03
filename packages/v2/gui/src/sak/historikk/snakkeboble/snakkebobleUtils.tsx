import { dateFormat, timeFormat } from '@navikt/ft-utils';

import { kjønn as kjønnKode } from '@k9-sak-web/backend/k9sak/kodeverk/Kjønn.js';
import styles from './snakkeboble.module.css';
import { historikkAktor, type HistorikkAktor } from '../historikkinnslagTsTypeV2.js';

export const utledPlassering = (aktørType: HistorikkAktor): 'right' | 'left' =>
  [historikkAktor.SAKSBEHANDLER, historikkAktor.VEDTAKSLOSNINGEN, historikkAktor.BESLUTTER].some(
    v => v === aktørType.kode,
  )
    ? 'right'
    : 'left';

export const getStyle = (aktørType: HistorikkAktor, kjønn?: string) => {
  const styleMap = {
    [historikkAktor.ARBEIDSGIVER]: styles.bubbleArbeidsgiver,
    [historikkAktor.BESLUTTER]: styles.bubbleBeslutter,
    [historikkAktor.VEDTAKSLOSNINGEN]: styles.bubbleVedtakslosningen,
    [historikkAktor.SAKSBEHANDLER]: styles.bubbleSaksbehandler,
    [historikkAktor.SOKER]:
      kjønn === kjønnKode.KVINNE
        ? styles.bubbleSokerKvinne
        : kjønn === kjønnKode.MANN
          ? styles.bubbleSokerMann
          : styles.bubbleSoker,
  };
  const pos = utledPlassering(aktørType) === 'right' ? styles.chatRight : '';
  return `${styleMap[aktørType.kode]} ${pos}`;
};

export const formatDate = (date: string) => `${dateFormat(date)} - ${timeFormat(date)}`;

export const parseBoldText = (input: string) =>
  input
    .split(/(__.*?__)/g)
    .map((part, index) =>
      part.startsWith('__') && part.endsWith('__') ? <b key={index}>{part.slice(2, -2)}</b> : part,
    );
