import { Link } from 'react-router';

import { BigError } from '@k9-sak-web/gui/sak/feilmeldinger/BigError.js';

/**
 * ForbiddenPage
 *
 * Presentasjonskomponent. Denne komponenten vises når den NAV-ansatte prøver å aksessere en url som ikke finnes.
 * Det blir presentert en generell feilmelding og en lenke som tar NAV-ansatt tilbake til hovedsiden.
 */
const ForbiddenPage = () => (
  <BigError title="Du har ikke tilgang til å slå opp denne personen">
    <Link to="/">Gå til forsiden</Link>
  </BigError>
);

export default ForbiddenPage;
