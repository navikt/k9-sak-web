import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Button, Chat, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { useSaksbehandlerOppslag } from '../../../shared/hooks/useSaksbehandlerOppslag.jsx';
import type { BeriketHistorikkInnslag } from '../api/HistorikkBackendApi.js';
import { Avatar } from './Avatar.jsx';
import { DokumentLenke } from './DokumentLenke.js';
import { Tittel } from './Tittel.js';
import { InnslagLinje, type InnslagLinjeProps } from './InnslagLinje.jsx';
import { Skjermlenke } from './Skjermlenke.js';
import { HistorikkAktør } from '@k9-sak-web/backend/combined/kodeverk/historikk/HistorikkAktør.js';
import styles from './innslagboble.module.css';
import { dateFormat, timeFormat } from '@navikt/ft-utils';
import type { AkselColor } from '@navikt/ds-react/types/theme';

export interface InnslagBobleProps {
  readonly innslag: BeriketHistorikkInnslag;
  readonly behandlingLocation: InnslagLinjeProps['behandlingLocation'];
  readonly saksnummer: string;
}

const aktørIkonPlassering = (aktør: HistorikkAktør): 'right' | 'left' => {
  switch (aktør) {
    case HistorikkAktør.SAKSBEHANDLER:
    case HistorikkAktør.VEDTAKSLØSNINGEN:
    case HistorikkAktør.BESLUTTER:
      return 'right';
    default:
      return 'left';
  }
};

const aktørFarge = (aktør: HistorikkAktør): AkselColor => {
  switch (aktør) {
    case HistorikkAktør.SAKSBEHANDLER:
      return 'meta-purple';
    case HistorikkAktør.BESLUTTER:
      return 'success';
    case HistorikkAktør.VEDTAKSLØSNINGEN:
      return 'neutral';
    case HistorikkAktør.ARBEIDSGIVER:
      return 'info';
    case HistorikkAktør.SØKER:
      return 'warning';
    default:
      return 'warning';
  }
};

const formatDate = (date: string) => `${dateFormat(date)} - ${timeFormat(date)}`;

export const InnslagBoble = ({ innslag, behandlingLocation, saksnummer }: InnslagBobleProps) => {
  const [expanded, setExpanded] = useState(false);
  const position = aktørIkonPlassering(innslag.aktør.type);
  // NB: Denne fungerer kun for saksbehandlere frå k9-sak. Saksbehandlere som kun har gjort noko i k9-tilbake eller k9-klage blir ikkje utleda.
  const { hentSaksbehandlerNavn } = useSaksbehandlerOppslag();
  const doCutOff = innslag.linjer.length > 2;
  return (
    <Chat
      data-testid={`snakkeboble-${innslag.opprettetTidspunkt}`}
      avatar={<Avatar aktørType={innslag.aktør.type} />}
      timestamp={`${innslag.opprettetTidspunkt != null ? formatDate(innslag.opprettetTidspunkt) : 'ukjent tid'}`}
      name={`${innslag.aktør.navn} ${hentSaksbehandlerNavn(innslag.aktør.ident ?? '')}`}
      position={position}
      toptextPosition="left"
      className={position === 'right' ? styles.chatRight : ''}
      data-color={aktørFarge(innslag.aktør.type)}
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
              <DokumentLenke
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
