import classNames from 'classnames/bind';
import Snakkeboble from 'nav-frontend-snakkeboble';
import React from 'react';

import HistorikkAktor from '@fpsak-frontend/kodeverk/src/historikkAktor';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import useGlobalStateRestApiData from '@k9-sak-web/rest-api-hooks/src/global-data/useGlobalStateRestApiData';
import { K9sakApiKeys } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import { Kodeverk, SaksbehandlereInfo } from '@k9-sak-web/types';

import styles from './snakkebobleContainer.module.css';

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
    snakkeboble__ekstern: aktoer.kode === HistorikkAktor.ARBEIDSGIVER,
    snakkeboble__bruker: aktoer.kode === HistorikkAktor.SOKER,
  });

interface OwnProps {
  dato: string;
  aktoer: Kodeverk;
  kjoenn?: Kodeverk;
  rolleNavn?: string;
  opprettetAv: string;
  children: React.ReactElement;
}

const SnakkebobleContainer = ({ dato, aktoer, rolleNavn = '', kjoenn, opprettetAv, children }: OwnProps) => {
  const saksbehandlere = useGlobalStateRestApiData<SaksbehandlereInfo>(K9sakApiKeys.HENT_SAKSBEHANDLERE);
  const saksbehandlernavn =
    typeof saksbehandlere?.saksbehandlere === 'object' &&
    (saksbehandlere?.saksbehandlere[opprettetAv] || saksbehandlere?.saksbehandlere[opprettetAv?.toLowerCase()]);
  return (
    <Snakkeboble
      className={`snakkeboble__kompakt ${snakkeboblePanelCls(aktoer)}`}
      topp={`${formatDate(dato)} // ${rolleNavn} ${saksbehandlernavn || opprettetAv || ''}`}
      pilHoyre={pilHøyre(aktoer)}
      ikonClass={snakkebobleIkonCls(aktoer, kjoenn?.kode)}
    >
      {children}
    </Snakkeboble>
  );
};

export default SnakkebobleContainer;
