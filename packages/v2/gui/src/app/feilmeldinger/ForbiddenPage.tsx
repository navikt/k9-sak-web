import { List, VStack } from '@navikt/ds-react';
import { Link } from 'react-router';

import { BigError } from '@k9-sak-web/gui/app/feilmeldinger/BigError.js';
import type { ÅrsakIkkeTilgang } from '@k9-sak-web/backend/shared/errorhandling/ÅrsakIkkeTilgang.js';

const årsak_tekst: Record<ÅrsakIkkeTilgang, string> = {
  HAR_IKKE_TILGANG_TIL_KODE6_PERSON: 'Du mangler tilgang til saker med strengt fortrolig adresse (kode 6)',
  HAR_IKKE_TILGANG_TIL_KODE7_PERSON: 'Du mangler tilgang til saker med fortrolig adresse (kode 7)',
  HAR_IKKE_TILGANG_TIL_EGEN_ANSATT: 'Du mangler tilgang til saker som gjelder Nav-ansatte',
  HAR_IKKE_TILGANG_TIL_HISTORISK_SAK: 'Du mangler tilgang til historiske saker',
  HAR_IKKE_TILGANG_TIL_APPLIKASJONEN: 'Du er ikke tildelt en rolle som gir tilgang til k9-sak',
  HAR_IKKE_TILGANG_TIL_TJENESTE_FOR_BORGER: 'Tjenesten er ikke tilgjengelig for borgere',
  HAR_IKKE_TILGANG_TIL_TJENESTE_FOR_DRIFT: 'Du mangler driftsrettigheter',
  HAR_IKKE_TILGANG_TIL_PIP_TJENESTE: 'Feil ved tilgangskontrolltjenesten',
  HAR_IKKE_TILGANG_ANNEN_GRUNN: 'Tilgang avslått av annen grunn',
  TEKNISK_FEIL: 'Teknisk feil ved tilgangskontroll',
};

interface ForbiddenPageProps {
  ikkeTilgangÅrsaker?: ÅrsakIkkeTilgang[];
}

const årsakerViØnskerÅVise: ÅrsakIkkeTilgang[] = [
  'HAR_IKKE_TILGANG_TIL_KODE6_PERSON',
  'HAR_IKKE_TILGANG_TIL_KODE7_PERSON',
  'HAR_IKKE_TILGANG_TIL_EGEN_ANSATT',
  'HAR_IKKE_TILGANG_TIL_HISTORISK_SAK',
  'HAR_IKKE_TILGANG_TIL_APPLIKASJONEN',
  'TEKNISK_FEIL',
];
const ForbiddenPage = ({ ikkeTilgangÅrsaker }: ForbiddenPageProps) => {
  const filtrerteÅrsaker = ikkeTilgangÅrsaker
    ? ikkeTilgangÅrsaker.filter(årsak => årsakerViØnskerÅVise.includes(årsak))
    : [];

  // Fjern duplikater i tilfelle samme årsak oppgis flere ganger
  const unikeÅrsaker = Array.from(new Set(filtrerteÅrsaker));

  return (
    <BigError title="Du har ikke tilgang til denne saken">
      <VStack gap="space-32" className="mt-4">
        {unikeÅrsaker.length > 0 ? (
          <>
            <List>
              {unikeÅrsaker.map(årsak => (
                <List.Item key={årsak}>{årsak_tekst[årsak] ?? årsak}</List.Item>
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
