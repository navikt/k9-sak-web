import React from 'react';
import * as PT from 'prop-types';
import classNames from 'classnames/bind';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import Snakkeboble from 'nav-frontend-snakkeboble';

import styles from './snakkeboble.less';

const cx = classNames.bind(styles);

const pilHøyre = rolle => rolle !== 'SOKER' && rolle !== 'ARBEIDSGIVER';

const formatDate = date =>
  `${date.substring(8, 10)}.${date.substring(5, 7)}.${date.substring(0, 4)} - ${date.substring(11, 16)}`;

const snakkebobleIkonCls = (rolle, kjoennKode) =>
  cx('snakkeboble__ikon', {
    'snakkeboble__ikon--saksbehandler': rolle === 'SBH',
    'snakkeboble__ikon--brukerMann': rolle === 'SOKER' && kjoennKode === navBrukerKjonn.MANN,
    'snakkeboble__ikon--brukerKvinne': rolle === 'SOKER' && kjoennKode === navBrukerKjonn.KVINNE,
    'snakkeboble__ikon--beslutter': rolle === 'BESL',
    'snakkeboble__ikon--losningen': rolle === 'VL',
    'snakkeboble__ikon--ekstern': rolle === 'ARBEIDSGIVER',
  });

const snakkeboblePanelCls = rolle =>
  cx('snakkeboble__panel snakkeboble-panel', {
    snakkeboble__saksbehandler: rolle === 'SBH',
    snakkeboble__beslutter: rolle === 'BESL',
    snakkeboble__losningen: rolle === 'VL',
    snakkeboble__bruker: rolle === 'SOKER',
    snakkeboble__ekstern: rolle === 'ARBEIDSGIVER',
  });

const SnakkebobleContainer = ({ dato, rolle, rolleNavn, kjoennKode, opprettetAv, children }) => (
  <Snakkeboble
    className={`snakkeboble__kompakt ${snakkeboblePanelCls(rolle)}`}
    topp={`${formatDate(dato)} // ${rolleNavn} ${opprettetAv || ''}`}
    pilHoyre={pilHøyre(rolle)}
    ikonClass={snakkebobleIkonCls(rolle, kjoennKode)}
    panelClass="nhjklxzsnjklnjkl"
  >
    {children}
  </Snakkeboble>
);

SnakkebobleContainer.propTypes = {
  /**
   * Dato som historikken opprettedes
   */
  dato: PT.string.isRequired,
  /**
   * Hovedteksten i historikboblen
   */
  // tekst: PT.shape().isRequired,
  /**
   * Vilken rolle har den som lagat inslaget?
   */
  rolle: PT.string.isRequired,
  rolleNavn: PT.string,
  /**
   * Mann/Kvinne
   */
  kjoennKode: PT.string,
  /**
   * Vem opprettet historiken
   */
  opprettetAv: PT.string,
  /**
   * Historikkmalen for denne typen av innslag
   */
  children: PT.PropTypes.element.isRequired,
};

SnakkebobleContainer.defaultProps = {
  rolleNavn: '',
  kjoennKode: '',
  opprettetAv: '',
};

export default SnakkebobleContainer;
