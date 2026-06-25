import { OppgaveÅrsak } from '@k9-sak-web/backend/k9sak/kontrakt/oppgave/OppgaveÅrsak.js';
import { Alert, BodyShort, Label, Link, VStack } from '@navikt/ds-react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import type { K9StatusBackendApi } from '../K9StatusBackendApi';
import { getGosysUrl } from '@k9-sak-web/lib/paths/paths.js';

interface GosysstripeProps {
  saksnummer: string;
  api: K9StatusBackendApi;
}

// Endepunktet (k9-sak OppgaveRestTjeneste) filtrerer til kun disse fire oppgavetypene,
// og returnerer de av dem som er åpne. Øvrige OppgaveÅrsak-verdier kan ikke forekomme her.
// VURDER_HENVENDELSE vises ikke i stripa.
const oppgaveÅrsakNavn: Partial<Record<OppgaveÅrsak, string>> = {
  [OppgaveÅrsak.KONTAKT_BRUKER]: 'Kontakt bruker',
  [OppgaveÅrsak.VURDER_KONSEKVENS_YTELSE]: 'Vurder konsekvens for ytelse',
  [OppgaveÅrsak.VURDER_DOKUMENT]: 'Vurder dokument',
};

const Gosysstripe: React.FC<GosysstripeProps> = ({ saksnummer, api }) => {
  const {
    data: oppgavetyper,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ['gosysoppgaver', saksnummer],
    queryFn: () => api.getÅpneGosysOppgaver(saksnummer),
    initialData: [],
    throwOnError: false,
  });

  if (error) {
    return (
      <Alert size="small" variant="error">
        Får ikke hentet Gosys-oppgaver
      </Alert>
    );
  }

  if (!isSuccess || oppgavetyper.length === 0) {
    return null;
  }

  const visibleOppgavetyper = [...new Set(oppgavetyper)].filter(type => type in oppgaveÅrsakNavn);

  if (visibleOppgavetyper.length === 0) {
    return null;
  }
  return (
    <Alert size="small" variant="info">
      <VStack gap="space-6">
        <div>
          <BodyShort size="small">Det ligger åpne Gosys-oppgaver på søker.</BodyShort>
          <BodyShort size="small">
            {visibleOppgavetyper.map((oppgavetype, index, arr) => (
              <span key={oppgavetype}>
                <Label size="small">{oppgaveÅrsakNavn[oppgavetype]}</Label>
                {index < arr.length - 1 ? ', ' : '.'}
              </span>
            ))}
          </BodyShort>
        </div>

        <Link href={getGosysUrl()} target="_blank">
          Gå til Gosys
        </Link>
      </VStack>
    </Alert>
  );
};

export default Gosysstripe;
