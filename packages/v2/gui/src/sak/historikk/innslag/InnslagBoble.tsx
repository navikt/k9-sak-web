import { type HistorikkinnslagDtoV2 } from '@k9-sak-web/backend/k9sak/generated';
import { Chat, VStack, Button } from '@navikt/ds-react';
import { Avatar } from '../snakkeboble/Avatar.jsx';
import type { Kjønn } from '@k9-sak-web/backend/k9sak/kodeverk/Kjønn.js';
import { formatDate, getStyle, utledPlassering } from '../snakkeboble/snakkebobleUtils.jsx';
import { Tittel } from '../snakkeboble/Tittel.jsx';
import { InnslagLinje, type InnslagLinjeProps } from './InnslagLinje.jsx';
import { HistorikkDokumentLenke } from '../snakkeboble/HistorikkDokumentLenke.jsx';
import type { K9Kodeverkoppslag } from '../../../kodeverk/oppslag/useK9Kodeverkoppslag.jsx';
import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { useSaksbehandlerOppslag } from '../../../shared/hooks/useSaksbehandlerOppslag.jsx';

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
  const [expanded, setExpanded] = useState(false);
  // NB: Denne fungerer kun for saksbehandlere frå k9-sak. Saksbehandlere som kun har gjort noko i k9-tilbake eller k9-klage blir ikkje utleda.
  const { hentSaksbehandlerNavn } = useSaksbehandlerOppslag();
  const rolleNavn = kodeverkoppslag.k9sak.historikkAktører(innslag.aktør.type).navn;
  const position = utledPlassering(innslag.aktør.type);
  const doCutOff = innslag.linjer.length > 2;
  return (
    <Chat
      data-testid={`snakkeboble-${innslag.opprettetTidspunkt}`}
      avatar={<Avatar aktørType={innslag.aktør.type} kjønn={kjønn} />}
      timestamp={`${formatDate(innslag.opprettetTidspunkt)}`}
      name={`${rolleNavn} ${hentSaksbehandlerNavn(innslag.aktør.ident ?? '')}`}
      position={position}
      toptextPosition="left"
      className={getStyle(innslag.aktør.type, kjønn)}
    >
      <Chat.Bubble>
        {innslag.tittel != null ? <Tittel>{innslag.tittel}</Tittel> : null}

        {innslag.linjer.map((linje, idx) => (
          <div key={idx} hidden={doCutOff && !expanded && idx > 0}>
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
