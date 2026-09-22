import { resolveLoginURL, withRedirectToCurrentLocation } from '@k9-sak-web/backend/shared/auth/resolveLoginURL.js';
import type { ExtendedApiError } from '@k9-sak-web/backend/shared/errorhandling/ExtendedApiError.js';
import { EnterIcon } from '@navikt/aksel-icons';
import { BodyLong, List } from '@navikt/ds-react';
import type { ReactNode } from 'react';
import { reloadAction, reloadActionWithFormResetWarning, restartAction } from './ErrorFixAction.js';
import type { ErrorViewProps } from './resolveErrorViewProps.js';

// Utleder feilmelding og anbefalt handling som blir vist for ulike ExtendedApiError varianter.
// Slik at bruker forhåpentlegvis kan forstå kva som har gått gale og korrigere viss mulig.
export const resolveApiErrorViewProps = (error: ExtendedApiError): ErrorViewProps => {
  let title = 'Oi! Noe gikk galt';
  let errorInfo: ReactNode = <BodyLong>Det oppsto en feil i systemet.</BodyLong>;
  let fixAction = reloadAction;

  if (error.isUnauthorized) {
    const loginUrl = withRedirectToCurrentLocation(resolveLoginURL(error.location))?.toString() ?? '/';
    fixAction = {
      info: 'Prøv å logge inn på nytt. Meld feil i Porten hvis du ikke får løst den selv.',
      button: {
        label: 'Logg inn',
        icon: <EnterIcon />,
        href: loginUrl,
      },
    };
    title = 'Ikke innlogget';
    errorInfo = <BodyLong>Du er ikke innlogget.</BodyLong>;
  } else if (error.isForbidden) {
    const årsakstekster = error.resolveÅrsakIkkeTilgangTekster();
    title = 'Ikke tilgang';
    errorInfo =
      årsakstekster.length > 0 ? (
        <List>
          {årsakstekster.map(tekst => (
            <List.Item key={tekst}>{tekst}</List.Item>
          ))}
        </List>
      ) : (
        <BodyLong>Du har ikke tilgang til å gjøre denne handlingen eller se denne informasjonen.</BodyLong>
      );
    fixAction = {
      ...restartAction,
      info: (
        <>
          <BodyLong>
            Hvis du mener at du skal ha rolle/rettighet til dette, tar du kontakt med din ident-ansvarlig.
          </BodyLong>
          <BodyLong>Hvis du vet at du har den nødvendige tilgangen, melder du feilen i Porten.</BodyLong>
        </>
      ),
    };
  } else if (error.isNotFound) {
    title = 'Finner ikke det du spør om';
    errorInfo = 'Systemet finner ikke det du ber om.';
    fixAction = {
      ...restartAction,
      info: (
        <>
          <BodyLong>Prøv å starte på nytt fra forsiden.</BodyLong>
          <BodyLong>Meld feil i Porten hvis du ikke får løst den selv.</BodyLong>
        </>
      ),
    };
  } else if (error.isBadRequest) {
    const feilmelding = error.bodyFeilmelding;
    const harFeilmelding = feilmelding != null && feilmelding.trim().length > 5;

    title = 'Innsendt forespørsel var ugyldig';
    errorInfo = harFeilmelding ? (
      <BodyLong weight="semibold">{feilmelding}</BodyLong>
    ) : (
      <BodyLong>Et eller flere av feltene er enten fylt inn feil eller mangler utfylling.</BodyLong>
    );
    fixAction = {
      info: harFeilmelding ? (
        <>
          <BodyLong>
            Korriger feil rapportert i feilmeldingen over. Prøv deretter å utføre handlingen som feilet på nytt.
          </BodyLong>
          <BodyLong>Meld feil i porten hvis du ikke får løst det.</BodyLong>
        </>
      ) : (
        <>
          <BodyLong>Se over feltene og vær sikker på at du har fylt dem inn riktig, før du prøver på nytt.</BodyLong>
          <BodyLong>Meld feil i porten hvis du ikke får løst det.</BodyLong>
        </>
      ),
    };
  } else if (error.isConflict) {
    title = 'Saksinformasjonen er utdatert';
    errorInfo = (
      <BodyLong>
        Saken har blitt oppdatert med ny informasjon av systemet eller av en annen saksbehandler mens du har jobbet med
        den.
      </BodyLong>
    );
    fixAction = reloadActionWithFormResetWarning;
  } else if (error.isGatewayTimeout) {
    title = 'Dette tok for lang tid';
    errorInfo = 'Systemet har brukt for lang tid på å svare deg.';
    fixAction = reloadAction;
  }

  return {
    error,
    title,
    errorInfo,
    fixAction,
  };
};
