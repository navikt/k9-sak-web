import type { k9_sak_kontrakt_dokument_JournalpostIdDto as JournalpostIdDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { Alert, Link } from '@navikt/ds-react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import type { K9StatusBackendApi } from '../K9StatusBackendApi';
import styles from './punsjstripe.module.css';

interface PunsjstripeProps {
  saksnummer: string;
  pathToLos: string;
  api: K9StatusBackendApi;
}

const Punsjstripe: React.FC<PunsjstripeProps> = ({ saksnummer, pathToLos, api }) => {
  const { data: punsjoppgaver, error } = useQuery({
    queryKey: ['punsjoppgaver', saksnummer],
    queryFn: async () => {
      const data = await api.getUferdigePunsjoppgaver(saksnummer);
      return data || {};
    },
  });

  const harPunsjoppgaver =
    (punsjoppgaver?.journalpostIder && punsjoppgaver?.journalpostIder?.length > 0) ||
    (punsjoppgaver?.journalpostIderBarn && punsjoppgaver?.journalpostIderBarn?.length > 0);

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
  const getUløsteOppgaverText = (journalposter: JournalpostIdDto[] | undefined, subjekt: string) => {
    if (!journalposter?.length) {
      return null;
    }
    if (journalposter.length === 1 && journalposter[0]) {
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
