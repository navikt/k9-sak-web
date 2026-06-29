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
const oppgaveÅrsakNavn: Partial<Record<OppgaveÅrsak, string>> = {
  [OppgaveÅrsak.KONTAKT_BRUKER]: 'Kontakt bruker',
  [OppgaveÅrsak.VURDER_KONSEKVENS_YTELSE]: 'Vurder konsekvens for ytelse',
  [OppgaveÅrsak.VURDER_DOKUMENT]: 'Vurder dokument',
  [OppgaveÅrsak.VURDER_HENVENDELSE]: 'Vurder henvendelse',
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
    <Alert size="small" variant="info" className="mt-2">
      <VStack gap="space-6">
        <div>
          <BodyShort size="small">
            Det ligger åpne Gosys-oppgaver på søker.{' '}
            <Link href={getGosysUrl()} target="_blank" rel="noopener noreferrer" className="ml-0.5">
              Gå til Gosys
            </Link>
          </BodyShort>
          <BodyShort size="small">
            {visibleOppgavetyper.map((oppgavetype, index, arr) => (
              <span key={oppgavetype}>
                <Label size="small">{oppgaveÅrsakNavn[oppgavetype]}</Label>
                {index < arr.length - 1 ? ', ' : '.'}
              </span>
            ))}
          </BodyShort>
        </div>
      </VStack>
    </Alert>
  );
};

export default Gosysstripe;
