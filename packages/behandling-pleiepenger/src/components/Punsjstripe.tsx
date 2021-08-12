import * as React from 'react';
import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
import axios from 'axios';

const Punsjstripe = ({ aktørId }) => {
  const [punsjoppgaver, setPunsjoppgaver] = React.useState([]);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    axios
      .get(`/k9-punsj/journalpost/uferdig/${aktørId}`)
      .then(({ data }) => {
        setPunsjoppgaver(data);
      })
      .catch(e => setError(e));
  }, []);

  // MIDLERTIDIG LØSNING FOR TEST i Q
  if (error) {
    return <AlertStripeInfo>{error}</AlertStripeInfo>;
  }

  if (!punsjoppgaver || punsjoppgaver?.length === 0) {
    return null;
  }
  return <AlertStripeAdvarsel>{`Du har ${punsjoppgaver.length} uløste oppgaver i Punsj`}</AlertStripeAdvarsel>;
};
export default Punsjstripe;
