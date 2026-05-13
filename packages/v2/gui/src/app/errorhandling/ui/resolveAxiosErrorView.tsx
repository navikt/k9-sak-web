import { AxiosError } from 'axios';
import { BodyLong } from '@navikt/ds-react';
import { EnterIcon } from '@navikt/aksel-icons';
import { resolveLoginURL, withRedirectToCurrentLocation } from '@k9-sak-web/backend/shared/auth/resolveLoginURL.js';
import { formatDate, timeFormat } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import type { ErrorViewProps } from './resolveErrorViewProps.js';
import { reloadAction, restartAction } from './ErrorHandlingWizard.js';

// Henter første del av URL-stien som kontekstnavn (f.eks. "k9-sak" -> "K9-SAK")
const findContextPath = (location: string): string => {
  try {
    const path = location.startsWith('http') ? new URL(location).pathname : location;
    return path.split('/')[1]?.toUpperCase() ?? '';
  } catch {
    return location.split('/')[1]?.toUpperCase() ?? '';
  }
};

// Sjekkar om data er eit objekt (ikkje null, ikkje array) og returnerer det som Record viss ja.
const asRecord = (data: unknown): Record<string, unknown> | null => {
  if (data != null && typeof data === 'object' && !Array.isArray(data)) {
    return data as Record<string, unknown>;
  }
  return null;
};

// Plukk ut feilmelding frå response body viss det er eit objekt med feilmelding/message felt.
const extractBodyMessage = (data: unknown): string | null => {
  if (typeof data === 'string') return data;
  const record = asRecord(data);
  if (record != null) {
    if (typeof record['feilmelding'] === 'string') return record['feilmelding'];
    if (typeof record['message'] === 'string') return record['message'];
  }
  return null;
};

// Spesialhandtering for status 418 (polling halted/delayed). Tilsvarer legacy POLLING_HALTED_OR_DELAYED.
const resolveTeapotProps = (error: AxiosError): Omit<ErrorViewProps, 'fixAction'> | null => {
  const data = asRecord(error.response?.data);
  if (data == null) return null;

  const status = typeof data['status'] === 'string' ? data['status'] : undefined;
  const eta = typeof data['eta'] === 'string' ? data['eta'] : undefined;
  const systemMelding = typeof data['message'] === 'string' ? data['message'] : undefined;

  if (status === 'HALTED') {
    return {
      title: 'Midlertidig feil',
      errorInfo: (
        <>
          <BodyLong>
            Noe feilet. Feilen kan være forbigående. Prøv å behandle saken litt senere. Om feilen oppstår igjen, meld
            den inn via porten.
          </BodyLong>
          {systemMelding != null ? (
            <BodyLong>
              <i>{systemMelding}</i>
            </BodyLong>
          ) : null}
        </>
      ),
    };
  }
  if (status === 'DELAYED') {
    return {
      title: 'Forsinket svar',
      errorInfo: (
        <>
          <BodyLong>
            Saksbehandlingsløsningen venter på et annet system som har nedetid nå. Du trenger ikke melde inn en feil,
            men prøv igjen {formatDate(eta ?? '')} kl. {timeFormat(eta ?? '')}.
          </BodyLong>
          {systemMelding != null ? (
            <BodyLong>
              <i>{systemMelding}</i>
            </BodyLong>
          ) : null}
        </>
      ),
    };
  }
  return null;
};

/**
 * Utled visningstekst og handling for ein AxiosError.
 *
 * Reimplementerer legacy logikk frå RequestErrorEventHandler + formatErrorMessage,
 * men jobbar direkte mot AxiosError i staden for å gå via EventType + extras.
 */
