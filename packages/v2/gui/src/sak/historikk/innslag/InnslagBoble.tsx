import { HistorikkAktør } from '@k9-sak-web/backend/combined/kodeverk/historikk/HistorikkAktør.js';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Button, Chat, VStack } from '@navikt/ds-react';
import { dateFormat, timeFormat } from '@navikt/ft-utils';
import { useState } from 'react';
import { useSaksbehandlerOppslag } from '../../../shared/hooks/useSaksbehandlerOppslag.jsx';
import type { BeriketHistorikkInnslag } from '../api/HistorikkBackendApi.js';
import { Avatar } from './Avatar.jsx';
import { DokumentLenke } from './DokumentLenke.js';
import styles from './innslagboble.module.css';
import { InnslagLinje, type InnslagLinjeProps } from './InnslagLinje.jsx';
import { Skjermlenke } from './Skjermlenke.js';
import { Tittel } from './Tittel.js';

export interface InnslagBobleProps {
  readonly innslag: BeriketHistorikkInnslag;
  readonly behandlingLocation: InnslagLinjeProps['behandlingLocation'];
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

const aktørFarge = (aktør: HistorikkAktør) => {
  switch (aktør) {
    case HistorikkAktør.SAKSBEHANDLER:
      return 'meta-purple';
    case HistorikkAktør.BESLUTTER:
      return 'meta-lime';
    case HistorikkAktør.VEDTAKSLØSNINGEN:
      return 'neutral';
    case HistorikkAktør.ARBEIDSGIVER:
      return 'brand-blue';
    case HistorikkAktør.SØKER:
      return 'brand-beige';
    default:
      return 'brand-beige';
  }
};

const formatDate = (date: string) => `${dateFormat(date)} - ${timeFormat(date)}`;

const antallLinjerSomAlltidVises = 2;

export const InnslagBoble = ({ innslag, behandlingLocation }: InnslagBobleProps) => {
  const [expanded, setExpanded] = useState(false);
  const position = aktørIkonPlassering(innslag.aktør.type);
  // NB: Denne fungerer kun for saksbehandlere frå k9-sak. Saksbehandlere som kun har gjort noko i k9-tilbake eller k9-klage blir ikkje utleda.
  const { hentSaksbehandlerNavn } = useSaksbehandlerOppslag();
  const doCutOff = innslag.linjer.length > antallLinjerSomAlltidVises;
  const innslagHarSkjermlenke = innslag.skjermlenke != null;
  const bådeTittelOgSkjermlenke = innslagHarSkjermlenke && innslag.tittel != null;
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
    >
      <Chat.Bubble>
        <Tittel>
          {innslagHarSkjermlenke ? (
            <Skjermlenke skjermlenke={innslag.skjermlenke} behandlingLocation={behandlingLocation} />
          ) : null}
          {bådeTittelOgSkjermlenke ? `: ` : null}
          {innslag.tittel != null ? innslag.tittel : null}
        </Tittel>
        {innslag.linjer.map((linje, idx) => (
          <div key={idx} hidden={doCutOff && !expanded && idx > antallLinjerSomAlltidVises - 1}>
            <InnslagLinje linje={linje} behandlingLocation={behandlingLocation} />
          </div>
        ))}

        {innslag.dokumenter != null ? (
          <VStack gap="space-4">
            {innslag.dokumenter.map(dokument => (
              <DokumentLenke key={`${dokument.dokumentId}-${dokument.journalpostId}`} dokumentLink={dokument} />
            ))}
          </VStack>
        ) : null}

        {doCutOff ? (
          <Button
            data-color="neutral"
            type="button"
            onClick={() => setExpanded(!expanded)}
            icon={expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
            variant="tertiary"
            size="xsmall"
          >
            {expanded ? 'Vis mindre' : 'Vis alt'}
          </Button>
        ) : null}
      </Chat.Bubble>
    </Chat>
  );
};
