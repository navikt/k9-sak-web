import axios, { AxiosResponse } from 'axios';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import * as React from 'react';

export interface Punsjoppgaver {
  journalpostIder: JournalpostIder[];
}

export interface JournalpostIder {
  journalpostId: string;
}

const Punsjstripe = ({ aktørId }) => {
  const [punsjoppgaver, setPunsjoppgaver] = React.useState<Punsjoppgaver>(null);
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

  if (!harPunsjoppgaver || error) {
    return null;
  }
  const { journalpostIder } = punsjoppgaver;
  return <AlertStripeAdvarsel>{`Du har ${journalpostIder.length} uløste oppgaver i Punsj`}</AlertStripeAdvarsel>;
};
export default Punsjstripe;
