import { OppgaveÅrsak } from '@k9-sak-web/backend/k9sak/kontrakt/oppgave/OppgaveÅrsak.js';
import { BodyShort, InfoCard, Label, Link, VStack } from '@navikt/ds-react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import type { K9StatusBackendApi } from '../K9StatusBackendApi';
import { getGosysUrl } from '@k9-sak-web/lib/paths/paths.js';
import styles from './gosysstripe.module.css';
import { ExclamationmarkTriangleIcon, InformationSquareFillIcon } from '@navikt/aksel-icons';

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
      <InfoCard size="small" data-color="warning" className={styles.ingenAvrunding}>
        <InfoCard.Message className={styles.ingenAvrunding} icon={<ExclamationmarkTriangleIcon fontSize="1.5rem" />}>
          Får ikke hentet Gosys-oppgaver
        </InfoCard.Message>
      </InfoCard>
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
    <InfoCard data-color="info" size="small" className={styles.ingenAvrunding}>
      <InfoCard.Message
        className={styles.ingenAvrunding}
        icon={<InformationSquareFillIcon fontSize="1.5rem" className="mt-[3px]" />}
      >
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
      </InfoCard.Message>
    </InfoCard>
  );
};

export default Gosysstripe;
