import React, { FunctionComponent } from 'react';
import classNames from 'classnames/bind';
import Snakkeboble from 'nav-frontend-snakkeboble';

import HistorikkAktor from '@fpsak-frontend/kodeverk/src/historikkAktor';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import { Kodeverk } from '@k9-sak-web/types';

import styles from './snakkeboble.less';

const cx = classNames.bind(styles);

const pilHøyre = (aktoer: Kodeverk): boolean =>
  aktoer.kode !== HistorikkAktor.SOKER && aktoer.kode !== HistorikkAktor.ARBEIDSGIVER;

const formatDate = (date: string): string =>
  `${date.substring(8, 10)}.${date.substring(5, 7)}.${date.substring(0, 4)} - ${date.substring(11, 16)}`;

const snakkebobleIkonCls = (aktoer: Kodeverk, kjoennKode: string): string =>
  cx('snakkeboble__ikon', {
    'snakkeboble__ikon--saksbehandler': aktoer.kode === HistorikkAktor.SAKSBEHANDLER,
    'snakkeboble__ikon--brukerMann': HistorikkAktor.SOKER && kjoennKode === navBrukerKjonn.MANN,
    'snakkeboble__ikon--brukerKvinne': HistorikkAktor.SOKER && kjoennKode === navBrukerKjonn.KVINNE,
    'snakkeboble__ikon--beslutter': aktoer.kode === HistorikkAktor.BESLUTTER,
    'snakkeboble__ikon--losningen': aktoer.kode === HistorikkAktor.VEDTAKSLOSNINGEN,
    'snakkeboble__ikon--ekstern': aktoer.kode === HistorikkAktor.ARBEIDSGIVER,
  });

const snakkeboblePanelCls = (aktoer: Kodeverk) =>
  cx('snakkeboble__panel snakkeboble-panel', {
    snakkeboble__saksbehandler: aktoer.kode === HistorikkAktor.SAKSBEHANDLER,
    snakkeboble__beslutter: aktoer.kode === HistorikkAktor.BESLUTTER,
    snakkeboble__losningen: aktoer.kode === HistorikkAktor.VEDTAKSLOSNINGEN,
    snakkeboble__bruker: HistorikkAktor.SOKER,
    snakkeboble__ekstern: aktoer.kode === HistorikkAktor.ARBEIDSGIVER,
  });

interface OwnProps {
  dato: string;
  aktoer: Kodeverk;
  kjoenn?: Kodeverk;
  rolleNavn?: string;
  opprettetAv: string;
  children: React.ReactElement;
}

const SnakkebobleContainer: FunctionComponent<OwnProps> = ({
  dato,
  aktoer,
  rolleNavn = '',
  kjoenn,
  opprettetAv,
  children,
}) => (
  <Snakkeboble
    className={`snakkeboble__kompakt ${snakkeboblePanelCls(aktoer)}`}
    topp={`${formatDate(dato)} // ${rolleNavn} ${opprettetAv || ''}`}
    pilHoyre={pilHøyre(aktoer)}
    ikonClass={snakkebobleIkonCls(aktoer, kjoenn.kode)}
  >
    {children}
  </Snakkeboble>
);

export default SnakkebobleContainer;
