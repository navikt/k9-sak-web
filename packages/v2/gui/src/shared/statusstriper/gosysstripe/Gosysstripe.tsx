import { OppgaveÅrsak } from '@k9-sak-web/backend/k9sak/kontrakt/oppgave/OppgaveÅrsak.js';
import { Alert, BodyShort, Label } from '@navikt/ds-react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import type { K9StatusBackendApi } from '../K9StatusBackendApi';

interface GosysstripeProps {
  saksnummer: string;
  api: K9StatusBackendApi;
}

// Endepunktet (k9-sak OppgaveRestTjeneste) filtrerer til kun disse fire oppgavetypene,
// og returnerer de av dem som er åpne. Øvrige OppgaveÅrsak-verdier kan ikke forekomme her.
const oppgaveÅrsakNavn: Partial<Record<OppgaveÅrsak, string>> = {
  [OppgaveÅrsak.KONTAKT_BRUKER]: 'Kontakt bruker',
  [OppgaveÅrsak.VURDER_HENVENDELSE]: 'Vurder henvendelse',
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

  return (
    <Alert size="small" variant="info">
      <BodyShort>Det ligger åpne Gosys-oppgaver på denne saken.</BodyShort>
      <BodyShort>
        {[...new Set(oppgavetyper)].map((oppgavetype, index, arr) => (
          <React.Fragment key={oppgavetype}>
            <Label>{oppgaveÅrsakNavn[oppgavetype] ?? oppgavetype}</Label>
            {index < arr.length - 1 ? ', ' : '.'}
          </React.Fragment>
        ))}
      </BodyShort>
    </Alert>
  );
};

export default Gosysstripe;
