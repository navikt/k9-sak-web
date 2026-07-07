import { List, VStack } from '@navikt/ds-react';
import { Link } from 'react-router';

import { BigError } from '@k9-sak-web/gui/app/errorhandling/pages/BigError.js';
import {
  resolveÅrsakIkkeTilgangTekster,
  type ÅrsakIkkeTilgang,
} from '@k9-sak-web/backend/shared/errorhandling/ÅrsakIkkeTilgang.js';

interface ForbiddenPageProps {
  ikkeTilgangÅrsaker?: ÅrsakIkkeTilgang[];
}

const ForbiddenPage = ({ ikkeTilgangÅrsaker }: ForbiddenPageProps) => {
  const årsakstekster = resolveÅrsakIkkeTilgangTekster(ikkeTilgangÅrsaker);

  return (
    <BigError title="Du har ikke tilgang til denne saken">
      <VStack gap="space-32" className="mt-4">
        {årsakstekster.length > 0 ? (
          <>
            <List>
              {årsakstekster.map(tekst => (
                <List.Item key={tekst}>{tekst}</List.Item>
              ))}
            </List>
          </>
        ) : null}

        <Link to="/">Gå til forsiden</Link>
      </VStack>
    </BigError>
  );
};

export default ForbiddenPage;
