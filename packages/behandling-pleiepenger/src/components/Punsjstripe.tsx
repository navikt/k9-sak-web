import * as React from 'react';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import axios from 'axios';

const Punsjstripe = ({ aktørId }) => {
  const [punsjoppgaver, setPunsjoppgaver] = React.useState([]);

  React.useEffect(() => {
    axios
      .get(`/k9-punsj/journalpost/uferdig/${aktørId}`)
      .then(({ data }) => {
        setPunsjoppgaver(data);
      })
      .catch();
  }, []);

  if (!punsjoppgaver || punsjoppgaver?.length === 0) {
    return null;
  }
  return <AlertStripeAdvarsel>{`Du har ${punsjoppgaver?.length} uløste oppgaver i Punsj`}</AlertStripeAdvarsel>;
};
export default Punsjstripe;
