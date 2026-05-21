import type { ReactNode } from 'react';
import type { ExtendedApiError } from '@k9-sak-web/backend/shared/errorhandling/ExtendedApiError.js';
import { resolveLoginURL, withRedirectToCurrentLocation } from '@k9-sak-web/backend/shared/auth/resolveLoginURL.js';
import { EnterIcon } from '@navikt/aksel-icons';
import { BodyLong } from '@navikt/ds-react';
import type { ErrorViewProps } from './resolveErrorViewProps.js';
import { reloadAction, restartAction } from './ErrorHandlingWizard.js';

// Utleder feilmelding og anbefalt handling som blir vist for ulike ExtendedApiError varianter.
// Slik at bruker forhåpentlegvis kan forstå kva som har gått gale og korrigere viss mulig.
export const resolveApiErrorViewProps = (error: ExtendedApiError): ErrorViewProps => {
  let title = 'Server forespørsel feilet';
  let errorInfo: ReactNode = (
    <>
      <BodyLong>Din forespørsel til serveren feilet.</BodyLong>
      {error.bodyFeilmelding != null ? (
        <BodyLong>
          <i>{error.bodyFeilmelding}</i>
        </BodyLong>
      ) : null}
    </>
  );
  let fixAction = reloadAction;

  if (error.isUnauthorized) {
    const loginUrl = withRedirectToCurrentLocation(resolveLoginURL(error.location))?.toString() ?? '/';
    fixAction = {
      label: 'Logg inn',
      icon: <EnterIcon />,
      href: loginUrl,
      info: 'Prøv å logge inn på nytt. Rapporter feil hvis det ikke løser problemet.',
    };
    title = 'Ikke innlogget';
    errorInfo = <BodyLong>Du er ikke innlogget.</BodyLong>;
  } else if (error.isForbidden) {
    title = 'Tilgang nektet';
    errorInfo = (
      <>
        <BodyLong>Din forespørsel til server ble avvist av tilgangskontroll.</BodyLong>
        <BodyLong>Kanskje du mangler rolletildeling for ressursen du prøvde å nå.</BodyLong>
      </>
    );
    fixAction = {
      ...reloadAction,
      info: <BodyLong>Hvis du mener du har nødvendige tilganger, rapporter dette som en feil i porten.</BodyLong>,
    };
  } else if (error.isNotFound) {
    title = 'Ikke funnet';
    errorInfo = (
      <>
        <BodyLong>
          Server svarte med <i>ikke funnet</i> på din forespørsel.
        </BodyLong>
        <BodyLong>
          Dette kan bety at data du forsøkte å hente/søke frem ikke finnes, eventuelt at du har fyllt inn feil
          oppslag/søkeinfo. Det kan også skyldes en teknisk feil.
        </BodyLong>
      </>
    );
    fixAction = {
      ...restartAction,
      info: 'Prøv å starte på nytt fra startsiden. Rapporter feil hvis det feiler etter nytt forsøk, og du har dobbeltsjekket evt søkeparametre.',
    };
  } else if (error.isBadRequest) {
    title = 'Ugyldig forespørsel';
    errorInfo = (
      <>
        <BodyLong>Noe var ugyldig med din forespørsel til serveren.</BodyLong>
        {error.bodyFeilmelding != null ? (
          <BodyLong>
            <i>{error.bodyFeilmelding}</i>
          </BodyLong>
        ) : null}
      </>
    );
    fixAction = {
      ...reloadAction,
      info: <>
        <BodyLong>Prøv å kontrollere og korriger evt skjemadata du forsøker å sende til server.</BodyLong>
        <BodyLong>Rapporter feil i porten hvis du ikke får korrigert problemet selv.</BodyLong>
      </>
    }
  }

  return {
    error,
    title,
    errorInfo,
    fixAction,
  };
};
