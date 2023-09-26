import { Element, Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

import { HistorikkInnslagOpplysning, Kodeverk } from '@k9-sak-web/types';

import HistorikkMal from '../HistorikkMalTsType';
import { findHendelseText } from './felles/historikkUtils';

import styles from './historikkMalType.module.css';

const formaterOpplysning = (
  opplysning: HistorikkInnslagOpplysning,
  index: number,
  getKodeverknavn: (kodeverk: Kodeverk) => string,
) => (
  <div key={`opplysning${index}`}>
    <Normaltekst className={styles.keyValuePair}>{getKodeverknavn(opplysning.opplysningType)}:</Normaltekst>
    &ensp;
    <Element className={styles.keyValuePair}>{opplysning.tilVerdi}</Element>
  </div>
);

const HistorikkMalType6 = ({ historikkinnslag, getKodeverknavn }: HistorikkMal) => (
  <>
    {historikkinnslag.historikkinnslagDeler.map(del => (
      <div key={del.hendelse?.navn?.kode}>
        <Element className="snakkeboble-panel__tekst">{findHendelseText(del.hendelse, getKodeverknavn)}</Element>
        {del.opplysninger.map((opplysning, index) => formaterOpplysning(opplysning, index, getKodeverknavn))}
      </div>
    ))}
  </>
);

export default HistorikkMalType6;
