import axios, { AxiosResponse } from 'axios';
import { AlertStripeAdvarsel, AlertStripeFeil } from 'nav-frontend-alertstriper';
import React from 'react';
import Lenke from 'nav-frontend-lenker';
import { getPathToFplos } from '@k9-sak-web/sak-app/src/app/paths';
import styles from './punsjstripe.less';

export interface PunsjResponse {
  journalpostIder: JournalpostIder[];
  journalpostIderBarn: JournalpostIder[];
}

export interface JournalpostIder {
  journalpostId: string;
}

interface PunsjstripeProps {
  aktørId: string;
  aktørIdBarn: string;
  saksnummer?: string;
}

const Punsjstripe: React.FC<PunsjstripeProps> = ({ aktørId, saksnummer, aktørIdBarn }) => {
  const [punsjoppgaver, setPunsjoppgaver] = React.useState<PunsjResponse>(null);
  const [error, setError] = React.useState(null);
  const body = JSON.stringify({ aktorIdDto: { aktørId }, aktorIdDtoBarn: { aktørId: aktørIdBarn } });
  React.useEffect(() => {
    axios
      .post('/k9/sak/api/punsj/journalpost/uferdig', body)
      .then((response: AxiosResponse) => {
        setPunsjoppgaver(response.data);
      })
      .catch(err => setError(err));
  }, []);

  const harPunsjoppgaver = punsjoppgaver?.journalpostIder?.length > 0;

  if (error) {
    return <AlertStripeFeil>Får ikke kontakt med K9-Punsj</AlertStripeFeil>;
  }

  if (!harPunsjoppgaver) {
    return null;
  }
  const { journalpostIder, journalpostIderBarn } = punsjoppgaver;
  const getUløsteOppgaverText = (journalposter, subjekt: string) => {
    if (journalposter.length === 1) {
      const { journalpostId } = journalposter[0];
      return (
        <>
          <span>{`Det er 1 uløst oppgave tilknyttet ${subjekt} i Punsj.`}</span>
          <Lenke className={styles.oppgaveLenke} href={`${getPathToFplos()}?sok=${journalpostId}`}>
            Gå til oppgave
          </Lenke>
        </>
      );
    }
    return (
      <>
        <span>{`Det er ${journalposter.length} uløste oppgaver tilknyttet ${subjekt} i Punsj.`}</span>
        {journalposter.map(journalpostId => (
          <Lenke className={styles.oppgaveLenke} href={`${getPathToFplos()}?sok=${journalpostId}`}>
            {`Reserver journalpost ${journalpostId}`}
          </Lenke>
        ))}
      </>
    );
  };

  return (
    <>
      <AlertStripeAdvarsel>{getUløsteOppgaverText(journalpostIder, 'søkeren')}</AlertStripeAdvarsel>
      <AlertStripeAdvarsel>{getUløsteOppgaverText(journalpostIderBarn, 'barnet')}</AlertStripeAdvarsel>
    </>
  );
};
export default Punsjstripe;
