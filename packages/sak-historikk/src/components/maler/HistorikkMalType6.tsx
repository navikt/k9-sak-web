import React from 'react';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { HistorikkInnslagOpplysning, Kodeverk } from '@k9-sak-web/types';

import KodeverkType from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { findHendelseText } from './felles/historikkUtils';
import HistorikkMal from '../HistorikkMalTsType';

import styles from './historikkMalType.less';

const formaterOpplysning = (
  opplysning: HistorikkInnslagOpplysning,
  index: number,
  getKodeverknavn: (kode: string, kodeverk: KodeverkType) => string,
) => (
  <div key={`opplysning${index}`}>
    <Normaltekst className={styles.keyValuePair}>
      {getKodeverknavn(opplysning.opplysningType, KodeverkType.HISTORIKK_OPPLYSNING_TYPE)}:
    </Normaltekst>
    &ensp;
    <Element className={styles.keyValuePair}>{opplysning.tilVerdi}</Element>
  </div>
);

const HistorikkMalType6 = ({ historikkinnslag, getKodeverknavn }: HistorikkMal) => (
  <>
    {historikkinnslag.historikkinnslagDeler.map(del => (
      <div key={del.hendelse?.navn}>
        <Element className="snakkeboble-panel__tekst">{findHendelseText(del.hendelse, getKodeverknavn)}</Element>
        {del.opplysninger.map((opplysning, index) => formaterOpplysning(opplysning, index, getKodeverknavn))}
      </div>
    ))}
  </>
);

export default HistorikkMalType6;
