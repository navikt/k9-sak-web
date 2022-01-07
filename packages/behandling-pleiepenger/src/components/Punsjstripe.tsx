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
  behandlingUuid: string;
}

const Punsjstripe: React.FC<PunsjstripeProps> = ({ behandlingUuid }) => {
  const [punsjoppgaver, setPunsjoppgaver] = React.useState<PunsjResponse>(null);
  const [error, setError] = React.useState(null);
  React.useEffect(() => {
    axios
      .get(`/k9/sak/api/punsj/journalpost/uferdig?behandlingUuid=${behandlingUuid}`)
      .then((response: AxiosResponse) => {
        setPunsjoppgaver(response.data);
      })
      .catch(err => setError(err));
  }, []);

  const harPunsjoppgaver = punsjoppgaver?.journalpostIder?.length > 0 || punsjoppgaver?.journalpostIderBarn?.length > 0;

  if (error) {
    return <AlertStripeFeil>Får ikke kontakt med K9-Punsj</AlertStripeFeil>;
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
          <Lenke className={styles.oppgaveLenke} href={`${getPathToFplos()}?sok=${journalpostId}`}>
            Gå til oppgave
          </Lenke>
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
              <Lenke className={styles.oppgaveLenke} href={`${getPathToFplos()}?sok=${journalpostId}`}>
                {`${journalpostId}`}
              </Lenke>
              {`${flereIListen && journalposter.length !== index + 1 ? ',' : '.'}`}
            </>
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      <AlertStripeAdvarsel>
        <div>{getUløsteOppgaverText(journalpostIder, 'søkeren')}</div>
        <div className="marginTop">{getUløsteOppgaverText(journalpostIderBarn, 'barnet')}</div>
      </AlertStripeAdvarsel>
    </>
  );
};
export default Punsjstripe;
