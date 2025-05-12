import { BigError } from './BigError.js';
import { Link } from 'react-router';

/**
 * UnauthorizedPage
 *
 * Presentasjonskomponent. Denne komponenten vises når den NAV-ansatte prøver å aksessere en url som ikke finnes.
 * Det blir presentert en generell feilmelding og en lenke som tar NAV-ansatt tilbake til hovedsiden.
 */
const UnauthorizedPage = () => (
  <BigError title="Du må logge inn for å få tilgang til systemet">
    <Link to="/" reloadDocument>
      Gå til innloggingssiden
    </Link>
  </BigError>
);

export default UnauthorizedPage;
