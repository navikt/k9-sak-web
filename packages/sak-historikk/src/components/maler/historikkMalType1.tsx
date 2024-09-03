import React from 'react';
import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types/KodeverkType.js';
import { Label } from '@navikt/ds-react';
import HistorikkMal from '../HistorikkMalTsType';
import HistorikkDokumentLenke from './felles/HistorikkDokumentLenke';
import BubbleText from './felles/bubbleText';
import { findHendelseText } from './felles/historikkUtils';

const HistorikkMalType1 = ({ historikkinnslag, kodeverkNavnFraKodeFn, saksnummer }: HistorikkMal) => {
  const { historikkinnslagDeler, dokumentLinks } = historikkinnslag;
  const historikkinnslagDel = historikkinnslagDeler[0] || null;

  if (!historikkinnslagDel) return <></>;

  const { hendelse, begrunnelse, begrunnelseFritekst, begrunnelseKodeverkType } = historikkinnslagDel;

  const begrunnelseTekst = begrunnelse
    ? kodeverkNavnFraKodeFn(
        begrunnelse,
        KodeverkType[begrunnelseKodeverkType] || KodeverkType.HISTORIKK_BEGRUNNELSE_TYPE,
      )
    : null;

  return (
    <>
      {hendelse && (
        <Label size="small" as="p" className="snakkeboble-panel__tekst">
          {findHendelseText(hendelse, kodeverkNavnFraKodeFn)}
        </Label>
      )}
      {begrunnelse && <BubbleText bodyText={begrunnelseTekst} />}
      {begrunnelseFritekst && <BubbleText bodyText={begrunnelseFritekst} />}
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
