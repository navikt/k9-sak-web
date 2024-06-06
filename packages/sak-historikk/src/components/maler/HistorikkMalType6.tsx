import { HistorikkInnslagOpplysning } from '@k9-sak-web/types';
import { BodyShort, Label } from '@navikt/ds-react';
import React from 'react';
import { KodeverkNavnFraKodeFnType, KodeverkType } from '@k9-sak-web/lib/types/index.js';
import HistorikkMal from '../HistorikkMalTsType';
import { findHendelseText } from './felles/historikkUtils';

import styles from './historikkMalType.module.css';

const formaterOpplysning = (
  opplysning: HistorikkInnslagOpplysning,
  index: number,
  kodeverkNavnFraKodeFn: KodeverkNavnFraKodeFnType,
) => (
  <div key={`opplysning${index}`}>
    <BodyShort size="small" className={styles.keyValuePair}>
      {kodeverkNavnFraKodeFn(opplysning.opplysningType, KodeverkType.HISTORIKK_OPPLYSNING_TYPE)}:
    </BodyShort>
    &ensp;
    <Label size="small" as="p" className={styles.keyValuePair}>
      {opplysning.tilVerdi}
    </Label>
  </div>
);

const HistorikkMalType6 = ({ historikkinnslag, kodeverkNavnFraKodeFn }: HistorikkMal) => (
  <>
    {historikkinnslag.historikkinnslagDeler.map(del => (
      <div key={del.hendelse?.navn}>
        <Label size="small" as="p" className="snakkeboble-panel__tekst">
          {findHendelseText(del.hendelse, kodeverkNavnFraKodeFn)}
        </Label>
        {del.opplysninger.map((opplysning, index) => formaterOpplysning(opplysning, index, kodeverkNavnFraKodeFn))}
      </div>
    ))}
  </>
);

export default HistorikkMalType6;
