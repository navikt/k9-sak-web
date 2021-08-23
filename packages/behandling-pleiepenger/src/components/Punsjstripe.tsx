import axios from 'axios';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import * as React from 'react';

const Punsjstripe = ({ aktørId }) => {
  const [punsjoppgaver, setPunsjoppgaver] = React.useState([]);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    axios
      .get(`/k9/sak/api/punsj/journalpost/uferdig?aktoerId=${aktørId}`)
      .then(({ data }) => {
        setPunsjoppgaver(data);
      })
      .catch(err => setError(err));
  }, []);

  if (!punsjoppgaver || punsjoppgaver?.length === 0 || error) {
    return null;
  }
  return <AlertStripeAdvarsel>{`Du har ${punsjoppgaver?.length} uløste oppgaver i Punsj`}</AlertStripeAdvarsel>;
};
export default Punsjstripe;
