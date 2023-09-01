import axios, { AxiosResponse } from 'axios';
import React, { useMemo } from 'react';

import { Link } from '@navikt/ds-react';
import { AlertStripeAdvarsel, AlertStripeFeil } from 'nav-frontend-alertstriper';

import styles from './punsjstripe.module.css';

export interface PunsjResponse {
  journalpostIder: JournalpostIder[];
  journalpostIderBarn: JournalpostIder[];
}

export interface JournalpostIder {
  journalpostId: string;
}

interface PunsjstripeProps {
  behandlingUuid: string;
  pathToLos: string;
}

const Punsjstripe: React.FC<PunsjstripeProps> = ({ behandlingUuid, pathToLos }) => {
  const [punsjoppgaver, setPunsjoppgaver] = React.useState<PunsjResponse>(null);
  const [error, setError] = React.useState(null);
  const httpCanceler = useMemo(() => axios.CancelToken.source(), []);
  React.useEffect(() => {
    let isMounted = true;
    axios
      .get(`/k9/sak/api/punsj/journalpost/uferdig?behandlingUuid=${behandlingUuid}`, {
        cancelToken: httpCanceler.token,
      })
      .then((response: AxiosResponse) => {
        if (isMounted) {
          setPunsjoppgaver(response.data);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err);
        }
      });

    return () => {
      isMounted = false;
      httpCanceler.cancel();
    };
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
    <AlertStripeAdvarsel>
      <div>{getUløsteOppgaverText(journalpostIder, 'søkeren')}</div>
      <div className="marginTop">{getUløsteOppgaverText(journalpostIderBarn, 'barnet')}</div>
    </AlertStripeAdvarsel>
  );
};
export default Punsjstripe;
