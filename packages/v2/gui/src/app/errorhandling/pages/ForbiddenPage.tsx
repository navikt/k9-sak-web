import { Link } from 'react-router';

import { BigError } from '../feilmeldinger/BigError.js';
import ErrorBoundary from '../boundary/ErrorBoundary.js';

/**
 * ForbiddenPage
 *
 * Presentasjonskomponent. Denne komponenten vises når den NAV-ansatte prøver å aksessere en url som ikke finnes.
 * Det blir presentert en generell feilmelding og en lenke som tar NAV-ansatt tilbake til hovedsiden.
 */
const ForbiddenPage = () => (
  <ErrorBoundary>
    <BigError title="Du har ikke tilgang til å slå opp denne personen">
      <Link to="/">Gå til forsiden</Link>
    </BigError>
  </ErrorBoundary>
);

export default ForbiddenPage;
