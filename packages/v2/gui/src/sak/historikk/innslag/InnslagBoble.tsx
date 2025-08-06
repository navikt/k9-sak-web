import type { Kjønn } from '@k9-sak-web/backend/k9sak/kodeverk/Kjønn.js';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Button, Chat, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { useSaksbehandlerOppslag } from '../../../shared/hooks/useSaksbehandlerOppslag.jsx';
import type { KlageHistorikkInnslagV2, SakHistorikkInnslagV2 } from '../historikkTypeBerikning.js';
import { Avatar } from '../snakkeboble/Avatar.jsx';
import { HistorikkDokumentLenke } from '../snakkeboble/HistorikkDokumentLenke.jsx';
import { formatDate, getStyle, utledPlassering } from '../snakkeboble/snakkebobleUtils.jsx';
import { Tittel } from '../snakkeboble/Tittel.jsx';
import { InnslagLinje, type InnslagLinjeProps } from './InnslagLinje.jsx';

export interface InnslagBobleProps {
  readonly innslag: SakHistorikkInnslagV2 | KlageHistorikkInnslagV2;
  readonly kjønn: Kjønn;
  readonly behandlingLocation: InnslagLinjeProps['behandlingLocation'];
  readonly createLocationForSkjermlenke: InnslagLinjeProps['createLocationForSkjermlenke'];
  readonly saksnummer: string;
}

export const InnslagBoble = ({
  innslag,
  kjønn,
  behandlingLocation,
  createLocationForSkjermlenke,
  saksnummer,
}: InnslagBobleProps) => {
  const [expanded, setExpanded] = useState(false);
  const rolleNavn = innslag.aktør.type.navn;
  const position = utledPlassering(innslag.aktør.type.kilde);
  // NB: Denne fungerer kun for saksbehandlere frå k9-sak. Saksbehandlere som kun har gjort noko i k9-tilbake eller k9-klage blir ikkje utleda.
  const { hentSaksbehandlerNavn } = useSaksbehandlerOppslag();
  const doCutOff = innslag.linjer.length > 2;
  return (
    <Chat
      data-testid={`snakkeboble-${innslag.opprettetTidspunkt}`}
      avatar={<Avatar aktørType={innslag.aktør.type.kilde} kjønn={kjønn} />}
      timestamp={`${formatDate(innslag.opprettetTidspunkt)}`}
      name={`${rolleNavn} ${hentSaksbehandlerNavn(innslag.aktør.ident ?? '')}`}
      position={position}
      toptextPosition="left"
      className={getStyle(innslag.aktør.type.kilde, kjønn)}
    >
      <Chat.Bubble>
        {innslag.tittel != null ? <Tittel>{innslag.tittel}</Tittel> : null}

        {innslag.linjer.map((linje, idx) => (
          <div key={idx} hidden={doCutOff && !expanded && idx > 0}>
            <InnslagLinje
              linje={linje}
              behandlingLocation={behandlingLocation}
              createLocationForSkjermlenke={createLocationForSkjermlenke}
            />
          </div>
        ))}

        {innslag.dokumenter != null ? (
          <VStack gap="space-4">
            {innslag.dokumenter.map(dokument => (
              <HistorikkDokumentLenke
                key={`${dokument.dokumentId}-${dokument.journalpostId}`}
                dokumentLenke={dokument}
                saksnummer={saksnummer}
              />
            ))}
          </VStack>
        ) : null}

        {doCutOff ? (
          <Button
            type="button"
            onClick={() => setExpanded(!expanded)}
            icon={expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
            variant="tertiary-neutral"
            size="xsmall"
          >
            {expanded ? 'Vis mindre' : 'Vis alt'}
          </Button>
        ) : null}
      </Chat.Bubble>
    </Chat>
  );
};
