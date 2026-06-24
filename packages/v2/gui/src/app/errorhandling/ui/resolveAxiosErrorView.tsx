import { AxiosError } from 'axios';
import { BodyLong } from '@navikt/ds-react';
import { EnterIcon } from '@navikt/aksel-icons';
import { resolveLoginURL, withRedirectToCurrentLocation } from '@k9-sak-web/backend/shared/auth/resolveLoginURL.js';
import { formatDate, timeFormat } from '@k9-sak-web/gui/utils/formatters.js';
import type { ErrorViewProps } from './resolveErrorViewProps.js';
import { reloadAction, reloadActionWithFormResetWarning, restartAction } from './ErrorFixAction.js';
import { BlobResponseAxiosError } from '../legacycompat/BlobResponseAxiosError.js';
import {
  isÅrsakIkkeTilgangArray,
  type ÅrsakIkkeTilgang,
} from '@k9-sak-web/backend/shared/errorhandling/ÅrsakIkkeTilgang.js';

// Sjekkar om data er eit objekt (ikkje null, ikkje array) og returnerer det som Record viss ja.
const asRecord = (data: unknown): Record<string, unknown> | null => {
  if (data != null && typeof data === 'object' && !Array.isArray(data)) {
    return data as Record<string, unknown>;
  }
  return null;
};

// For BlobResponseAxiosError, parser responseText til objekt. Returnerer null viss parsing feiler.
const parseBlobResponseText = (error: AxiosError): unknown | null => {
  if (!(error instanceof BlobResponseAxiosError)) return null;
  try {
    return JSON.parse(error.responseText);
  } catch {
    return null;
  }
};

// Hent effektiv response-data: for blob-errors bruker vi parsa responseText, elles response.data
const getEffectiveResponseData = (error: AxiosError): unknown => {
  const parsed = parseBlobResponseText(error);
  if (parsed != null) return parsed;
  return error.response?.data;
};

// Spesialhandtering for status 418 (polling halted/delayed). Tilsvarer legacy POLLING_HALTED_OR_DELAYED.
const resolveTeapotProps = (error: AxiosError) => {
  const data = asRecord(getEffectiveResponseData(error));
  if (data == null) return null;

  const status = typeof data['status'] === 'string' ? data['status'] : undefined;
  const eta = typeof data['eta'] === 'string' ? data['eta'] : undefined;
  const systemMelding = typeof data['message'] === 'string' ? data['message'] : undefined;
  return { status, eta, systemMelding };
};

export const resolveAxiosErrorÅrsakIkkeTilgang = (error: AxiosError): ReadonlyArray<ÅrsakIkkeTilgang> => {
  if (error.status === 403) {
    const data = asRecord(getEffectiveResponseData(error));
    if (data != null && isÅrsakIkkeTilgangArray(data['ikkeTilgangÅrsaker'])) {
      return data['ikkeTilgangÅrsaker'];
    }
  }
  return [];
};

/**
 * Utled visningstekst og handling for ein AxiosError.
 *
 * Reimplementerer legacy logikk frå RequestErrorEventHandler + formatErrorMessage,
 * men jobbar direkte mot AxiosError i staden for å gå via EventType + extras.
 */