export const resolveAxiosErrorView = (error: AxiosError): ErrorViewProps => {
  const status = error.response?.status;
  const responseData = error.response?.data;
  const requestUrl = error.config?.url ?? error.response?.config?.url ?? '';
  const bodyMessage = extractBodyMessage(responseData);

  // 401 — Ikke innlogget. Bruk Location-header viss tilgjengeleg, elles standard login URL.
  if (status === 401) {
    const locationHeader = error.response?.headers?.['location'];
    const loginUrl =
      withRedirectToCurrentLocation(
        resolveLoginURL(typeof locationHeader === 'string' ? locationHeader : null),
      )?.toString() ?? '/';
    return {
      title: 'Ikke innlogget',
      errorInfo: <BodyLong>Du er ikke innlogget.</BodyLong>,
      fixAction: {
        label: 'Logg inn',
        icon: <EnterIcon />,
        href: loginUrl,
        info: 'Prøv å logge inn på nytt. Rapporter feil hvis det ikke løser problemet.',
      },
    };
  }

  // 403 — Tilgang nektet.
  if (status === 403) {
    return {
      title: 'Tilgang nektet',
      errorInfo: (
        <>
          <BodyLong>Din forespørsel til server ble avvist av tilgangskontroll.</BodyLong>
          <BodyLong>Kanskje du mangler rolletildeling for ressursen du prøvde å nå.</BodyLong>
          {bodyMessage != null ? (
            <BodyLong>
              <i>{bodyMessage}</i>
            </BodyLong>
          ) : null}
        </>
      ),
      fixAction: {
        ...reloadAction,
        info: <BodyLong>Hvis du mener du har nødvendige tilganger, rapporter dette som en feil i porten.</BodyLong>,
      },
    };
  }

  // 504 / 404 — gateway-timeout eller not-found. Tilsvarer legacy REQUEST_GATEWAY_TIMEOUT_OR_NOT_FOUND.
  if (status === 504 || status === 404) {
    const contextPath = requestUrl ? findContextPath(requestUrl) : '';
    return {
      title: status === 404 ? 'Ikke funnet' : 'Tidsavbrudd mot server',
      errorInfo: (
        <>
          <BodyLong>
            Får ikke kontakt med {contextPath} ({requestUrl}).
          </BodyLong>
          {bodyMessage != null ? (
            <BodyLong>
              <i>{bodyMessage}</i>
            </BodyLong>
          ) : null}
        </>
      ),
      fixAction: status === 404 ? { ...restartAction } : reloadAction,
    };
  }

  // 418 — polling halted / delayed (NB: I AxiosError-konteksten er dette typisk berre relevant for polling-kall).
  if (status === 418) {
    const teapot = resolveTeapotProps(error);
    if (teapot != null) {
      return { ...teapot, fixAction: reloadAction };
    }
  }

  // 400 — ugyldig forespørsel. Speglar resolveApiErrorViewProps.
  if (status === 400) {
    return {
      title: 'Ugyldig forespørsel',
      errorInfo: (
        <>
          <BodyLong>Noe var ugyldig med din forespørsel til serveren.</BodyLong>
          {bodyMessage != null ? (
            <BodyLong>
              <i>{bodyMessage}</i>
            </BodyLong>
          ) : null}
          <BodyLong>Prøv å kontrollere og korriger evt skjemadata du forsøker å sende til server.</BodyLong>
          <BodyLong>Rapporter feil i porten hvis du ikke får korrigert problemet selv.</BodyLong>
        </>
      ),
      fixAction: reloadAction,
    };
  }

  // Ingen response (typisk nettverksfeil / CORS / avbrutt).
  if (error.response == null) {
    return {
      title: 'Nettverksfeil',
      errorInfo: (
        <BodyLong>
          Klarte ikke nå serveren. <i>{error.message}</i>
        </BodyLong>
      ),
      fixAction: reloadAction,
    };
  }

  // Standard fallback: vis melding frå body eller error.message.
  return {
    title: 'Server forespørsel feilet',
    errorInfo: (
      <>
        <BodyLong>Din forespørsel til serveren feilet{status != null ? ` (${status})` : ''}.</BodyLong>
        {bodyMessage != null ? (
          <BodyLong>
            <i>{bodyMessage}</i>
          </BodyLong>
        ) : (
          <BodyLong>
            <i>{error.message}</i>
          </BodyLong>
        )}
      </>
    ),
    fixAction: reloadAction,
  };
};
