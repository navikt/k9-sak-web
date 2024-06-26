import { Alert, Link } from '@navikt/ds-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import styles from './punsjstripe.module.css';

export interface PunsjResponse {
  journalpostIder: JournalpostIder[];
  journalpostIderBarn: JournalpostIder[];
}

export interface JournalpostIder {
  journalpostId: string;
}

interface PunsjstripeProps {
  saksnummer: string;
  pathToLos: string;
}

const Punsjstripe: React.FC<PunsjstripeProps> = ({ saksnummer, pathToLos }) => {
  const { data: punsjoppgaver, error } = useQuery<PunsjResponse>({
    queryKey: ['punsjoppgaver', saksnummer],
    queryFn: async ({ signal }) => {
      const response = await axios.get(`/k9/sak/api/punsj/journalpost/uferdig/v2?saksnummer=${saksnummer}`, { signal });
      return response.data;
    },
  });

  const harPunsjoppgaver = punsjoppgaver?.journalpostIder?.length > 0 || punsjoppgaver?.journalpostIderBarn?.length > 0;

  if (error) {
    return (
      <Alert size="small" variant="error">
        Får ikke kontakt med K9-Punsj
      </Alert>
    );
  }

  if (!harPunsjoppgaver) {
    return null;
  }
  const { journalpostIder, journalpostIderBarn } = punsjoppgaver;
  const getUløsteOppgaverText = (journalposter, subjekt: string) => {
    if (!journalposter.length) {
      return null;
    }
    if (journalposter.length === 1) {
      const { journalpostId } = journalposter[0];
      return (
        <>
          <span>{`Det er 1 uløst oppgave tilknyttet ${subjekt} i Punsj.`}</span>
          <Link className={styles.oppgaveLenke} href={`${pathToLos}?sok=${journalpostId}`} target="_blank">
            Gå til oppgave
          </Link>
        </>
      );
    }
    const flereIListen = journalposter.length > 1;
    return (
      <>
        <span>{`Det er ${journalposter.length} uløste oppgaver tilknyttet ${subjekt} i Punsj.`}</span>
        <div>
          Reserver journalposter:
          {journalposter.map(({ journalpostId }, index) => (
            <>
              <Link className={styles.oppgaveLenke} href={`${pathToLos}?sok=${journalpostId}`} target="_blank">
                {`${journalpostId}`}
              </Link>
              {`${flereIListen && journalposter.length !== index + 1 ? ',' : '.'}`}
            </>
          ))}
        </div>
      </>
    );
  };

  return (
    <Alert size="small" variant="warning">
      <div>{getUløsteOppgaverText(journalpostIder, 'søkeren')}</div>
      <div className="marginTop">{getUløsteOppgaverText(journalpostIderBarn, 'barnet')}</div>
    </Alert>
  );
};
export default Punsjstripe;
