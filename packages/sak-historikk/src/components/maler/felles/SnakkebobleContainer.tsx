import React from 'react';
import classNames from 'classnames/bind';
import Snakkeboble from 'nav-frontend-snakkeboble';

import useGlobalStateRestApiData from '@k9-sak-web/rest-api-hooks/src/global-data/useGlobalStateRestApiData';
import HistorikkAktor from '@fpsak-frontend/kodeverk/src/historikkAktor';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import { Kodeverk, SaksbehandlereInfo } from '@k9-sak-web/types';
import { K9sakApiKeys } from '@k9-sak-web/sak-app/src/data/k9sakApi';

import styles from './snakkebobleContainer.less';

const cx = classNames.bind(styles);

const pilHøyre = (aktoer: string): boolean =>
  aktoer !== HistorikkAktor.SOKER && aktoer !== HistorikkAktor.ARBEIDSGIVER;

const formatDate = (date: string): string =>
  `${date.substring(8, 10)}.${date.substring(5, 7)}.${date.substring(0, 4)} - ${date.substring(11, 16)}`;

const snakkebobleIkonCls = (aktoer: string, kjoennKode: string): string =>
  cx('snakkeboble__ikon', {
    'snakkeboble__ikon--saksbehandler': aktoer === HistorikkAktor.SAKSBEHANDLER,
    'snakkeboble__ikon--brukerMann': HistorikkAktor.SOKER && kjoennKode === navBrukerKjonn.MANN,
    'snakkeboble__ikon--brukerKvinne': HistorikkAktor.SOKER && kjoennKode === navBrukerKjonn.KVINNE,
    'snakkeboble__ikon--beslutter': aktoer === HistorikkAktor.BESLUTTER,
    'snakkeboble__ikon--losningen': aktoer === HistorikkAktor.VEDTAKSLOSNINGEN,
    'snakkeboble__ikon--ekstern': aktoer === HistorikkAktor.ARBEIDSGIVER,
  });

const snakkeboblePanelCls = (aktoer: string) =>
  cx('snakkeboble__panel snakkeboble-panel', {
    snakkeboble__saksbehandler: aktoer === HistorikkAktor.SAKSBEHANDLER,
    snakkeboble__beslutter: aktoer === HistorikkAktor.BESLUTTER,
    snakkeboble__losningen: aktoer === HistorikkAktor.VEDTAKSLOSNINGEN,
    snakkeboble__ekstern: aktoer === HistorikkAktor.ARBEIDSGIVER,
    snakkeboble__bruker: aktoer === HistorikkAktor.SOKER,
  });

interface OwnProps {
  dato: string;
  aktoer: string;
  kjoenn?: string;
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
      ikonClass={snakkebobleIkonCls(aktoer, kjoenn)}
    >
      {children}
    </Snakkeboble>
  );
};

export default SnakkebobleContainer;
