import { type HistorikkinnslagDtoV2 } from '@k9-sak-web/backend/k9sak/generated';
import { Chat, VStack } from '@navikt/ds-react';
import { Avatar } from '../snakkeboble/Avatar.jsx';
import type { Kjønn } from '@k9-sak-web/backend/k9sak/kodeverk/Kjønn.js';
import { formatDate, getStyle, utledPlassering } from '../snakkeboble/snakkebobleUtils.jsx';
import { Tittel } from '../snakkeboble/Tittel.jsx';
import { InnslagLinje, type InnslagLinjeProps } from './InnslagLinje.jsx';
import { HistorikkDokumentLenke } from '../snakkeboble/HistorikkDokumentLenke.jsx';
import type { K9Kodeverkoppslag } from '../../../kodeverk/oppslag/useK9Kodeverkoppslag.jsx';

export interface InnslagBobleProps {
  readonly innslag: HistorikkinnslagDtoV2;
  readonly kjønn: Kjønn;
  readonly behandlingLocation: InnslagLinjeProps['behandlingLocation'];
  readonly createLocationForSkjermlenke: InnslagLinjeProps['createLocationForSkjermlenke'];
  readonly saksnummer: string;
  readonly kodeverkoppslag: K9Kodeverkoppslag; // <- Kan erstattast med useContext når samanlikningssjekk er fjerna
}

export const InnslagBoble = ({
  innslag,
  kjønn,
  behandlingLocation,
  createLocationForSkjermlenke,
  saksnummer,
  kodeverkoppslag,
}: InnslagBobleProps) => {
  const rolleNavn = kodeverkoppslag.k9sak.historikkAktører(innslag.aktør.type).navn;
  const position = utledPlassering(innslag.aktør.type);
  return (
    <Chat
      data-testid={`snakkeboble-${innslag.opprettetTidspunkt}`}
      avatar={<Avatar aktørType={innslag.aktør.type} kjønn={kjønn} />}
      timestamp={`${formatDate(innslag.opprettetTidspunkt)}`}
      name={`${rolleNavn} ${innslag.aktør.ident ?? ''}`}
      position={position}
      toptextPosition="left"
      className={getStyle(innslag.aktør.type, kjønn)}
    >
      <Chat.Bubble>
        {innslag.tittel != null ? <Tittel>{innslag.tittel}</Tittel> : null}

        {innslag.linjer.map((linje, idx) => (
          <div key={idx}>
            <InnslagLinje
              linje={linje}
              behandlingLocation={behandlingLocation}
              createLocationForSkjermlenke={createLocationForSkjermlenke}
              kodeverkoppslag={kodeverkoppslag}
            />
          </div>
        ))}

        {innslag.dokumenter != null ? (
          <VStack gap="1">
            {innslag.dokumenter.map(dokument => (
              <HistorikkDokumentLenke
                key={`${dokument.dokumentId}-${dokument.journalpostId}`}
                dokumentLenke={dokument}
                saksnummer={saksnummer}
              />
            ))}
          </VStack>
        ) : null}
      </Chat.Bubble>
    </Chat>
  );
};
