import { type Location } from 'history';

import { BodyLong, BodyShort, Chat, VStack } from '@navikt/ds-react';
import type { HistorikkinnslagV2 } from '../historikkinnslagTsTypeV2.js';

import { HistorikkDokumentLenke } from './HistorikkDokumentLenke';
import { formatDate, getStyle, parseBoldText, utledPlassering } from './snakkebobleUtils';
import { Avatar } from './Avatar';
import { Skjermlenke } from './Skjermlenke';
import type { KodeverkNavnFraKodeFnType } from '@k9-sak-web/lib/kodeverk/types/GetKodeverkNavnFraKodeFnType.js';
import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types/KodeverkType.js';

interface Props {
  behandlingLocation: Location;
  createLocationForSkjermlenke: (behandlingLocation: Location, skjermlenkeCode: string) => Location | undefined;
  getKodeverknavn: KodeverkNavnFraKodeFnType;
  historikkInnslag: HistorikkinnslagV2;
  kjønn: string;
  saksnummer: string;
}

export const Snakkeboble = ({
  behandlingLocation,
  createLocationForSkjermlenke,
  getKodeverknavn,
  historikkInnslag: { aktør, opprettetTidspunkt, tittel, linjer, dokumenter, skjermlenke },
  kjønn,
  saksnummer,
}: Props) => {
  const rolleNavn = getKodeverknavn(aktør.type.kode, KodeverkType.HISTORIKK_AKTOER);

  return (
    <Chat
      data-testid={`snakkeboble-${opprettetTidspunkt}`}
      avatar={<Avatar aktørType={aktør.type} kjønn={kjønn} />}
      timestamp={`${formatDate(opprettetTidspunkt)} // ${rolleNavn} ${aktør.ident || ''}`}
      position={utledPlassering(aktør.type)}
      toptextPosition="left"
      className={getStyle(aktør.type, kjønn)}
    >
      <Chat.Bubble>
        {tittel && <BodyShort size="small">{tittel}</BodyShort>}

        <Skjermlenke
          skjermlenke={skjermlenke}
          behandlingLocation={behandlingLocation}
          getKodeverknavn={getKodeverknavn}
          createLocationForSkjermlenke={createLocationForSkjermlenke}
        />

        {linjer.map((linje, index) => (
          <BodyLong key={`tekstlinje-${index}`} size="small">
            {linje.tekst && parseBoldText(linje.tekst)}
          </BodyLong>
        ))}

        {dokumenter && (
          <VStack gap="1">
            {dokumenter.map(dokumentLenke => (
              <HistorikkDokumentLenke
                key={`${dokumentLenke.tag}@${dokumentLenke.url}`}
                dokumentLenke={dokumentLenke}
                saksnummer={saksnummer}
              />
            ))}
          </VStack>
        )}
      </Chat.Bubble>
    </Chat>
  );
};
