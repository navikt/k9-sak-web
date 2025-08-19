import { dateFormat, timeFormat } from '@navikt/ft-utils';

import {
  k9_kodeverk_historikk_HistorikkAktør as historikkAktør,
  type k9_kodeverk_historikk_HistorikkAktør as HistorikkAktørDtoType,
} from '@k9-sak-web/backend/k9sak/generated';
import type { ChatProps } from '@navikt/ds-react';
import type { AkselColor } from '@navikt/ds-react/types/theme';
import { historikkAktor, type HistorikkAktor } from '../tilbake/historikkinnslagTsTypeV2.js';
import styles from './snakkeboble.module.css';

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

export const getStyle = (aktørType: HistorikkAktor | HistorikkAktørDtoType) => {
  const pos = utledPlassering(aktørType) === 'right' ? styles.chatRight : '';
  return pos;
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

export const getColor = (aktørType: HistorikkAktor | HistorikkAktørDtoType): ChatProps['data-color'] => {
  let color: AkselColor;
  const kode = isLegacyTilbakeHistorikkAktor(aktørType) ? aktørType.kode : aktørType;
  switch (kode) {
    case historikkAktor.SAKSBEHANDLER:
      color = 'meta-purple';
      break;
    case historikkAktor.BESLUTTER:
      color = 'success';
      break;
    case historikkAktor.VEDTAKSLOSNINGEN:
      color = 'neutral';
      break;
    case historikkAktor.ARBEIDSGIVER:
      color = 'info';
      break;
    case historikkAktor.SOKER:
      color = 'warning';
      break;
    default:
      color = 'warning';
      break;
  }

  return color;
};
