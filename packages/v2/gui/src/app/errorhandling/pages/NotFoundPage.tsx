import { BigError } from './BigError.js';
import { Link } from 'react-router';

/**
 * NotFoundPage
 *
 * Presentasjonskomponent. Denne komponenten vises når den NAV-ansatte prøver å aksessere en url som ikke finnes.
 * Det blir presentert en generell feilmelding og en lenke som tar NAV-ansatt tilbake til hovedsiden.
 */
const NotFoundPage = () => (
  <BigError title="Beklager, vi finner ikke siden du leter etter.">
    <Link to="/">Gå til forsiden</Link>
  </BigError>
);

export default NotFoundPage;
