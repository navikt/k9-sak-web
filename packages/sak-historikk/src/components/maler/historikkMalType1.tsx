import React from 'react';

import { Label } from '@navikt/ds-react';
import HistorikkMal from '../HistorikkMalTsType';
import HistorikkDokumentLenke from './felles/HistorikkDokumentLenke';
import BubbleText from './felles/bubbleText';
import { findHendelseText } from './felles/historikkUtils';

const HistorikkMalType1 = ({ historikkinnslag, getKodeverknavn, saksnummer }: HistorikkMal) => {
  const { historikkinnslagDeler, dokumentLinks } = historikkinnslag;
  return (
    <>
      {historikkinnslagDeler[0] && historikkinnslagDeler[0].hendelse && (
        <Label size="small" as="p" className="snakkeboble-panel__tekst">
          {findHendelseText(historikkinnslagDeler[0].hendelse, getKodeverknavn)}
        </Label>
      )}
      {historikkinnslagDeler[0]?.begrunnelse && (
        <BubbleText bodyText={getKodeverknavn(historikkinnslagDeler[0].begrunnelse)} />
      )}
      {historikkinnslagDeler[0]?.begrunnelseFritekst && (
        <BubbleText bodyText={historikkinnslagDeler[0].begrunnelseFritekst} />
      )}
      {dokumentLinks &&
        dokumentLinks.map(dokumentLenke => (
          <HistorikkDokumentLenke
            key={`${dokumentLenke.tag}@${dokumentLenke.url}`}
            dokumentLenke={dokumentLenke}
            saksnummer={saksnummer}
          />
        ))}
    </>
  );
};

export default HistorikkMalType1;
