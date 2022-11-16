import React from 'react';

import { Element } from 'nav-frontend-typografi';
import KodeverkType from '@fpsak-frontend/kodeverk/src/kodeverkTyper';

import BubbleText from './felles/bubbleText';
import { findHendelseText } from './felles/historikkUtils';
import HistorikkDokumentLenke from './felles/HistorikkDokumentLenke';
import HistorikkMal from '../HistorikkMalTsType';

const HistorikkMalType1 = ({ historikkinnslag, getKodeverknavn, saksnummer }: HistorikkMal) => {
  const { historikkinnslagDeler, dokumentLinks } = historikkinnslag;
  return (
    <>
      {historikkinnslagDeler[0] && historikkinnslagDeler[0].hendelse && (
        <Element className="snakkeboble-panel__tekst">
          {findHendelseText(historikkinnslagDeler[0].hendelse, getKodeverknavn)}
        </Element>
      )}
      {historikkinnslagDeler[0].begrunnelse && (
        <BubbleText
          bodyText={getKodeverknavn(historikkinnslagDeler[0].begrunnelse, KodeverkType.HISTORIKK_BEGRUNNELSE_TYPE)}
        />
      )}
      {historikkinnslagDeler[0].begrunnelseFritekst && (
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