export const resolveAxiosErrorView = (error: AxiosError): ErrorViewProps => {
  const status = error.response?.status;

  // 401 — Ikke innlogget. Bruk Location-header viss tilgjengeleg, elles standard login URL.
  if (status === 401) {
    const locationHeader = error.response?.headers?.['location'];
    const loginUrl =
      withRedirectToCurrentLocation(
        resolveLoginURL(typeof locationHeader === 'string' ? locationHeader : null),
      )?.toString() ?? '/';
    return {
      error,
      title: 'Ikke innlogget',
      errorInfo: <BodyLong>Du er ikke innlogget.</BodyLong>,
      fixAction: {
        label: 'Logg inn',
        icon: <EnterIcon />,
        href: loginUrl,
        info: 'Prøv å logge inn på nytt. Meld feil i Porten hvis du ikke får løst den selv.',
      },
    };
  }

  // 403 — Tilgang nektet.
  if (status === 403) {
    return {
      error,
      title: 'Ikke tilgang',
      errorInfo: <BodyLong> Du har ikke tilgang til å gjøre denne handlingen eller se denne informasjonen. </BodyLong>,
      fixAction: {
        ...restartAction,
        info: (
          <>
            <BodyLong>
              Hvis du mener at du skal ha rolle/rettighet til dette, tar du kontakt med din ident-ansvarlig.
            </BodyLong>
            <BodyLong>Hvis du vet at du har den nødvendige tilgangen, melder du feilen i Porten.</BodyLong>
          </>
        ),
      },
    };
  }

  // 404 — not-found. Tilsvarer (en av) legacy REQUEST_GATEWAY_TIMEOUT_OR_NOT_FOUND.
  if (status === 404) {
    return {
      error,
      title: 'Finner ikke det du spør om',
      errorInfo: 'Systemet finner ikke det du ber om.',
      fixAction: {
        ...restartAction,
        info: (
          <>
            <BodyLong>Prøv å starte på nytt fra forsiden.</BodyLong>
            <BodyLong>Meld feil i Porten hvis du ikke får løst den selv.</BodyLong>
          </>
        ),
      },
    };
  }

  // 504 — gateway-timeout eller not-found. Tilsvarer legacy REQUEST_GATEWAY_TIMEOUT_OR_NOT_FOUND.
  if (status === 504) {
    return {
      error,
      title: 'Dette tok for lang tid',
      errorInfo: 'Systemet har brukt for lang tid på å svare deg.',
      fixAction: {
        ...reloadAction,
        info: (
          <>
            <BodyLong>Prøv å laste siden på nytt.</BodyLong>
            <BodyLong>Meld feil i porten hvis du ikke får løst den.</BodyLong>
          </>
        ),
      },
    };
  }

  if (status === 409) {
    return {
      error,
      title: 'Saksinformasjonen er utdatert',
      errorInfo: (
        <BodyLong>
          Saken har blitt oppdatert med ny informasjon av systemet eller av en annen saksbehandler mens du har jobbet
          med den.
        </BodyLong>
      ),
      fixAction: reloadActionWithFormResetWarning,
    };
  }

  // 418 — polling halted / delayed (NB: I AxiosError-konteksten er dette typisk berre relevant for polling-kall).
  if (status === 418) {
    const { status, eta } = resolveTeapotProps(error) ?? {};
    if (status === 'HALTED') {
      return {
        error,
        title: 'Oi! Noe gikk galt',
        errorInfo: 'Noe gikk galt, men feilen kan være midlertidig.',
        fixAction: {
          ...reloadAction,
          info: (
            <>
              <BodyLong>Prøv å laste siden på nytt eller komme tilbake til saken litt senere.</BodyLong>
              <BodyLong>Meld feilen i Porten hvis du ikke får løst det.</BodyLong>
            </>
          ),
        },
      };
    }
    if (status === 'DELAYED') {
      const tryAgainAfter = eta != null ? ` etter ${formatDate(eta)} kl. ${timeFormat(eta)}` : ` litt senere`;
      return {
        error,
        title: 'Venter fortsatt på svar',
        errorInfo: (
          <>
            <BodyLong>Saksbehandlingssystemet venter på et annet system som ikke svarer akkurat nå.</BodyLong>
            <BodyLong>Du trenger ikke melde inn en feil, men prøv igjen {tryAgainAfter}.</BodyLong>
          </>
        ),
        fixAction: {
          ...reloadAction,
          info: (
            <>
              <BodyLong>Prøv å laste siden på nytt.</BodyLong>
              <BodyLong>
                Sjekk driftsmeldinger eller rapporter feil i Porten, hvis den ikke løser seg etter hvert.
              </BodyLong>
            </>
          ),
        },
      };
    }
  }

  // 400 — ugyldig forespørsel. Speglar resolveApiErrorViewProps.
  if (status === 400) {
    return {
      error,
      title: 'Feltene mangler eller har feil informasjon',
      errorInfo: (
        <>
          <BodyLong>Et eller flere av feltene er enten fylt inn feil eller mangler utfylling.</BodyLong>
        </>
      ),
      fixAction: {
        ...reloadAction,
        info: (
          <>
            <BodyLong>Se over feltene og vær sikker på at du har fylt dem inn riktig, før du prøver på nytt.</BodyLong>
            <BodyLong>Obs! Hvis du trykker på "Last siden på nytt", må du fylle inn alle feltene på nytt.</BodyLong>
            <BodyLong>Meld feil i porten hvis du ikke får løst det.</BodyLong>
          </>
        ),
      },
    };
  }

  // Ingen response (typisk nettverksfeil / CORS / avbrutt).
  if (error.response == null) {
    return {
      error,
      title: 'Feil med nettverksforbindelse',
      errorInfo: (
        <>
          <BodyLong>Nettleseren din klarte ikke å få kontakt med systemet.</BodyLong>
          <BodyLong>
            <i>{error.message}</i>
          </BodyLong>
        </>
      ),
      fixAction: {
        ...reloadAction,
        info: (
          <>
            <BodyLong>Prøv å laste siden på nytt.</BodyLong>
            <BodyLong>Kontroller nettverksforbindelsen din eller sjekk driftsmeldinger.</BodyLong>
          </>
        ),
      },
    };
  }

  // Standard fallback: vis melding frå body eller error.message.
  return {
    error,
    title: 'Oi! Noe gikk galt',
    errorInfo: 'Det oppsto en feil i systemet.',
    fixAction: reloadAction,
  };
};
