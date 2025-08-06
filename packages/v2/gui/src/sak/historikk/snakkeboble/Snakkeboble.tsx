import { type Location } from 'history';

import { BodyLong, Chat, VStack } from '@navikt/ds-react';
import type { HistorikkinnslagV2 } from '../tilbake/historikkinnslagTsTypeV2.js';

import type { KodeverkNavnFraKodeFnType } from '@k9-sak-web/lib/kodeverk/types/GetKodeverkNavnFraKodeFnType.js';
import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types/KodeverkType.js';
import { Avatar } from './Avatar';
import { HistorikkDokumentLenke } from './HistorikkDokumentLenke';
import { Skjermlenke } from './Skjermlenke';
import { formatDate, getStyle, parseBoldText, utledPlassering } from './snakkebobleUtils';
import { Tittel } from './Tittel.js';

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
      timestamp={`${formatDate(opprettetTidspunkt)}`}
      name={`${rolleNavn} ${aktør.ident || ''}`}
      position={utledPlassering(aktør.type)}
      toptextPosition="left"
      className={getStyle(aktør.type, kjønn)}
    >
      <Chat.Bubble>
        {tittel && <Tittel>{tittel}</Tittel>}

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
          <VStack gap="space-4">
            {dokumenter.map(dokumentLenke => (
              <HistorikkDokumentLenke
                key={`${dokumentLenke.dokumentId}-${dokumentLenke.journalpostId}`}
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
