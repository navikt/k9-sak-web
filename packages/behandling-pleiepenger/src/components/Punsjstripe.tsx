import axios, { AxiosResponse } from 'axios';
import { AlertStripeAdvarsel, AlertStripeFeil } from 'nav-frontend-alertstriper';
import React from 'react';
import Lenke from 'nav-frontend-lenker';
import { getPathToFplos } from '@k9-sak-web/sak-app/src/app/paths';

export interface PunsjResponse {
  journalpostIder: JournalpostIder[];
}

export interface JournalpostIder {
  journalpostId: string;
}

interface PunsjstripeProps {
  aktørId: string;
  saksnummer: string;
}

const Punsjstripe: React.FC<PunsjstripeProps> = ({ aktørId, saksnummer }) => {
  const [punsjoppgaver, setPunsjoppgaver] = React.useState<PunsjResponse>(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    axios
      .get(`/k9/sak/api/punsj/journalpost/uferdig?aktoerId=${aktørId}`)
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
  const getUløsteOppgaverText = () => {
    const { journalpostIder } = punsjoppgaver;
    if (journalpostIder.length === 1) {
      return 'Det er 1 uløst oppgave tilknyttet søkeren i Punsj.';
    }
    return `Det er ${journalpostIder.length} uløste oppgaver tilknyttet søkeren i Punsj.`;
  };

  return (
    <AlertStripeAdvarsel>
      {`${getUløsteOppgaverText()} `}
      <Lenke href={`${getPathToFplos()}?sok=${saksnummer}`}>Gå til oppgave</Lenke>
    </AlertStripeAdvarsel>
  );
};
export default Punsjstripe;
