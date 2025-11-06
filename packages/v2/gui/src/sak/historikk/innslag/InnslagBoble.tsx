import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Button, Chat, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { useSaksbehandlerOppslag } from '../../../shared/hooks/useSaksbehandlerOppslag.jsx';
import type { BeriketHistorikkInnslag } from '../api/HistorikkBackendApi.js';
import { Avatar } from './Avatar.jsx';
import { HistorikkDokumentLenke } from '../snakkeboble/HistorikkDokumentLenke.jsx';
import { formatDate, getColor, getStyle, utledPlassering } from '../snakkeboble/snakkebobleUtils.jsx';
import { Tittel } from '../snakkeboble/Tittel.jsx';
import { InnslagLinje, type InnslagLinjeProps } from './InnslagLinje.jsx';
import { Skjermlenke } from './Skjermlenke.js';

export interface InnslagBobleProps {
  readonly innslag: BeriketHistorikkInnslag;
  readonly behandlingLocation: InnslagLinjeProps['behandlingLocation'];
  readonly saksnummer: string;
}

export const InnslagBoble = ({ innslag, behandlingLocation, saksnummer }: InnslagBobleProps) => {
  const [expanded, setExpanded] = useState(false);
  const rolleNavn = innslag.aktør.navn;
  const position = utledPlassering(innslag.aktør.type);
  // NB: Denne fungerer kun for saksbehandlere frå k9-sak. Saksbehandlere som kun har gjort noko i k9-tilbake eller k9-klage blir ikkje utleda.
  const { hentSaksbehandlerNavn } = useSaksbehandlerOppslag();
  const doCutOff = innslag.linjer.length > 2;
  return (
    <Chat
      data-testid={`snakkeboble-${innslag.opprettetTidspunkt}`}
      avatar={<Avatar aktørType={innslag.aktør.type} />}
      timestamp={`${innslag.opprettetTidspunkt != null ? formatDate(innslag.opprettetTidspunkt) : 'ukjent tid'}`}
      name={`${rolleNavn} ${hentSaksbehandlerNavn(innslag.aktør.ident ?? '')}`}
      position={position}
      toptextPosition="left"
      className={getStyle(innslag.aktør.type)}
      data-color={getColor(innslag.aktør.type)}
      variant="neutral"
    >
      <Chat.Bubble>
        {innslag.tittel != null ? <Tittel>{innslag.tittel}</Tittel> : null}
        {'skjermlenke' in innslag && innslag.skjermlenke != null && innslag.skjermlenke.navn != null ? (
          <Skjermlenke skjermlenke={innslag.skjermlenke} behandlingLocation={behandlingLocation} />
        ) : null}
        {innslag.linjer.map((linje, idx) => (
          <div key={idx} hidden={doCutOff && !expanded && idx > 0}>
            <InnslagLinje linje={linje} behandlingLocation={behandlingLocation} />
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
