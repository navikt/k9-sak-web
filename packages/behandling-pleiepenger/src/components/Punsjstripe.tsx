import axios, { AxiosResponse } from 'axios';
import { AlertStripeAdvarsel, AlertStripeFeil } from 'nav-frontend-alertstriper';
import * as React from 'react';

export interface PunsjResponse {
  journalpostIder: JournalpostIder[];
}

export interface JournalpostIder {
  journalpostId: string;
}

const Punsjstripe = ({ aktørId }) => {
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
  const { journalpostIder } = punsjoppgaver;
  return <AlertStripeAdvarsel>{`Du har ${journalpostIder.length} uløste oppgaver i Punsj`}</AlertStripeAdvarsel>;
};
export default Punsjstripe;
