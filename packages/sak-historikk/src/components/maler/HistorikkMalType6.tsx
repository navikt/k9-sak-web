import { HistorikkInnslagOpplysning, Kodeverk } from '@k9-sak-web/types';
import { BodyShort, Label } from '@navikt/ds-react';
import React from 'react';
import HistorikkMal from '../HistorikkMalTsType';
import { findHendelseText } from './felles/historikkUtils';

import styles from './historikkMalType.module.css';

const formaterOpplysning = (
  opplysning: HistorikkInnslagOpplysning,
  index: number,
  getKodeverknavn: (kodeverk: Kodeverk) => string,
) => (
  <div key={`opplysning${index}`}>
    <BodyShort size="small" className={styles.keyValuePair}>
      {getKodeverknavn(opplysning.opplysningType)}:
    </BodyShort>
    &ensp;
    <Label size="small" as="p" className={styles.keyValuePair}>
      {opplysning.tilVerdi}
    </Label>
  </div>
);

const HistorikkMalType6 = ({ historikkinnslag, getKodeverknavn }: HistorikkMal) => (
  <>
    {historikkinnslag.historikkinnslagDeler.map(del => (
      <div key={del.hendelse?.navn?.kode}>
        <Label size="small" as="p" className="snakkeboble-panel__tekst">
          {findHendelseText(del.hendelse, getKodeverknavn)}
        </Label>
        {del.opplysninger.map((opplysning, index) => formaterOpplysning(opplysning, index, getKodeverknavn))}
      </div>
    ))}
  </>
);

export default HistorikkMalType6;
