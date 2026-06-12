import { init } from '@sentry/browser';
import * as Sentry from '@sentry/react';
import React from 'react';
import { createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from 'react-router';
import { AxiosError } from 'axios';
import { ExtendedApiError } from '@k9-sak-web/backend/shared/errorhandling/ExtendedApiError.js';

// Vi ønsker ikkje å rapportere alle feil til Sentry, feks viss har utgått sesjon.
// Legg til fleire her ved behov.
export const shouldReportToSentry = (error: Error | null): boolean => {
  const apiError = ExtendedApiError.findInError(error);
  if (apiError != null) {
    const doNotReport = apiError.isUnauthorized;
    return !doNotReport;
  }
  return true;
};

// Når global sentry handler rapporterer feil blir sentryId til rapportert Error instans lagra i denne lookup map.
// Andre deler av koden som ønsker å få tak i sentryId til ein Error instans kan deretter slå opp her for å finne den.
// Brukast til å legge til sentryId i visning og utkopiert feilinformasjon, slik at vi kan slå opp feil rapportert frå
// brukarar direkte i sentry. Sidan det er ein WeakMap blir innhaldet automatisk fjerna når Error instans ikkje er "live" lenger.
export const sentryReportedErrorIdLookup = new WeakMap<Error, string>();

// Når global sentry handler rapporterer feil blir sentryId lagt til i denne lista. Når feilinformasjon blir kopiert ut
// for rapportering, inkluderer vi denne lista for å få ei komplett liste med feil rapportert sidan sist reload. Dette
// fordi feil som blir rapportert gjennom ErrorBoundary kan bli deduplisert av sentry, pga mange re-renderingar. Når det
// skjer vil siste feil som blir rendra i ErrorBoundary kanskje ikkje ha sentryId. Så for å kunne slå opp feil som har
// blitt rapportert inkluderer vi denne lista i feilinformasjonen.
export const sentryReportedIdList: string[] = [];

interface InitSentryOptions {
  dsn: string;
  enabled: boolean;
  release: string;
}

export function initSentry({ dsn, enabled, release }: InitSentryOptions) {
  const environment = window.location.hostname;

  init({
    environment,
    dsn,
    enabled,
    release,
    tracesSampleRate: 1.0,
    enableLogs: true,
    integrations: [
      Sentry.breadcrumbsIntegration({ console: false }),
      Sentry.reactRouterV6BrowserTracingIntegration({
        useEffect: React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      }),
    ],
    beforeSend: (event, hint) => {
      try {
        event.extra = event.extra || {};
        const exception = hint.originalException;
        // Slik at feilrapportering gui kan hente ut sentryId
        if (event.event_id != null) {
          sentryReportedIdList.push(event.event_id);
          if (sentryReportedIdList.length > 50) {
            sentryReportedIdList.shift(); // Veldig usansynleg, men unngå for stor array
          }
          if (exception instanceof Error) {
            sentryReportedErrorIdLookup.set(exception, event.event_id);
          }
        }
        if (exception instanceof AxiosError) {
          let pathname = '';
          const responseURL = exception.request?.responseURL ?? '';
          if (responseURL.length > 0) {
            const requestUrl = new URL(responseURL);
            pathname = requestUrl.pathname;
          }
          event.fingerprint = ['{{ default }}', String(exception.name), String(exception.message), String(pathname)];
          event.extra['callId'] = exception?.response?.config.headers['Nav-Callid'];
        } else if (exception instanceof ExtendedApiError) {
          event.fingerprint = ['{{ default }}', exception.name, exception.statusText, exception.url];
          event.tags = event.tags ?? {};
          event.tags['callId'] = exception.navCallid;
        }
      } catch (e) {
        try {
          if (event.exception?.values != null) {
            event.exception.values.push(e as Sentry.Exception);
          }
          console.error('Sentry beforeSend failure. Will send the original event with extra error attached', e);
        } catch (e2) {
          console.error(
            'Sentry beforeSend failure. Will send the original event. Attaching of extra error also failed',
            e,
            e2,
          );
        }
      }
      return event;
    },
  });
}
